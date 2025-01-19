import AttendanceScanner from '@/components/AttendanceScanner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <ThemeToggle />
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">AASTU Cafeteria Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceScanner />
        </CardContent>
      </Card>
    </div>
  )
}

