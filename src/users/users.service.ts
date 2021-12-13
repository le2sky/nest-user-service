import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

@Injectable()
export class UsersService {
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
  private sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    return;
  }
}
