import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  let dbSaveSuccess = false;
  let emailSendSuccess = false;
  let dbError: Error | null = null;
  let emailError: Error | null = null;

  try {
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      company, 
      title, 
      services, 
      budget, 
      timeline, 
      description, 
      experience, 
      goals 
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !title || !budget || !timeline || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email, company, title, budget, timeline, and description are required' },
        { status: 400 }
      );
    }

    // Validate that at least one service is selected
    if (!services || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json(
        { error: 'At least one service must be selected' },
        { status: 400 }
      );
    }

    // Save to Supabase database first (ensures data persistence)
    try {
      const supabase = createSupabaseServerClient();
      const { data, error: dbErrorResponse } = await supabase
        .from('project_submissions')
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            email,
            phone: phone || null,
            company,
            title,
            services: services,
            budget,
            timeline,
            description,
            experience: experience || null,
            goals: goals && Array.isArray(goals) && goals.length > 0 ? goals : null,
          },
        ])
        .select();

      if (dbErrorResponse) {
        throw dbErrorResponse;
      }

      dbSaveSuccess = true;
      console.log('Project form submission saved to database:', data?.[0]?.id);
    } catch (error) {
      dbError = error instanceof Error ? error : new Error(String(error));
      console.error('Error saving to database:', dbError);
      // Continue with email sending even if database save fails
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const fullName = `${firstName} ${lastName}`;
    const servicesList = services.join(', ');
    const goalsList = goals && Array.isArray(goals) && goals.length > 0 ? goals.join(', ') : 'Not specified';

    // Email content for the business
    const businessEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">New Project Submission</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Anta StartProject Form Submission</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Contact Information</h2>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Title/Role:</strong> ${title}</p>
          </div>

          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Project Specifications</h2>
            <p><strong>Services Required:</strong> ${servicesList}</p>
            <p><strong>Budget Range:</strong> ${budget}</p>
            <p><strong>Timeline:</strong> ${timeline}</p>
            ${goals && Array.isArray(goals) && goals.length > 0 ? `<p><strong>Business Goals:</strong> ${goalsList}</p>` : ''}
          </div>

          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Project Requirements</h2>
            <p><strong>Description:</strong></p>
            <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; margin: 10px 0;">
              ${description.replace(/\n/g, '<br>')}
            </div>
          </div>

          ${experience ? `
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Technical Background & Constraints</h2>
            <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; margin: 10px 0;">
              ${experience.replace(/\n/g, '<br>')}
            </div>
          </div>
          ` : ''}

          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
            <h3 style="color: #1976d2; margin-top: 0;">Next Steps</h3>
            <ul style="color: #333; margin: 0;">
              <li>Review project requirements and specifications</li>
              <li>Respond to the client within 24 hours</li>
              <li>Schedule a project kickoff meeting</li>
              <li>Prepare initial project proposal and timeline</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    // Email content for the client (confirmation)
    const clientEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Thank You, ${firstName}!</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Your project submission has been received</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">We've Received Your Project Brief!</h2>
            <p>Thank you for providing detailed information about your project. Our team is excited to work with you and turn your vision into reality.</p>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50; margin: 20px 0;">
              <h3 style="color: #2e7d32; margin-top: 0;">What Happens Next?</h3>
              <ul style="color: #333; margin: 0;">
                <li>We'll review your project requirements and specifications</li>
                <li>Our team will respond within 24 hours</li>
                <li>We'll schedule a project kickoff meeting to discuss details</li>
                <li>We'll prepare a comprehensive project proposal and timeline</li>
              </ul>
            </div>
          </div>

          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #333; margin-top: 0;">Your Project Summary</h3>
            <p><strong>Services:</strong> ${servicesList}</p>
            <p><strong>Budget:</strong> ${budget}</p>
            <p><strong>Timeline:</strong> ${timeline}</p>
            ${goals && Array.isArray(goals) && goals.length > 0 ? `<p><strong>Goals:</strong> ${goalsList}</p>` : ''}
            <p><strong>Project Description:</strong></p>
            <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; margin: 10px 0;">
              ${description.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="background: #fff3e0; padding: 20px; border-radius: 8px; border-left: 4px solid #ff9800;">
            <h3 style="color: #f57c00; margin-top: 0;">Need Immediate Assistance?</h3>
            <p style="color: #333; margin: 0;">Feel free to reach out directly:</p>
            <p style="color: #333; margin: 5px 0 0 0;">
              📧 <a href="mailto:antatechh@gmail.com" style="color: #667eea; text-decoration: none;">antatechh@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    `;

    // Send email to business
    try {
      await transporter.sendMail({
        from: `"Anta Project Form" <${process.env.GMAIL_USER}>`,
        to: 'antatechh@gmail.com',
        subject: `New Project Submission: ${company} - ${fullName}`,
        html: businessEmailContent,
      });

      // Send confirmation email to client
      await transporter.sendMail({
        from: `"Anta Team" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Thank you for your project submission!',
        html: clientEmailContent,
      });

      emailSendSuccess = true;
      console.log('Emails sent successfully');
    } catch (error) {
      emailError = error instanceof Error ? error : new Error(String(error));
      console.error('Error sending email:', emailError);
      // Continue even if email sending fails
    }

    // Return success if either database save OR email sending succeeded
    if (dbSaveSuccess || emailSendSuccess) {
      const messages = [];
      if (dbSaveSuccess) messages.push('Data saved to database');
      if (emailSendSuccess) messages.push('Emails sent successfully');
      if (!dbSaveSuccess) messages.push('Database save failed (check logs)');
      if (!emailSendSuccess) messages.push('Email sending failed (check logs)');

      return NextResponse.json(
        {
          message: messages.join(', '),
          saved: dbSaveSuccess,
          emailSent: emailSendSuccess,
        },
        { status: 200 }
      );
    }

    // Both failed
    return NextResponse.json(
      {
        error: 'Failed to save data and send emails',
        dbError: dbError?.message,
        emailError: emailError?.message,
      },
      { status: 500 }
    );

  } catch (error) {
    console.error('Unexpected error in project API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
