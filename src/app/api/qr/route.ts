import { NextResponse } from 'next/server';
import { createServerClient } from '@/utils/functions/supabse-server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Environment variable for encryption key
// In production, ensure this is set in your environment variables
const SECRET_KEY = process.env.SECRET_KEY || '';

export async function GET() {
  try {
    // Check if encryption key is available
    if (!SECRET_KEY || SECRET_KEY.length !== 32) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Get session from cookies
    const supabase = createServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user data from the database
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error || !userData) {
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      );
    }

    // Extract required fields (adjust according to your schema)
    const rawUserData = {
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      roll: userData.roll || '',
      id: userData.id
    };

    // Create payload with swapped fields as required
    const swappedData = {
      name: rawUserData.email,    // Swap email to name
      email: rawUserData.name,   // Swap phone to email
      phone: rawUserData.name,    // Swap roll to phone
      roll: rawUserData.phone,     // Swap name to roll       // Keep ID the same
    };

    // Encrypt the data
    const encryptedData = encryptData(swappedData);

    return NextResponse.json(encryptedData);
  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate encrypted data' },
      { status: 500 }
    );
  }
}

function encryptData(data: any) {
  // Generate a random initialization vector
  const iv = crypto.randomBytes(16);
  
  // Create cipher with AES-256-CBC
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(SECRET_KEY),
    iv
  );
  
  // Encrypt the data
  const plaintext = JSON.stringify(data);
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // Return both the IV and ciphertext in base64 format
  return {
    iv: iv.toString('base64'),
    ciphertext: encrypted
  };
}