import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AuthButtons() {
  return (
    <>
      <Link href="/signin">
        <Button variant="ghost">Sign In</Button>
      </Link>
      <Link href="/signup">
        <Button>Sign Up</Button>
      </Link>
    </>
  )
}

