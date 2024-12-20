'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { UserMenu } from './UserMenu'
import { AuthButtons } from './AuthButtons'

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
    <nav className="flex items-center justify-between p-4">
      <Link href="/" className="text-2xl font-bold">
        Blind CURAJ
      </Link>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {user ? <UserMenu user={user} /> : <AuthButtons />}
      </div>
    </nav>
  )
}

