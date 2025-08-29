import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendOrderConfirmation = async (order, userEmail) => {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'E-Commerce Store'} <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Order Confirmation - #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ec4899;">Order Confirmed!</h2>
        <p>Thank you for your order. Here are the details:</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order #${order._id}</h3>
          <p><strong>Total:</strong> $${order.totalPrice}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Shipping Address:</strong><br>
          ${order.shippingAddress.address}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}</p>
        </div>

        <h3>Order Items:</h3>
        ${order.orderItems.map(item => `
          <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
            <p><strong>${item.name}</strong></p>
            <p>Quantity: ${item.qty} × $${item.price} = $${(item.qty * item.price).toFixed(2)}</p>
          </div>
        `).join('')}

        <p style="margin-top: 30px;">We'll send you another email when your order ships.</p>
        <p>Thank you for shopping with us!</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent');
  } catch (error) {
    console.error('Email send error:', error);
  }
};

export const sendShippingNotification = async (order, userEmail) => {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'E-Commerce Store'} <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Your Order is Shipped - #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Order Shipped!</h2>
        <p>Great news! Your order #${order._id} has been shipped.</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Tracking Information:</strong></p>
          <p>Your order is on its way to:</p>
          <p>${order.shippingAddress.address}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}</p>
        </div>

        <p>Expected delivery: 3-5 business days</p>
        <p>Thank you for your business!</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Shipping notification email sent');
  } catch (error) {
    console.error('Email send error:', error);
  }
};