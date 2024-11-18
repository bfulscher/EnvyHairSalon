// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure nodemailer with your email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-specific-password'
  }
});

exports.sendOrderConfirmation = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();

    // Create email content
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: order.userEmail,
      subject: `Order Confirmation #${order.orderId}`,
      html: `
        <h1>Thank you for your order!</h1>
        <h2>Order Details:</h2>
        <p>Order ID: ${order.orderId}</p>
        <p>Date: ${order.createdAt.toDate().toLocaleDateString()}</p>
        
        <h3>Items:</h3>
        <table style="width:100%; border-collapse: collapse;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Item</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
          </tr>
          ${order.items.map(item => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">$${item.price.toFixed(2)}</td>
            </tr>
          `).join('')}
        </table>
        
        <h3>Total: $${order.total.toFixed(2)}</h3>
        
        <p>Thank you for shopping with us!</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent successfully');
      
      // Update order status
      await snap.ref.update({ 
        emailSent: true,
        status: 'confirmed'
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });