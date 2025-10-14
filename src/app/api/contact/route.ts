import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, country, propertyType, propertyInterest } = body;

    // Validate required fields
    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email content
    const emailContent = `
New Property Inquiry from Rishi Malik Website

Property of Interest: ${propertyInterest || 'General Inquiry'}

Contact Details:
- Name: ${name}
- Phone/WhatsApp: ${phone}
- Email: ${email}
- Country: ${country || 'Not provided'}
- Property Type: ${propertyType || 'Not specified'}

Submitted at: ${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })}
    `.trim();

    // Using a free email service - Web3Forms (no registration needed, free tier)
    const web3FormsApiKey = '51e50f5a-4ae9-418f-8e47-1c88e21876a8'; // This is a demo key, replace with your own from https://web3forms.com
    
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: web3FormsApiKey,
        subject: `New Property Inquiry: ${propertyInterest}`,
        from_name: 'Rishi Malik Website',
        to_email: 'info@rishimalik.com', // Your email address
        replyto: email,
        message: emailContent,
        name: name,
        email: email,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return NextResponse.json(
        { success: true, message: 'Email sent successfully' },
        { status: 200 }
      );
    } else {
      console.error('Web3Forms error:', result);
      return NextResponse.json(
        { error: 'Failed to send email', details: result },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

