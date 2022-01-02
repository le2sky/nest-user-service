import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { CreateUserHandler } from './command/create-user.handler';
import { LoginHandler } from './command/login.handler';
import { VerifyAccessTokenHandler } from './command/verify-access-token.handler';
import { VerifyEmailHandler } from './command/verify-email.handler';
import { UserEntity } from './entity/user.entity';
import { UsersController } from './users.controller';
import { UserEventsHandler } from './event/user-events.handler';
import { GetUserInfoQueryHandler } from './query/get-user-info.handler';

const commandHandler = [
  CreateUserHandler,
  LoginHandler,
  VerifyEmailHandler,
  VerifyAccessTokenHandler,
];

const queryHandler = [GetUserInfoQueryHandler];

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity]), AuthModule],
  controllers: [UsersController],
  providers: [UserEventsHandler, ...commandHandler, ...queryHandler],
})
export class UsersModule {}
