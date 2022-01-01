import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { DogHealthIndicator } from './dog.health';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private dogHealthIndicator: DogHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      //HttpHealthIndicator가 제공하는 pingCheck 함수를 이용해 서비스가 제공하는 다른 서버가 잘 동작하는 지 확인한다.
      // 잘 동작하면 응답 결과를 첫번째 인자로 넣은 nestjs-docs를 응답으로 준다.
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.db.pingCheck('database'),
      () => this.dogHealthIndicator.isHealth('dog'),
    ]);
  }
}
