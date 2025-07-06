const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter (same as the existing mailer)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendUserConfirmationEmail = async (userEmail, userName, location, alertId, contactsCount) => {
  try {
    const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `✅ Emergency Alert Confirmation - SafeStep`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">✅ Emergency Alert Sent</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #28a745; margin-bottom: 20px;">Hello ${userName},</h2>
            
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p style="margin: 0; color: #155724; font-weight: bold;">
                Your emergency alert has been successfully sent to ${contactsCount} contact${contactsCount !== 1 ? 's' : ''}.
              </p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #333; margin-bottom: 10px;">📍 Alert Details:</h3>
              <p style="margin: 5px 0; color: #666;">
                <strong>Time Sent:</strong> ${new Date().toLocaleString()}
              </p>
              <p style="margin: 5px 0; color: #666;">
                <strong>Location:</strong> ${location.address || 'Current location'}
              </p>
              <p style="margin: 5px 0; color: #666;">
                <strong>Coordinates:</strong> ${location.latitude}, ${location.longitude}
              </p>
              <a href="${googleMapsUrl}" target="_blank" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
                📍 View Location on Google Maps
              </a>
            </div>
            
            <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h4 style="margin: 0 0 10px 0; color: #333;">What happens next:</h4>
              <ul style="margin: 0; padding-left: 20px; color: #666;">
                <li>Your emergency contacts have been notified</li>
                <li>They received your exact location and contact information</li>
                <li>They can view your location on Google Maps</li>
                <li>Help should arrive soon - stay safe!</li>
              </ul>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h4 style="margin: 0 0 10px 0; color: #856404;">Important:</h4>
              <p style="margin: 0; color: #856404;">
                If you're safe now, please contact your emergency contacts to let them know. 
                You can also mark this alert as resolved in your SafeStep dashboard.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; font-size: 14px; margin: 0;">
                SafeStep - Your safety is our priority. Available 24/7.
              </p>
              <p style="color: #6c757d; font-size: 12px; margin: 5px 0 0 0;">
                Alert ID: ${alertId}
              </p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`User confirmation email sent to ${userEmail}:`, result.messageId);
    return result;
  } catch (error) {
    console.error(`Failed to send user confirmation email to ${userEmail}:`, error);
    throw error;
  }
};

module.exports = sendUserConfirmationEmail; 