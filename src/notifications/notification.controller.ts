import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendEmailPayload } from './send-email.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send-email')
  @HttpCode(HttpStatus.OK)
  sendEmail(@Body() body: SendEmailPayload) {
    return this.notificationService.forwardEmail(body);
  }
}
