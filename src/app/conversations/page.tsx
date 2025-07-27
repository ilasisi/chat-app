'use client';

import { DashLayout } from '@/components/ui/layouts/dash-layout';
import { User } from '@/types/auth';

export default function ConversationsPage() {
  const loggedUser: User = JSON.parse(
    localStorage.getItem('logged_user') || '{}'
  );

  return (
    <DashLayout>
      <div className='h-screen flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <p className='text-2xl sm:text-4xl font-bold'>
            Welcome {loggedUser.full_name}
          </p>
          <p className='text-lg sm:text-xl text-gray-600'>
            Click on any user on the sidebar to start chatting with them.
          </p>
        </div>
      </div>
    </DashLayout>
  );
}
