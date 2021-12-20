import { IsUUID } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 60 })
  email: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 30 })
  password: string;

  @IsUUID()
  @Column({ length: 60 })
  signupVerifyToken: string;
}
