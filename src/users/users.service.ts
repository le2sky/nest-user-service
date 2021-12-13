import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';

@Injectable()
export class UsersService {
  constructor(private readonly emailService: EmailService) {}

  //@ user find -> save -> email verify with token
  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);
    const signupVerifyToken = uuid.v1();
    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(emailAddr: string): Promise<boolean> {
    return false; // db 연결 미구현
  }
  private async saveUser(
    name: string,
    email: string,
    password: string,
    sighupVerifyToken: string,
  ) {
    return; //db연결 미 구현
  }
  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}
