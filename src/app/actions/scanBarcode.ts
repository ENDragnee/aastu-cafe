'use server'

import db from '@/lib/db'

export async function scanBarcode(barcode: string) {
  try {
    // First, check if participant exists
    const [participant]: any = await db.execute(
      'SELECT * FROM participant WHERE barcode_id = ?',
      [barcode]
    )

    if (!participant || participant.length === 0) {
      return { error: 'Participant not found.' }
    }

    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]

    // Check the number of entries for today
    const [rows]: any = await db.execute(
      'SELECT COUNT(*) as count FROM cafe WHERE barcode = ? AND date = ?',
      [barcode, today]
    )

    if (rows[0].count >= 3) {
      return { error: 'Your daily limit has been reached.' }
    }

    // If we get here, the participant exists and hasn't reached daily limit
    // Insert new cafe entry
    await db.execute(
      'INSERT INTO cafe (barcode, date) VALUES (?, ?)',
      [barcode, today]
    )

    return { participant: participant[0] }
  } catch (error) {
    console.error('Error scanning barcode:', error)
    return { error: 'An error occurred while processing your request.' }
  }
}