'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
}

interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  other_participant: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
  last_message: {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    message_type: string;
    created_at: string;
    updated_at: string;
  } | null;
}

export default function ConversationsPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    data: conversations,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await api.get('/chat/conversations');
      return data as Conversation[];
    },
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data as User[];
    },
    enabled: open,
  });

  const sendMessage = useMutation({
    mutationFn: async (recipientId: string) => {
      const { data } = await api.post('/chat/send', {
        recipientId,
        content: 'Hi!',
      });
      return data;
    },
  });

  const handleUserClick = async (user: User) => {
    setOpen(false);
    // Check if conversation exists
    const existing = conversations?.find(
      (c) => c.other_participant.id === user.id
    );
    if (existing) {
      router.push(`/chat/messages/${user.id}`);
    } else {
      await sendMessage.mutateAsync(user.id);
      router.push(`/chat/messages/${user.id}`);
    }
  };

  if (isLoading) return <div className='p-8'>Loading conversations...</div>;
  if (isError)
    return (
      <div className='p-8 text-red-500'>
        Error:{' '}
        {error instanceof Error
          ? error.message
          : 'Failed to load conversations'}
      </div>
    );

  return (
    <div className='max-w-2xl mx-auto p-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Conversations</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant='outline'>Start New Chat</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select a user to chat with</DialogTitle>
            </DialogHeader>
            {usersLoading ? (
              <div>Loading users...</div>
            ) : (
              <ul className='space-y-2'>
                {users?.map((user) => (
                  <li key={user.id}>
                    <Button
                      variant='ghost'
                      className='w-full justify-start'
                      onClick={() => handleUserClick(user)}
                    >
                      {user.full_name} (@{user.username})
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <ul className='space-y-4'>
        {conversations && conversations.length > 0 ? (
          conversations.map((conv: Conversation) => (
            <li
              key={conv.id}
              className='border cursor-pointer rounded-lg p-4 flex flex-col gap-2 bg-white shadow-sm'
              onClick={() =>
                router.push(`/chat/messages/${conv.other_participant.id}`)
              }
            >
              <div className='font-semibold'>
                {conv.other_participant.full_name} (@
                {conv.other_participant.username})
              </div>
              <div className='text-sm text-gray-500'>
                Last message: {conv.last_message?.content || 'No messages yet'}
              </div>
              <div className='text-xs text-gray-400'>
                Updated: {new Date(conv.updated_at).toLocaleString()}
              </div>
            </li>
          ))
        ) : (
          <li className='text-gray-500'>No conversations found.</li>
        )}
      </ul>
    </div>
  );
}
