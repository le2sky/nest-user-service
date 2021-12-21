import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';
import { Connection, Repository } from 'typeorm';
import { ulid } from 'ulid';
import * as uuid from 'uuid';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private connection: Connection,
    private authService: AuthService,
  ) {}

  /*
  Parameter qualification: users/dto/create-user.dto.ts
  */
  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const signupVerifyToken = uuid.v1();

    //await this.saveUser(name, email, password, signupVerifyToken);

    return await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(emailAddr: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email: emailAddr });
    return user !== undefined;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.usersRepository.findOne({ signupVerifyToken });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return this.authService.login({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  }
}

/*
private async saveUserUsingTransaction(name: string, email: string, password: string, signupVerifyToken: string) {
  await this.connection.transaction(async manager => {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;

    await manager.save(user);

    // throw new InternalServerErrorException();
  })
}
  // private async saveUser(
  //   name: string,
  //   email: string,
  //   password: string,
  //   signupVerifyToken: string,
  // ) {
  //   const user = new UserEntity();
  //   user.id = ulid();
  //   user.name = name;
  //   user.email = email;
  //   user.password = password;
  //   user.signupVerifyToken = signupVerifyToken;
  //   await this.usersRepository.save(user);
  // }
  */
