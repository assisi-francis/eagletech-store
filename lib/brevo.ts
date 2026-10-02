import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY || '' });

export async function sendOrderConfirmationEmail(data: {
  email: string;
  customerName: string;
  orderId: string;
  totalAmount: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}) {
  const itemRows = data.items
    .map((i) => `<li>${i.name} (x${i.quantity}) - ₦${i.price.toLocaleString()}</li>`)
    .join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #111827;">Payment Confirmed! 🎉</h2>
      <p>Hello <strong>${data.customerName}</strong>,</p>
      <p>We have received your payment for order <strong>#${data.orderId}</strong>.</p>
      <h3>Items Summary:</h3>
      <ul>${itemRows}</ul>
      <p><strong>Total Paid:</strong> ₦${data.totalAmount.toLocaleString()}</p>
      <p style="background: #f3f4f6; padding: 10px; border-radius: 4px;">
         💡 If you ordered a Starlink setup, our engineers will call you within 24 hours.
      </p>
    </div>`;

  return await brevo.transactionalEmails.sendTransacEmail({
    subject: `Order Confirmation #${data.orderId}`,
    htmlContent: htmlContent,
    sender: { name: process.env.SENDER_NAME || 'EagleTech Store', email: process.env.SENDER_EMAIL! },
    to: [{ email: data.email, name: data.customerName }],
  });
}
