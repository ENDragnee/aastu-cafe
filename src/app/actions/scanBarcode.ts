'use server'

import db from '@/lib/db'
import { ScanBarcodeResponse } from '@/type/userData'

export async function scanBarcode(barcode: string): Promise<ScanBarcodeResponse> {
  try {
    // Fetch the participant
    const [participant]: any = await db.execute(
      'SELECT * FROM participant WHERE barcode_id = ?',
      [barcode]
    );
    const participants = participant[0];

    if (!participant || participant.length === 0) {
      const [count]: any = await db.execute(
        'SELECT COUNT(*) as count FROM cafe WHERE date = ?',
        [getLocalDate()]
      );
      return { error: 'Participant not found.', count: count[0]?.count ?? 0 };
    }

    // Use Ethiopian timezone
    const timeZone = 'Africa/Addis_Ababa';
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
      timeZone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const today = getLocalDate(timeZone);

    // Fetch the daily count
    const [count]: any = await db.execute(
      'SELECT COUNT(*) as count FROM cafe WHERE date = ?',
      [today]
    );

    // Fetch the last scan
    const [lastScan]: any = await db.execute(
      'SELECT timestamp FROM cafe WHERE barcode = ? AND date = ? ORDER BY timestamp DESC LIMIT 1',
      [barcode, today]
    );

    // Fetch the university information
    const [uni]: any = await db.execute(
      'SELECT * FROM university WHERE id = ?',
      [participants.university]
    );

    if (lastScan.length > 0) {
      const lastScanTime = lastScan[0]?.timestamp;
      if (lastScanTime) {
        const timeDifference = calculateTimeDifference(lastScanTime, currentTime);

        if (timeDifference < 2) {
          return {
            id: `USEA${participants.id.toString().padStart(4, '0')}`,
            name: participants.name,
            university: uni[0].name,
            role: participants.responsibility,
            photo: participants.photo,
            status: 're-scan',
            count: count[0]?.count ?? 0,
          };
        }

        if (timeDifference < 60) {
          return { error: 'You have taken this meal already', count: count[0]?.count ?? 0 };
        }
      }
    }

    const [rows]: any = await db.execute(
      'SELECT COUNT(*) as count FROM cafe WHERE barcode = ? AND date = ?',
      [barcode, today]
    );

    if (rows[0].count >= 3) {
      return { error: 'Your daily limit has been reached.', count: count[0]?.count ?? 0 };
    }

    // Insert the scan into the cafe table
    await db.execute(
      'INSERT INTO cafe (barcode, date, timestamp) VALUES (?, ?, ?)',
      [barcode, today, currentTime]
    );

    return {
      id: `USEA${participants.id.toString().padStart(4, '0')}`,
      name: participants.name,
      university: uni[0].name,
      role: participants.responsibility,
      photo: participants.photo,
      status: 'scan',
      count: count[0]?.count ?? 0,
    };
  } catch (error) {
    console.error('Error scanning barcode:', error);

    // Always attempt to return the daily count even on errors
    const [count]: any = await db.execute(
      'SELECT COUNT(*) as count FROM cafe WHERE date = ?',
      [getLocalDate()]
    );
    return {
      error: 'An error occurred while processing your request.',
      count: count[0]?.count ?? 0,
    };
  }
}

// Helper function to get local date in Ethiopian timezone
function getLocalDate(timeZone = 'Africa/Addis_Ababa'): string {
  return new Date().toLocaleDateString('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// Helper function to calculate time difference in minutes accounting for day changes
function calculateTimeDifference(lastTime: string, currentTime: string): number {
  const [lastHours, lastMinutes] = lastTime.split(':').map(Number);
  const [currentHours, currentMinutes] = currentTime.split(':').map(Number);

  let lastTimeInMinutes = lastHours * 60 + lastMinutes;
  let currentTimeInMinutes = currentHours * 60 + currentMinutes;

  // Handle day changes
  if (currentTimeInMinutes < lastTimeInMinutes) {
    // If current time is less than last time, we've crossed midnight
    currentTimeInMinutes += 24 * 60; // Add 24 hours worth of minutes
  }

  return currentTimeInMinutes - lastTimeInMinutes;
}