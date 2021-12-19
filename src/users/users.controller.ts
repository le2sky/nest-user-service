import { Body, Controller, Get, Post } from '@nestjs/common';
import { get } from 'http';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  // @Get()
  // public getUser() {
  //   return 'hi';
  // }

  @Post()
  public async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }
}
