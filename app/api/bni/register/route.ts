import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, company, contact, email } = data;

    if (!name || !company || !contact || !email) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('bni');
    
    const result = await db.collection('users').insertOne({
      name,
      company,
      contact,
      email,
      registeredAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user', details: error.message },
      { status: 500 }
    );
  }
}
