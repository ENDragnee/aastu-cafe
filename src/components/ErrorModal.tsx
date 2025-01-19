import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ErrorModalProps {
  message: string
  onClose: () => void
}

export default function ErrorModal({ message, onClose }: ErrorModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-500 dark:text-red-400">Error</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>{message}</p>
        </div>
        <Button onClick={onClose} className="w-full bg-red-500 hover:bg-red-600 text-white">Close</Button>
      </DialogContent>
    </Dialog>
  )
}

