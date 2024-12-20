'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
  const { theme, setTheme } = useTheme()

  return (
    <nav className="flex items-center justify-between p-4">
      <Link href="/" className="text-2xl font-bold">
        Blind CURAJ
      </Link>
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
        {user ? (
          <span className="text-sm">Welcome, {user.name}</span>
        ) : (
          <>
            <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

