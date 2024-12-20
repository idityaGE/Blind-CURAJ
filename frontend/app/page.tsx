import { getUser } from '@/lib/auth'
import { Navbar } from '@/components/navbar/Navbar'
import { LandingHero } from '@/components/landing/hero';
import { OnlineUsers } from '@/components/landing/online-users';


export default async function Home() {
  const user = await getUser()

  return (
    <div className="max-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto px-4 py-16">
          <LandingHero user={user} />
          <OnlineUsers />
        </div>
      </main>
    </div>
  )
}
