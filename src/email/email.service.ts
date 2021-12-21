import { Inject, Injectable, Logger } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import emailConfig from 'src/config/emailConfig';
import { ConfigType } from '@nestjs/config';

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: 587,
      secure: false,
      service: config.service,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddr: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = this.config.baseUrl;
    const url = `${baseUrl}/users/email-verifiy?signupVerifyToken=${signupVerifyToken}`;
    const mailOptions: EmailOptions = {
      from: `${this.config.auth.user}@myapp.com`,
      to: emailAddr,
      subject: '가입 인증 메일',
      html: `
            가입확인 버튼을 눌러 인증을 완료하세요. <br/>
            <form action="${url}" method="POST">
            </form>
          `,
    };
    await this.send(mailOptions);
  }
  //send는 private로 캡슐화하는게 좋음
  private async send(mailOptions: EmailOptions) {
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (e) {
      Logger.warn(e);
    }
  }
}
