"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2, AlertTriangle } from "lucide-react"
import { scanBarcode } from "@/app/actions/scanBarcode"
import { UserData, ScanBarcodeResponse } from "@/type/userData"

export default function AttendanceScanner() {
  const [barcode, setBarcode] = useState("")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [count, setCount] = useState(0)
  const lastCount = useRef(0)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleScan = async () => {
      if (barcode.length > 0) {
        setIsLoading(true)
        setUserData(null)
        setError(null)

        const result: ScanBarcodeResponse = await scanBarcode(barcode)

        if ("error" in result) {
          setError(result.error)
          setUserData(null)
        } else {
          setUserData(result)
          setError(null)
          setCount(result.count ?? 0)
          lastCount.current = result.count ?? 0
        }

        setBarcode("")
        setIsLoading(false)
      }
    }

    timeoutId = setTimeout(handleScan, 500)
    return () => clearTimeout(timeoutId)
  }, [barcode])

  const renderUserInfo = (userData: UserData) => (
    <div className="flex-1 pl-8">
      <div className="mb-4 text-yellow-500 pl-8">
        {userData.status === "scan" ? (
          <CheckCircle size={100} className="text-green-500" />
        ) : (
          <AlertTriangle size={100} className="text-yellow-500" />
        )}
      </div>
      <h3 className="text-2xl font-bold mb-2">
        {userData.status === "scan"
          ? `Welcome, ${userData.name}!`
          : `${userData.name}, is rescanning!`}
      </h3>
      <div className="mb-4 pl-4 font-bold">
        <p className="text-gray-600 dark:text-gray-50">University: {userData.university}</p>
        <p className="text-gray-600 dark:text-gray-50">Name: {userData.name}</p>
        <p className="text-gray-600 dark:text-gray-50">Role: {userData.role}</p>
        <p className="text-gray-600 dark:text-gray-50">ID: {userData.id}</p>
      </div>
      <p className={`font-semibold text-2xl ${
        userData.status === "scan" ? "text-green-500" : "text-yellow-500"
      }`}>
        {userData.status === "scan" ? "Scan Successful" : "Rescan Detected"}
      </p>
    </div>
  )

  return (
    <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-2xl overflow-hidden">
      <CardContent className="flex flex-col items-center p-6">
        <h1>Daily Count: {count || lastCount.current}</h1>
        <h2 className="text-2xl font-bold mb-6">Scan Your Meal Card</h2>
        <div className="w-full mb-6">
          <Input
            type="text"
            placeholder="Scan barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="w-full text-center text-lg p-4 rounded-full"
            autoFocus
          />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center w-full">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        )}

        {userData && (
          <div className="flex items-start bg-gray-50 dark:bg-gray-800 text-black dark:text-white p-6 rounded-xl w-full">
            {userData.photo && (
              <div className="relative w-60 h-60 rounded-lg overflow-hidden border-2 border-[#1B3149]">
                <img
                  src={userData.photo}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: "50% 10%",
                    aspectRatio: "1/1",
                  }}
                />
              </div>
            )}
            {renderUserInfo(userData)}
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center flex-col bg-gray-50 dark:bg-gray-800 text-black dark:text-white p-6 rounded-xl w-full">
            <h1>Daily Count: {lastCount.current}</h1>
            <div className="text-red-500">
              <AlertCircle size={120} />
            </div>
            <div>
              <h3 className="text-center text-6xl font-bold mb-2">{userData?.name}</h3>
              <p className="text-gray-600 dark:text-white text-2xl">{error}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}