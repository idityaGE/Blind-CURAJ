import { cookies } from 'next/headers';
import { ChatInterface } from '@/components/chat/chat-interface';
import { ChatProvider } from '@/components/chat/chat-context';

export default async function ChatPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  return (
    <ChatProvider token={token}>
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex flex-col">
          <ChatInterface />
        </div>
      </div>
    </ChatProvider>
  );
}