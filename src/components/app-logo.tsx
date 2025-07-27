import { GalleryVerticalEnd } from 'lucide-react';

export const AppLogo = () => {
  return (
    <div className='flex items-center gap-2'>
      <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
        <GalleryVerticalEnd className='size-4' />
      </div>
      <div className='grid flex-1 text-left text-sm leading-tight'>
        <span className='text-2xl font-bold'>NotZero Chat</span>
      </div>
    </div>
  );
};
