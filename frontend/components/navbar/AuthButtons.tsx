import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AuthButtons() {
  return (
    <>
      <Link href="/signin">
        <Button>Sign In</Button>
      </Link>
      <Link href="/signup" className='hidden md:block'>
        <Button variant="outline">Sign Up</Button>
      </Link>
    </>
  )
}

