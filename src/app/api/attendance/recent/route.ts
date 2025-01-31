// app/api/attendance/recent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');

    let query;
    let queryParams: (string | number)[] = [];

    if (startDate && endDate) {
      // Query with date and time range
      query = `
        SELECT 
          participant.name,
          participant.university,
          participant.responsibility,
          participant.id as user_id,
          DATE_FORMAT(cafe.date, '%Y-%m-%d') as date,
          TIME_FORMAT(cafe.timestamp, '%H:%i:%s') as timestamp
        FROM cafe 
        JOIN participant ON cafe.barcode = participant.barcode_id
        WHERE DATE(cafe.date) BETWEEN ? AND ?
        ${startTime && endTime ? 'AND TIME(cafe.timestamp) BETWEEN ? AND ?' : ''}
        ORDER BY cafe.date DESC, cafe.timestamp DESC
      `;
      
      queryParams = [startDate, endDate];
      if (startTime && endTime) {
        queryParams.push(`${startTime}:00`, `${endTime}:59`);
      }
    } else {
      // Default query for recent records
      query = `
        SELECT 
          participant.name,
          participant.university,
          participant.responsibility,
          participant.id as user_id,
          DATE_FORMAT(cafe.date, '%Y-%m-%d') as date,
          TIME_FORMAT(cafe.timestamp, '%H:%i:%s') as timestamp
        FROM cafe 
        JOIN participant ON cafe.barcode = participant.barcode_id
        ORDER BY cafe.date DESC, cafe.timestamp DESC
        LIMIT 20
      `;
    }

    const [rows] = await db.execute(query, queryParams);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Failed to fetch records:', error);
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}