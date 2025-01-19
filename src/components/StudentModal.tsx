import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface StudentModalProps {
  student: {
    name: string
    id: string
    image: string
  }
  onClose: () => void
}

export default function StudentModal({ student, onClose }: StudentModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Student Information</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center">
            <Image
              src={student.image || "/placeholder.svg"}
              alt={student.name}
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Name:</span>
            <span className="col-span-3">{student.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">ID:</span>
            <span className="col-span-3">{student.id}</span>
          </div>
        </div>
        <Button onClick={onClose} className="w-full bg-blue-500 hover:bg-blue-600 text-white">Close</Button>
      </DialogContent>
    </Dialog>
  )
}

