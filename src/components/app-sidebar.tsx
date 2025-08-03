import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { AppLogo } from './app-logo';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/types/auth';
import api from '@/lib/axios';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn, getInitials } from '@/lib/utils';
import { Conversation } from '@/types/conversation';
import { NavUser } from './nav-user';
import { useParams } from 'next/navigation';
import { Fragment } from 'react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userId } = useParams<{ userId: string }>();
  const { data: conversations, isLoading } = useQuery({
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
  });

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <AppLogo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {conversations && conversations?.length > 0 && (
            <SidebarGroupLabel>Active Conversations</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className='space-y-2'>
              {isLoading ? (
                <SidebarMenuItem>Loading...</SidebarMenuItem>
              ) : (
                <Fragment>
                  {conversations?.map((conversation) => (
                    <SidebarMenuItem
                      key={conversation.id}
                      className={cn(
                        'bg-neutral-100 rounded-lg',
                        userId === conversation?.other_participant?.id &&
                          'bg-primary'
                      )}
                    >
                      <SidebarMenuButton
                        className='h-auto hover:bg-transparent'
                        asChild
                      >
                        <Link
                          href={`/conversations/${conversation?.other_participant?.id}`}
                        >
                          <Avatar>
                            <AvatarImage
                              src={
                                conversation.other_participant?.avatar_url ?? ''
                              }
                              alt='user avatar'
                            />
                            <AvatarFallback
                              className={cn(
                                'bg-primary text-white',
                                userId ===
                                  conversation?.other_participant?.id &&
                                  'bg-white text-primary'
                              )}
                            >
                              {getInitials(
                                conversation?.other_participant?.full_name
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className='space-y-1 w-full'>
                            <div className='flex items-center justify-between gap-2'>
                              <p
                                className={cn(
                                  'font-medium line-clamp-1',
                                  userId ===
                                    conversation?.other_participant?.id &&
                                    'text-white font-bold'
                                )}
                              >
                                {conversation?.other_participant?.full_name}
                              </p>
                              <p
                                className={cn(
                                  'text-xs text-neutral-500 whitespace-nowrap',
                                  userId ===
                                    conversation.other_participant?.id &&
                                    'text-neutral-100'
                                )}
                              >
                                {new Date(
                                  conversation.last_message?.created_at ??
                                    new Date()
                                ).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <p
                              className={cn(
                                'text-xs line-clamp-1 text-neutral-600',
                                userId ===
                                  conversation?.other_participant?.id &&
                                  'text-neutral-100'
                              )}
                            >
                              {conversation.last_message?.content}
                            </p>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </Fragment>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {users && users?.length > 0 && (
            <SidebarGroupLabel>Active Users</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className='space-y-2'>
              {usersLoading ? (
                <SidebarMenuItem>Loading...</SidebarMenuItem>
              ) : (
                users?.map((user) => (
                  <SidebarMenuItem
                    key={user.id}
                    className='bg-neutral-100 rounded-lg py-1'
                  >
                    <SidebarMenuButton asChild>
                      <Link href={`/conversations/${user.id}`}>
                        <Avatar>
                          <AvatarImage
                            src={user.avatar_url ?? ''}
                            alt='user avatar'
                          />
                          <AvatarFallback className='bg-blue-700 text-white'>
                            {getInitials(user.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <p className='font-medium'>{user.full_name}</p>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
