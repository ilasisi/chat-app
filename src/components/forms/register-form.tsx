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

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [data, setData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
  });

  const mutation = useMutation({
    mutationFn: async (payload: {
      username: string;
      full_name: string;
      email: string;
      password: string;
    }) => {
      return await api.post('/auth/register', payload);
    },
    onSuccess: () => {
      router.push('/');
      toast.success('Account created successfully! Please login.');
    },
    onError: (error) => {
      const err = error as AxiosErrorWithMessage;
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err?.message || 'Registration failed');
      }
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(data);
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your personal information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  name='username'
                  id='username'
                  type='text'
                  placeholder='e.g. ilasisi'
                  required
                  onChange={handleChange}
                />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='fullName'>Full name</Label>
                <Input
                  name='full_name'
                  id='fullName'
                  type='text'
                  placeholder='John Doe'
                  required
                  onChange={handleChange}
                />
              </div>
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
                  {mutation.isPending ? 'Signing up...' : 'Signup'}
                </Button>
              </div>
            </div>
            <div className='mt-4 text-center text-sm'>
              Already have an account?{' '}
              <Link href='/' className='underline underline-offset-4'>
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
