import { registerAs } from '@nestjs/config';

//email이라는 토큰의 configFactory를 등록할 수 있는 함수.

export default registerAs('email', () => ({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASSWORD,
  },
  baseUrl: process.env.EMAIL_BASE_URL,
}));
