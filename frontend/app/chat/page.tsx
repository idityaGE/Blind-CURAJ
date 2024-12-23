import { cookies } from 'next/headers';
import { ChatInterface } from '@/components/chat/chat-interface';
import { ChatProvider } from '@/components/chat/chat-context';
import { Navbar } from '@/components/navbar/Navbar';
import { getUser } from '@/lib/auth';

export default async function ChatPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const user = await getUser();

  return (
    <ChatProvider token={token}>
      <div className="flex flex-col h-screen bg-background">
        <Navbar user={user} />
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-3xl flex flex-col">
            <ChatInterface />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}