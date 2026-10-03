import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY || '' });

const senderName = process.env.SENDER_NAME || 'EagleTech Store';
// Fallback if not set to prevent errors on Vercel
const senderEmail = process.env.SENDER_EMAIL || 'support@eagletech.com';

export async function sendOrderPlacedEmail(data: { email: string; customerName: string; orderId: string; totalAmount: number; }) {
  if (!process.env.BREVO_API_KEY) return;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #111827;">Order Received! 🛒</h2>
      <p>Hello <strong>${data.customerName || 'Customer'}</strong>,</p>
      <p>Your order <strong>#${data.orderId}</strong> has been placed successfully.</p>
      <p><strong>Total Amount:</strong> ₦${data.totalAmount.toLocaleString()}</p>
      <p>If you haven't completed your payment, please do so to begin processing.</p>
    </div>`;

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject: `Order Received #${data.orderId}`,
      htmlContent,
      sender: { name: senderName, email: senderEmail },
      to: [{ email: data.email, name: data.customerName || 'Customer' }],
    });
  } catch (err) {
    console.error('Failed to send Order Placed email:', err);
  }
}

export async function sendOrderConfirmationEmail(data: {
  email: string;
  customerName: string;
  orderId: string;
  totalAmount: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}) {
  if (!process.env.BREVO_API_KEY) return;
  const itemRows = data.items
    .map((i) => `<li>${i.name} (x${i.quantity}) - ₦${i.price.toLocaleString()}</li>`)
    .join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #111827;">Payment Confirmed! 🎉</h2>
      <p>Hello <strong>${data.customerName || 'Customer'}</strong>,</p>
      <p>We have received your payment for order <strong>#${data.orderId}</strong>.</p>
      <h3>Items Summary:</h3>
      <ul>${itemRows}</ul>
      <p><strong>Total Paid:</strong> ₦${data.totalAmount.toLocaleString()}</p>
      <p style="background: #f3f4f6; padding: 10px; border-radius: 4px;">
         💡 If you ordered a Starlink setup, our engineers will call you within 24 hours.
      </p>
    </div>`;

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject: `Payment Confirmed #${data.orderId}`,
      htmlContent,
      sender: { name: senderName, email: senderEmail },
      to: [{ email: data.email, name: data.customerName || 'Customer' }],
    });
  } catch (err) {
    console.error('Failed to send Payment Confirmed email:', err);
  }
}

export async function sendOrderStatusEmail(data: { email: string; customerName: string; orderId: string; status: string; }) {
  if (!process.env.BREVO_API_KEY) return;
  let title = '';
  let message = '';

  if (data.status === 'SHIPPED') {
    title = 'Order Shipped! 🚚';
    message = `Your order <strong>#${data.orderId}</strong> is now on its way to your specified delivery address!`;
  } else if (data.status === 'ARRIVED') {
    title = 'Items Arrived! 📦';
    message = `Good news! The items for your order <strong>#${data.orderId}</strong> have arrived at our collection center and are ready for pickup (or out for final delivery).`;
  } else if (data.status === 'COLLECTED' || data.status === 'DELIVERED') {
    title = 'Order Completed! ✅';
    message = `Your order <strong>#${data.orderId}</strong> has been successfully collected/delivered. Thank you for shopping with EagleTech Store!`;
  } else {
    return;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #111827;">${title}</h2>
      <p>Hello <strong>${data.customerName || 'Customer'}</strong>,</p>
      <p>${message}</p>
      <p>If you have any questions, please contact our support team.</p>
    </div>`;

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject: `Order Update: ${title.replace(/[^\x00-\x7F]/g, "")} #${data.orderId}`,
      htmlContent,
      sender: { name: senderName, email: senderEmail },
      to: [{ email: data.email, name: data.customerName || 'Customer' }],
    });
  } catch (err) {
    console.error('Failed to send Order Status email:', err);
  }
}
