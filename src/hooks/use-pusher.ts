'use client';

import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';

let pusherInstance: Pusher | null = null;
let connectionListeners = 0;

export const usePusher = () => {
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!pusherInstance) {
      pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        forceTLS: true,
      });

      pusherInstance.connection.bind('connected', () => {
        console.log('Pusher connected');
      });

      pusherInstance.connection.bind('disconnected', () => {
        console.log('Pusher disconnected');
      });
    }

    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);

    pusherInstance.connection.bind('connected', handleConnected);
    pusherInstance.connection.bind('disconnected', handleDisconnected);

    setIsConnected(pusherInstance.connection.state === 'connected');
    setPusher(pusherInstance);
    connectionListeners++;

    return () => {
      pusherInstance?.connection.unbind('connected', handleConnected);
      pusherInstance?.connection.unbind('disconnected', handleDisconnected);
      connectionListeners--;

      if (connectionListeners === 0 && pusherInstance) {
        pusherInstance.disconnect();
        pusherInstance = null;
      }
    };
  }, []);

  return { pusher, isConnected };
};
