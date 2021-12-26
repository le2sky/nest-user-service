import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { OptimisticLockVersionMismatchError } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  public test() {
    Logger.log('good gety');
    return 'test';
  }

  @Post()
  public async createUser(@Body() dto: CreateUserDto): Promise<string> {
    const { name, email, password } = dto;
    return await this.usersService.createUser(name, email, password);
  }

  @Post('/email-verify')
  public async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    await this.usersService.verifyEmail(signupVerifyToken);
    return '회원가입이 완료되었습니다';
  }

  @Post('login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    return await this.usersService.login(email, password);
  }
}
