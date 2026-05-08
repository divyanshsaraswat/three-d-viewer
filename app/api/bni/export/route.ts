import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('bni');
    const users = await db.collection('users').find({}).toArray();

    if (users.length === 0) {
      return new NextResponse('No data available', { status: 404 });
    }

    // Define CSV headers
    const headers = ['Name', 'Company', 'Contact', 'Email', 'Registration Date'];
    
    // Convert users to CSV rows
    const rows = users.map(user => {
      const date = user.registeredAt ? new Date(user.registeredAt) : null;
      const formattedDate = date 
        ? date.toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          }) 
        : 'N/A';

      return [
        `"${user.name || ''}"`,
        `"${user.company || ''}"`,
        `"${user.contact || ''}"`,
        `"${user.email || ''}"`,
        `"${formattedDate}"`
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Set headers for file download
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=bni_registrations_${new Date().toISOString().split('T')[0]}.csv`,
      },
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data', details: error.message },
      { status: 500 }
    );
  }
}
