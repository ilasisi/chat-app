'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: async (payload: {
      username: string;
      full_name: string;
      email: string;
      password: string;
    }) => {
      const { data } = await api.post('/auth/register', payload);
      return data;
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({ username, full_name: fullName, email, password });
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type='text'
              placeholder='Full Name'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type='submit'
              disabled={mutation.isPending}
              className='w-full'
            >
              {mutation.isPending ? 'Registering...' : 'Register'}
            </Button>
          </form>
          {mutation.isError && (
            <div className='text-red-500 mt-2'>
              {mutation.error instanceof Error
                ? mutation.error.message
                : 'Registration failed'}
            </div>
          )}
          {mutation.isSuccess && (
            <pre className='mt-4 p-2 bg-gray-100 rounded text-xs overflow-x-auto'>
              {JSON.stringify(mutation.data, null, 2)}
            </pre>
          )}
          <div className='mt-6 text-center text-sm'>
            Already have an account?{' '}
            <Link href='/' className='text-primary underline hover:opacity-80'>
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
