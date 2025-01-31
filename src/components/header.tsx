"use client"
import Image from "next/image"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react';


export default function Header() {
  const router = useRouter()
  const {data: session, status} = useSession()

  return (
    <header className="dark:bg-gray-900 py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <button 
          onClick={() => router.push('/')}
          className="text-2xl font-bold text-muted-tan hover:opacity-80 transition-opacity"
        >
          AASTU Cafe Attendance
        </button>
        
        <div className="flex items-center gap-4">
          { status == "authenticated" ?(
            <Button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Sign Out</Button>
            
          ): (
            
            <Button onClick={() => router.push('/auth/signin')} className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800">Sign In</Button>
          )}
          <Image 
            src="/aastu.png" 
            alt="University Logo" 
            width={100} 
            height={80} 
            className="rounded-lg" 
          />
        </div>
      </div>
    </header>
  )
}