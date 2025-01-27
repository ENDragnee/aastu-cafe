import Image from "next/image"

export default function Header() {
  return (
    <header className="dark:bg-gray-900 py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-muted-tan">AASTU Cafe Attendance</h1>
        <Image src="/aastu.png" alt="University Logo" width={100} height={80} className="rounded-lg" />
      </div>
    </header>
  )
}

