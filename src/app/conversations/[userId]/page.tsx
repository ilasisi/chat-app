'use client';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DashLayout } from '@/components/ui/layouts/dash-layout';
import { Message } from '@/types/conversation';
import { usePusher } from '@/hooks/use-pusher';
import { User } from '@/types/auth';

export default function ChatMessagesPage() {
  const { pusher, isConnected } = usePusher();
  const { userId } = useParams<{ userId: string }>();
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loggedUser: User =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('logged_user') || '{}')
      : {};

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      const { data } = await api.get(`/chat/messages/${userId}`);
      return data as Message[];
    },
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      await api.post('/chat/send', { recipientId: userId, content });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!pusher || !isConnected || !userId || !messages?.length) return;

    const channel = pusher.subscribe(`user-${messages[0].conversation_id}`);

    channel.bind('new-message', (data: { message: Message }) => {
      if (data.message.sender_id !== loggedUser.id) {
        handleNewMessage(data.message);
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`user-${messages[0].conversation_id}`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pusher, isConnected, userId, messages]);

  const handleNewMessage = (data: Message) => {
    queryClient.setQueryData(
      ['messages', userId],
      (old: Message[] | undefined) => {
        if (!old) return [];
        return [...old, data];
      }
    );
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      handleNewMessage({
        id: `temp-${Date.now()}`,
        conversation_id: messages?.[0]?.conversation_id || '',
        sender_id: loggedUser.id,
        content: message.trim(),
        message_type: 'text',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sender: {
          id: loggedUser.id,
          username: loggedUser.username,
          full_name: loggedUser.full_name,
          avatar_url: loggedUser.avatar_url,
        },
      });

      sendMessage.mutate(message.trim());

      setMessage('');
    }
  };

  return (
    <DashLayout>
      <div className='flex flex-col h-screen'>
        <div className='flex-1 overflow-y-auto p-4 space-y-2'>
          {isLoading ? (
            <div>Loading conversations...</div>
          ) : (
            messages?.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender_id !== userId ? 'justify-end' : 'justify-start'
                }`}
              >
                <div>
                  <p className='text-sm font-medium text-gray-900 mb-1'>
                    {msg.sender_id !== userId
                      ? 'You'
                      : msg.sender.full_name || msg.sender.username}
                  </p>
                  <div
                    className={`rounded-lg px-4 py-2 max-w-xs shadow text-sm whitespace-pre-line ${
                      msg.sender_id !== userId
                        ? 'bg-blue-100 text-right'
                        : 'bg-neutral-100'
                    }`}
                  >
                    <div>{msg.content}</div>
                    <div className='text-[10px] text-gray-400 mt-1 text-right'>
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={handleSendMessage}
          className='flex items-center gap-2 py-4'
        >
          <Input
            className='flex-1 rounded-full'
            placeholder='Type a message...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sendMessage.isPending}
          />
          <Button
            type='submit'
            disabled={sendMessage.isPending || !message.trim()}
          >
            Send
          </Button>
        </form>
      </div>
    </DashLayout>
  );
}
