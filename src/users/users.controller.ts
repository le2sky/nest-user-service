import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserCommand } from './command/create-user.command';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyEmailCommad } from './command/verify-email.command';
import { LoginCommand } from './command/login.command';
import { VerifyAccessTokenCommand } from './command/verify-access-token.command';
import { GetUserInfoQuery } from './query/get-user-info.query';
import { UserInfo } from './interface/UseInfo';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get(':id')
  async getUserInfo(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    const jwtString = headers.authorization.split('Bearer ')[1];

    const verifyAccessTokenCommand = new VerifyAccessTokenCommand(jwtString);
    await this.commandBus.execute(verifyAccessTokenCommand);
    const getUserInfoQuery = new GetUserInfoQuery(userId);
    return this.queryBus.execute(getUserInfoQuery);
  }

  @Post()
  public async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    const command = new CreateUserCommand(name, email, password);
    return this.commandBus.execute(command);
  }

  @Post('/email-verify')
  public async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    const command = new VerifyEmailCommad(signupVerifyToken);
    return this.commandBus.execute(command);
  }

  @Post('login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    const command = new LoginCommand(email, password);
    return this.commandBus.execute(command);
  }
}
