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
      .select('email')
      .eq('id', session.user.id)
      .single();

    if (error || !userData) {
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      );
    }

    // Get SWC-2025 data using the user's email
    const { data: swcData, error: swcError } = await supabase
      .from('SWC-2025')
      .select('roll, email, name, phone')
      .eq('email', userData.email)
      .single();

    if (swcError || !swcData) {
      return NextResponse.json(
        { error: 'SWC-2025 data not found for this user' },
        { status: 404 }
      );
    }

    // Create payload with swapped fields as required
    const swappedData = {
      name: swcData.roll,    // Swap roll to name
      email: swcData.name,   // Swap name to email
      phone: swcData.email,  // Swap email to phone
      roll: swcData.phone,   // Swap phone to roll
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