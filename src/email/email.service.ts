import { Inject, Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import emailConfig from 'src/config/emailConfig';
import { ConfigType } from '@nestjs/config';

interface EmailOptions {
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
      to: emailAddr,
      subject: '가입 인증 메일',
      html: `
            가입확인 버튼을 눌러 인증을 완료하세요. <br/>
            <form action="${url}" method="POST">
            </form>
          `,
    };
    return await this.send(mailOptions);
  }
  //send는 private로 캡슐화하는게 좋음
  private async send(mailOptions: EmailOptions) {
    return await this.transporter.sendMail(mailOptions);
  }
}
