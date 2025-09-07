import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendOTPEmail = async (email, otp) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code - Infinity Plaza',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
        <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #db2777; font-size: 28px; margin: 0;">Infinity Plaza</h1>
          </div>
          <h2 style="color: #374151; font-size: 24px; margin-bottom: 20px;">Your OTP Code</h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">Your verification code is:</p>
          <div style="background-color: #fdf2f8; border: 2px solid #db2777; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #db2777; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code will expire in 5 minutes.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px;">© 2024 Infinity Plaza. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendVerificationEmail = async (email, code) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification - Infinity Plaza',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
        <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #db2777; font-size: 28px; margin: 0;">Infinity Plaza</h1>
          </div>
          <h2 style="color: #374151; font-size: 24px; margin-bottom: 20px;">Welcome to Infinity Plaza!</h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">Thank you for registering. Your verification code is:</p>
          <div style="background-color: #fdf2f8; border: 2px solid #db2777; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #db2777; letter-spacing: 8px;">${code}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px;">© 2024 Infinity Plaza. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendOrderConfirmation = async (email, orderDetails) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Order Confirmation - Infinity Plaza',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
        <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #db2777; font-size: 28px; margin: 0;">Infinity Plaza</h1>
          </div>
          <h2 style="color: #374151; font-size: 24px; margin-bottom: 20px;">Order Confirmed!</h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">Thank you for your order.</p>
          <div style="background-color: #fdf2f8; border: 1px solid #db2777; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0; color: #374151;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
            <p style="margin: 10px 0 0 0; color: #374151;"><strong>Total:</strong> $${orderDetails.total}</p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px;">© 2024 Infinity Plaza. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendShippingNotification = async (email, orderDetails) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Order Shipped - Infinity Plaza',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
        <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #db2777; font-size: 28px; margin: 0;">Infinity Plaza</h1>
          </div>
          <h2 style="color: #374151; font-size: 24px; margin-bottom: 20px;">Your Order Has Been Shipped!</h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">Great news! Your order is on its way.</p>
          <div style="background-color: #fdf2f8; border: 1px solid #db2777; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0; color: #374151;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
            <p style="margin: 10px 0 0 0; color: #6b7280;">Tracking information will be available soon.</p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px;">© 2024 Infinity Plaza. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export { sendOTPEmail, sendVerificationEmail, sendOrderConfirmation, sendShippingNotification };