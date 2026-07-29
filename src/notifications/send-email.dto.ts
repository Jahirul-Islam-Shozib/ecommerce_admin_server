export class SendEmailPayload {
  from?: string; // dynamic: sender's email (logged-in user)
  to: string; // fixed: recipient email (staff/admin)
  subject: string;
  text: string;
  html?: string;
  cc?: string[];
  bcc?: string[];
  process_now?: boolean;
}
