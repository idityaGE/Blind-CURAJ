import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="container mx-auto py-8">
      <div className="grid gap-6">
        <div className="not-prose flex flex-col gap-6">
          <Link href="/">
            <h3 className="sr-only">University Chat Platform</h3>
            <Image
              src="https://components.bridger.to/_next/static/media/logo.f5329ef0.svg"
              alt="University Chat Logo"
              width={120}
              height={27.27}
              className="transition-all hover:opacity-75 dark:invert"
            />
          </Link>
          <div>
            <h3 className="text-lg text-muted-foreground">
              A secure and anonymous chat platform exclusively for university students.
              Connect with your peers while maintaining your privacy.
            </h3>
          </div>
        </div>
      </div>
      <div className="w-full h-[3px] bg-gray-700 rounded-md my-4"></div>
      <div className="not-prose flex flex-col justify-between gap-6 md:flex-row md:items-center md:gap-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            asChild
          >
            <Link href="https://github.com/idityaGE" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            asChild
          >
            <Link href="https://x.com/idityage" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground text-sm text-center md:text-left">
          © {new Date().getFullYear()} University Chat Platform.
          Built and maintained by students.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}