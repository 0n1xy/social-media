import nodemailer, { Transporter } from "nodemailer";

class SendMailService {
  private transporter: Transporter;

  constructor() {
    // Create a transporter using SMTP
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com", // Replace with your SMTP host
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || "your-email@gmail.com", // Your email
        pass: process.env.SMTP_PASS || "your-email-password", // Your email password
      },
    });
  }

  /**
   * Send an email to a single recipient
   * @param to - Recipient email address
   * @param subject - Subject of the email
   * @param text - Plain text content of the email
   * @param html - HTML content of the email
   */

  async sendMail(
    to: string,
    subject: string,
    text?: string,
    html?: string
  ): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Your App" <no-reply@yourapp.com>', // Sender address
        to,
        subject,
        text,
        html,
      });
      console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
      console.error(`Failed to send email: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Send bulk emails to multiple recipients
   * @param recipients - Array of recipient email addresses
   * @param subject - Subject of the email
   * @param text - Plain text content of the email
   * @param html - HTML content of the email
   */

  async sendBulkMail(
    recipients: string[],
    subject: string,
    text?: string,
    html?: string
  ): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Your App" <no-reply@yourapp.com>',
        bcc: recipients.join(","), // Use BCC for bulk sending
        subject,
        text,
        html,
      });
      console.log(`Bulk email sent to ${recipients.length} recipients.`);
    } catch (error) {
      console.error(`Failed to send bulk email: ${(error as Error).message}`);
      throw error;
    }
  }
}
