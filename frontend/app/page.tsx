import { getUser } from '@/lib/auth'
import { Navbar } from '@/components/navbar/Navbar'
import { LandingHero } from '@/components/landing/hero';
import StatsDisplay from '@/components/landing/online-users';
import { cookies } from 'next/headers';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/footer';
import Image from 'next/image';

export default async function Home() {
  const user = await getUser()
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  return (
    <div className="max-h-screen flex flex-col w-full relative">
      <Navbar user={user} />
      <Image
        width={1920}
        height={1080}
        src="https://res.cloudinary.com/dwdbqwqxk/image/upload/v1730213921/gradient_zecf4g.webp"
        alt="Gradient IMG"
        className="absolute left-0 sm:left-1/2 top-0 -z-10 -translate-x-1/2 lg:scale-100 object-cover"
      />
      <div className='container max-w-4xl mx-auto min-h-screen flex flex-col pt-4'>
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <LandingHero user={user} />
          <div className='pt-14'>
            <StatsDisplay token={token} />
          </div>
          <FAQ />
          <Footer />
        </div>
      </div>

    </div>
  )
}

