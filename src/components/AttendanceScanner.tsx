'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { scanBarcode } from '@/app/actions/scanBarcode'

export default function AttendanceScanner() {
  const [barcode, setBarcode] = useState('')
  const [participant, setParticipant] = useState(null)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    let timeoutId

    const handleScan = async () => {
      if (barcode.length > 0) {
        const result = await scanBarcode(barcode)
        if (result.error) {
          setError(result.error)
          setShowModal(true)
        } else {
          setParticipant(result.participant)
          setShowModal(true)
        }
        setBarcode('')
      }
    }

    timeoutId = setTimeout(handleScan, 500) // Debounce for 500ms

    return () => clearTimeout(timeoutId)
  }, [barcode])

  const Modal = ({ onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose()
      }, 3000) // Close after 3 seconds

      return () => clearTimeout(timer)
    }, [onClose])

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
          {error ? (
            <div className="text-red-600 text-center">
              <h3 className="text-lg font-semibold mb-2">Error</h3>
              <p>{error}</p>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-600 mb-2">Success</h3>
              <p className="text-gray-700">Attendance recorded for:</p>
              <p className="font-medium mt-1">{participant?.name || participant?.barcode_id}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Input
        type="text"
        placeholder="Scan barcode"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        className="w-full text-lg p-4"
        autoFocus
      />
      {showModal && (
        <Modal onClose={() => {
          setShowModal(false)
          setError('')
          setParticipant(null)
        }} />
      )}
    </div>
  )
}