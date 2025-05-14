// utils/functions/qrUtils.js
import QRCode from 'qrcode';

/**
 * Generate encrypted QR code data
 * @param {Object} userData - User data including name, email, etc.
 * @returns {Promise<string>} - Base64 encoded QR code image
 */
interface QRUserData {
  name?: string;
  email?: string;
  id?: string;
}

export async function generateQRCodeData(userData: QRUserData) {
  try {
    // Call the API to get encrypted data
    const response = await fetch('/api/qr', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch encrypted data');
    }
    
    // Get the encrypted data from the API response
    const encryptedData = await response.json();
    
    // Convert the encrypted data to a JSON string
    const dataString = JSON.stringify(encryptedData);
    
    // Generate QR code as base64 data URL
    return await QRCode.toDataURL(dataString, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#e8cba9' // Match the background color from the template
      }
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
}

/**
 * Download QR code as PNG image
 * @param {string} dataUrl - Base64 encoded QR code image
 * @param {string} fileName - Name for the downloaded file
 */
export function downloadQRCode(dataUrl: string, fileName = 'event-pass') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${fileName}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}