import { getUser } from '@/lib/auth'
import { Navbar } from '@/components/navbar/Navbar'
import { LandingHero } from '@/components/landing/hero';
import StatsDisplay from '@/components/landing/online-users';
import { cookies } from 'next/headers';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/footer';



export default async function Home() {
  const user = await getUser()
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  return (
    <div className="max-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <LandingHero user={user} />
          <StatsDisplay token={token} />
          <FAQ />
          <Footer />
        </div>
      </main>
    </div>
  )
}

