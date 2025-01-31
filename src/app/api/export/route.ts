// app/api/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest) {
  try {
    const { startDate, endDate, startTime, endTime } = await req.json();

    const query = `
      SELECT 
        participant.name,
        participant.university,
        participant.responsibility,
        participant.id,
        cafe.timestamp,
        cafe.date
      FROM cafe 
      JOIN participant ON cafe.barcode = participant.barcode_id
      WHERE DATE(cafe.date) BETWEEN ? AND ?
      AND TIME(cafe.timestamp) BETWEEN ? AND ?
      ORDER BY cafe.timestamp DESC
    `;

    const [rows] = await db.execute(query, [startDate, endDate, startTime, endTime]);

    // Create Excel workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows as any[]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Records');

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=attendance_report.xlsx',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}