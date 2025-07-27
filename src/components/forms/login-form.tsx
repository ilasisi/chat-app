'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { AxiosErrorWithMessage } from '@/types/auth';
import { toast } from 'sonner';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const mutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      return await api.post('/auth/login', payload);
    },
    onSuccess: (response) => {
      const { data } = response;

      if (data.access_token) {
        router.push('/conversations');
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('logged_user', JSON.stringify(data.user));
        toast.success('Login successful! Redirecting to conversations...');
      }
    },
    onError: (error) => {
      const err = error as AxiosErrorWithMessage;
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err?.message || 'Login failed failed');
      }
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(data);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  name='email'
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                  onChange={handleChange}
                />
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                </div>
                <Input
                  name='password'
                  id='password'
                  type='password'
                  placeholder='********'
                  required
                  onChange={handleChange}
                />
              </div>
              <div className='flex flex-col gap-3'>
                <Button
                  type='submit'
                  className='w-full'
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </div>
            <div className='mt-4 text-center text-sm'>
              Don&apos;t have an account?{' '}
              <Link href='/register' className='underline underline-offset-4'>
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
