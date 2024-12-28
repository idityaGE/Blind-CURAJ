'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { UserMenu } from './UserMenu'
import { AuthButtons } from './AuthButtons'
import GitButton from '../btn/github-btn'
import { studentEmailConfig } from '@/config/student-email.config'

interface NavbarProps {
  user: {
    id: string
    email: string
    name: string
    isVerified: boolean
    createdAt: Date
  } | null
}

export function Navbar({ user }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between p-4 md:p-6">
      <Link href="/" className="text-xl md:text-2xl font-bold font-mono">
        Blind {studentEmailConfig.college.shortHand}
      </Link>
      <div className="flex items-center space-x-4 md:space-x-6">
        <div className='hidden md:block'>
          <GitButton />
        </div>
        <ThemeToggle />
        {user ? <UserMenu user={user} /> : <AuthButtons />}
      </div>
    </nav>
  )
}

