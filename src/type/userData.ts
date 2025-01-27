export interface UserData {
    id: string
    name: string
    university: string
    role: string
    photo: string
    status: string
    count?: number
  }

export type ScanBarcodeResponse = 
| { error: string } 
| UserData;