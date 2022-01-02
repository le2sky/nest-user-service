import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import authConfig from 'src/config/authConfig';
import { VerifyAccessTokenCommand } from './verify-access-token.command';
import { UserInfo } from '../interface/UseInfo';
import * as jwt from 'jsonwebtoken';

@Injectable()
@CommandHandler(VerifyAccessTokenCommand)
export class VerifyAccessTokenHandler implements ICommandHandler {
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {}
  async execute(command: any): Promise<any> {
    const { jwtString } = command;
    try {
      const payload = jwt.verify(jwtString, this.config.jwtSecret) as (
        | jwt.JwtPayload
        | string
      ) &
        UserInfo;
      const { id, email } = payload;
      return {
        userId: id,
        email,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
