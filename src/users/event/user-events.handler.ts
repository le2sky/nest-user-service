import { EventsHandler, IEventHandler, IEventPublisher } from '@nestjs/cqrs';
import { EmailService } from 'src/email/email.service';
import { TestEvent } from './test-event';
import { UserCreatedEvent } from './user-created.event';

@EventsHandler(UserCreatedEvent, TestEvent)
export class UserEventsHandler
  implements IEventHandler<UserCreatedEvent | TestEvent>
{
  constructor(private emailService: EmailService) {}
  async handle(event: UserCreatedEvent | TestEvent) {
    switch (event.name) {
      case UserCreatedEvent.name: {
        const { email, signupVerifyToken } = event as UserCreatedEvent;
        this.userCreatedEventHandler(email, signupVerifyToken);
      }
      case TestEvent.name: {
        console.log('handler the test event!');
        break;
      }
      default:
        break;
    }
  }
  async userCreatedEventHandler(
    email: string,
    signupVerifyToken: string,
  ): Promise<void> {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}
