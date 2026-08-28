import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MailService, SendMailOptions } from './mail.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @UseGuards(JwtAuthGuard)
  async sendEmail(@Body() body: SendMailOptions) {
    return this.mailService.sendMail(body);
  }
}
