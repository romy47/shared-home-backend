import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { BaseUserEntity, UserDetailEntity } from '../entities/user.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { Public } from 'src/guards/auth.guard';

@Controller('users')
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  @ApiOkResponse({ type: BaseUserEntity })
  async create(@Body() createUserDto: CreateUserDto): Promise<BaseUserEntity> {
    console.log(createUserDto);
    const user = await this.usersService.create(createUserDto);
    return new BaseUserEntity(user);
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
