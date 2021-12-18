/*
요구사항
사용자 이름: 2자 이상 30자 이하 문자열
사용자 이메일: 60자 이하 이메일 형식 문자열
사용자 비밀번호: 영문대소문자, 숫자, 특수문자(!@#$%^&*()) 1개 이상 포함 8자 이상 30자 이하 문자열 
+ 연속된 숫자 4개이상 (ex: 1234) 포함 금지
*/

import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NotIn } from 'src/util/decorators/validation/string/not-in.decorator';
import { NotContinutyPasswordNumber } from 'src/util/decorators/validation/string/not-continuity.decorator';

export class CreateUserDto {
  @Transform(({ value }) => value.trim())
  @NotIn('password', {
    message: 'password는 name과 같은 문자열을 포함할 수 없습니다.',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  public readonly name: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsEmail()
  @MaxLength(60)
  public readonly email: string;

  @Transform(({ value }) => value.trim())
  @NotContinutyPasswordNumber({ message: '연속된 숫자 포함!' })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  public readonly password: string;
}
