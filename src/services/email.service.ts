import axios from 'axios';
import { env } from '../config/env.js';

interface EmailPayload {
    to: string;
    toName: string;
    subject: string;
    htmlContent: string;
}

/**
 * Brevo (Sendinblue) Email Service using REST API v3.
 * Sends transactional emails directly via HTTP.
 */
export const emailService = {
    /**
     * Send a transactional email via Brevo REST API.
     * @see https://developers.brevo.com/reference/sendtransacemail
     */
    async sendEmail(payload: EmailPayload): Promise<void> {
        const url = 'https://api.brevo.com/v3/smtp/email';

        const body = {
            sender: {
                name: env.BREVO_SENDER_NAME,
                email: env.BREVO_SENDER_EMAIL,
            },
            to: [
                {
                    email: payload.to,
                    name: payload.toName,
                },
            ],
            subject: payload.subject,
            htmlContent: payload.htmlContent,
        };

        try {
            await axios.post(url, body, {
                headers: {
                    'accept': 'application/json',
                    'api-key': env.BREVO_API_KEY,
                    'content-type': 'application/json',
                },
            });
            console.log(`📧 Email sent to ${payload.to}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('❌ Brevo API Error:', error.response?.data);
                throw new Error(`Failed to send email: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    },

    /**
     * Send a ticket confirmation email.
     */
    async sendTicketConfirmation(
        email: string,
        name: string,
        ticketNumber: string
    ): Promise<void> {
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #f97316;">🎉 You're In!</h1>
                <p>Hey <strong>${name}</strong>,</p>
                <p>Your ticket for <strong>Coding Conf 2025</strong> has been confirmed!</p>
                <div style="background: linear-gradient(135deg, #1f1f1f 0%, #2d2d2d 100%); padding: 30px; border-radius: 16px; text-align: center; margin: 20px 0;">
                    <p style="color: #9ca3af; margin: 0;">Your Ticket Number</p>
                    <h2 style="color: #f97316; font-size: 48px; margin: 10px 0;">${ticketNumber}</h2>
                </div>
                <p style="color: #6b7280;">See you at the event!</p>
                <p style="color: #6b7280;">— The Coding Conf Team</p>
            </div>
        `;

        await this.sendEmail({
            to: email,
            toName: name,
            subject: `Your Coding Conf 2025 Ticket - ${ticketNumber}`,
            htmlContent,
        });
    },
};
