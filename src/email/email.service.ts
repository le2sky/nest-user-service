import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: '', // config 에서 작성 예정
        pass: '', // config 에서 작성 예정
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddr: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = ''; //config 에서 작성 예정,
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

  private async send(mailOptions: EmailOptions) {
    return await this.transporter.sendMail(mailOptions);
  }
}
