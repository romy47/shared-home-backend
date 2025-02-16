import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserBaseEntity, UserDetailEntity } from '../entities/user.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';

@Controller('users')
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOkResponse({ type: UserBaseEntity })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserBaseEntity> {
    console.log(createUserDto);
    const user = await this.usersService.create(createUserDto);
    return new UserBaseEntity(user);
  }

  @Get(':id')
  @ApiOkResponse({ type: UserDetailEntity })
  async findOne(@Request() req, @Param('id') id: string) {
    const user = req.user;
    return new UserDetailEntity(user);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
