import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { SendEmailPayload } from './send-email.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Forwards the email payload from the frontend to the email relay API.
   */
  async forwardEmail(payload: SendEmailPayload): Promise<unknown> {
    const apiUrl = this.configService.get<string>('EMAIL_API_URL');

    if (!apiUrl) {
      this.logger.error('EMAIL_API_URL is not configured.');
      throw new BadGatewayException('Email service is not configured.');
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post<unknown>(`${apiUrl}/send`, payload, {
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      this.logger.log(`Email sent to ${payload.to}`);
      return response.data;
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const message =
        axiosErr.response?.data?.message ??
        axiosErr.message ??
        'Failed to send email';
      this.logger.error(`forwardEmail failed: ${message}`);
      throw new BadGatewayException(message);
    }
  }
}
