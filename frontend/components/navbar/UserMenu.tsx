'use client'

import { LogOut, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/hooks/useAuth'

import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

import { ChangeName } from './change-name'


interface UserMenuProps {
  user: {
    id: string
    email: string
    name: string
    isVerified: boolean
    createdAt: Date
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const { logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
        duration: 3000,
      })
      // Optionally redirect after successful logout
      router.push('/login')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Please try again later",
        duration: 3000,
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src={`https://github.com/shadcn.png`} alt={user.name} />
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <DropdownMenuLabel className="font-bold text-lg pb-2">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem className="cursor-pointer hover:bg-accent rounded-md transition-colors">
          <User className="mr-2 h-5 w-5" />
          <span className="font-medium">Profile</span>
        </DropdownMenuItem>
        <div className="px-2 py-6 space-y-4">
          <div className='flex items-center justify-between'>
            <p className="text-sm"><span className="font-medium">Name:</span> {user.name}</p>
            <ChangeName onSuccess={() => {
              router.refresh()
            }} />
          </div>
          <p className="text-sm"><span className="font-medium">Email:</span> {user.email}</p>
          <p className="text-sm">
            <span className="font-medium">Verified:</span>
            <span className={user.isVerified ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
              {user.isVerified ? 'Yes' : 'No'}
            </span>
          </p>
          <p className="text-sm">
            <span className="font-medium">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer hover:bg-red-100 dark:hover:bg-red-900 text-red-600 rounded-md transition-colors"
        >
          <LogOut className="mr-2 h-5 w-5" />
          <span className="font-medium">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}