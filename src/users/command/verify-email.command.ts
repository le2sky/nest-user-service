import { ICommand } from '@nestjs/cqrs';

export class VerifyEmailCommad implements ICommand {
  constructor(readonly signupVerifyToken: string) {}
}
