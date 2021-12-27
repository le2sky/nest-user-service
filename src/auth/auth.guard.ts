import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const header = context.switchToHttp().getRequest()
      .headers as IncomingHttpHeaders;

    return this.validateRequest(header);
  }

  private async validateRequest(header: IncomingHttpHeaders) {
    const jwtString = header.authorization.split('Bearer ')[1];

    this.authService.verify(jwtString);
    return true;
  }
}
