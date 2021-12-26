import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
  ): Promise<string> {
    const baseUrl = this.config.baseUrl;
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;
    const mailOptions: EmailOptions = {
      from: `${this.config.auth.user}@naver.com`,
      to: emailAddr,
      subject: '가입 인증 메일',
      html: `
            가입확인 버튼을 눌러 인증을 완료하세요. <br/>
            <form action="${url}" method="POST">
              <button type="submit" formmethod="POST">인증하기👀</button>
            </form>
          `,
    };
    return await this.send(mailOptions);
  }
  //send는 private로 캡슐화하는게 좋음
  private async send(mailOptions: EmailOptions): Promise<string> {
    try {
      await this.transporter.sendMail(mailOptions);
      return '이메일 발송 완료';
    } catch (e) {
      throw new InternalServerErrorException(
        '이메일 발송 과정 중 에러가 발생했습니다.',
      );
    }
  }
}
