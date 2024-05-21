// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // create reusable transporter object using the default SMTP transport
    this.transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "Gmail",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL,   // your SMTP username
        pass: process.env.PASS,    // your SMTP password
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html: string): Promise<void> {
    // setup email data with unicode symbols
    const mailOptions = {
      from: 'Work-Wise', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    };

    // send mail with defined transport object
    await this.transporter.sendMail(mailOptions);
  }
}
