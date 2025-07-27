'use client';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DashLayout } from '@/components/ui/layouts/dash-layout';
import { Message } from '@/types/conversation';

export default function ChatMessagesPage() {
  const { userId } = useParams<{ userId: string }>();
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      const { data } = await api.get(`/chat/messages/${userId}`);
      return data as Message[];
    },
    refetchInterval: 3000,
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      await api.post('/chat/send', { recipientId: userId, content });
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', userId] });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          onSubmit={(e) => {
            e.preventDefault();
            if (message.trim()) {
              sendMessage.mutate(message);
            }
          }}
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
