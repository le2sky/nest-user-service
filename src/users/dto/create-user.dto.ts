/*
요구사항
사용자 이름: 2자 이상 30자 이하 문자열
사용자 이메일: 60자 이하 이메일 형식 문자열
사용자 비밀번호: 영문대소문자, 숫자, 특수문자(!@#$%^&*()) 1개 이상 포함 8자 이상 30자 이하 문자열
*/

import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @Transform(({ value, obj }) => {
    if (obj.password.includes(value.trim())) {
      throw new BadRequestException(
        'password에 name과 같은 문자열을 포함할 수 없습니다.',
      );
    }
    return value.trim();
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

  @Transform(({ value }: { value: string }) => {
    [...value.trim()].forEach((item: string, index: number, arr: string[]) => {
      if (+item && index + 3 <= arr.length) {
        if (
          !isNaN(+arr[index + 1]) &&
          !isNaN(+arr[index + 2]) &&
          !isNaN(+arr[index + 3])
        ) {
          console.log('hi');
          let count = 0;
          for (let i = index + 3; i > index; i--) {
            count -= +arr[i] - +arr[i - 1];
          }
          if (count === -3 || count === +3)
            throw new BadRequestException(
              '비밀번호에 연속된 숫자를 입력할 수 없습니다!',
            );
        }
      }
    });
    return value.trim();
  })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8, 30}$/)
  public readonly password: string;
}
