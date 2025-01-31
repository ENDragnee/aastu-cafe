"use client"
import { useState } from 'react'
import AttendanceScanner from '@/components/AttendanceScanner'
import ExportAttendance from '@/components/ExportPage'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession } from 'next-auth/react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('scanner');
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <ThemeToggle />
      <main className="flex-grow container mx-auto px-4 py-8">
      <div className="mb-4 flex justify-center items-center">
        <Button
          onClick={() => setActiveTab('scanner')}
          variant={activeTab === 'scanner' ? 'default' : 'outline'}
        >
          Scanner
        </Button>
        { status == "authenticated" && (
          <Button
            onClick={() => setActiveTab('export')}
            variant={activeTab === 'export' ? 'default' : 'outline'}
            className="ml-2"
          >
            Manage
          </Button>
        )}
      </div>

      {activeTab === 'scanner' ? (
        <AttendanceScanner />
      ) : (
        <ExportAttendance />
      )}      </main>
    </div>
  )
}

