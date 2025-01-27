import AttendanceScanner from '@/components/AttendanceScanner'
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <ThemeToggle />
      <main className="flex-grow container mx-auto px-4 py-8">
        <AttendanceScanner />
      </main>
    </div>
  )
}

