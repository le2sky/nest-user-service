import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnhealthyResponseCodeError } from '@nestjs/terminus';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { VerifyEmailCommad } from './verify-email.command';

@Injectable()
@CommandHandler(VerifyEmailCommad)
export class VerifyEmailHandler implements ICommandHandler {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}
  async execute(command: any): Promise<any> {
    const { signupVerifyToken } = command;
    const user = await this.usersRepository.findOne({ signupVerifyToken });
    if (!user) {
      throw new NotFoundException('User does not found');
    }
    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
}
