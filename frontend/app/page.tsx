import { getUser } from '@/lib/auth'
import { Navbar } from '@/components/navbar/Navbar'
import { OnlineUsers } from '@/components/online-users/OnlineUsers'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Home() {
  const user = await getUser()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-grow flex flex-col items-center justify-center p-4 bg-[url('/background.jpg')] bg-cover bg-center">
        <div className="text-center space-y-6 bg-background/80 p-8 rounded-lg backdrop-blur-sm">
          <h1 className="text-4xl font-bold">Welcome to Blind CURAJ</h1>
          <p className="text-xl">
            Connect with fellow university students in random chats!
          </p>
          <OnlineUsers />
          {user ? (
            <Link href="/chat">
              <Button size="lg">Connect Now</Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
          )}
        </div>
      </main>
      <footer className="text-center p-4">
        © 2023 Blind CURAJ. All rights reserved.
      </footer>
    </div>
  )
}

