
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

const sendEmergencyNotification = async (contactEmail, contactName, userName, location, alertId) => {
  try {
    const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: contactEmail,
      subject: `🚨 EMERGENCY ALERT: ${userName} needs help!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🚨 EMERGENCY ALERT</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #dc3545; margin-bottom: 20px;">${userName} has sent an emergency alert!</h2>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p style="margin: 0; color: #856404; font-weight: bold;">
                This person may be in danger and needs immediate assistance.
              </p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #333; margin-bottom: 10px;">📍 Current Location:</h3>
              <p style="margin: 5px 0; color: #666;">
                <strong>Address:</strong> ${location.address || 'Location not specified'}
              </p>
              <p style="margin: 5px 0; color: #666;">
                <strong>Coordinates:</strong> ${location.latitude}, ${location.longitude}
              </p>
              <a href="${googleMapsUrl}" target="_blank" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
                📍 View on Google Maps
              </a>
            </div>
            
            <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h4 style="margin: 0 0 10px 0; color: #333;">What you should do:</h4>
              <ul style="margin: 0; padding-left: 20px; color: #666;">
                <li>Contact ${userName} immediately if possible</li>
                <li>Call emergency services (911) if needed</li>
                <li>Go to the location if it's safe to do so</li>
                <li>Contact other emergency contacts if available</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; font-size: 14px; margin: 0;">
                This alert was sent via SafeStep - Your safety is our priority.
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
    console.log(`Emergency notification sent to ${contactEmail}:`, result.messageId);
    return result;
  } catch (error) {
    console.error(`Failed to send emergency notification to ${contactEmail}:`, error);
    throw error;
  }
};

module.exports = sendEmergencyNotification; 