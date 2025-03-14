import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { BaseUserEntity, UserDetailEntity } from '../entities/user.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard, Public } from '../../guards/auth.guard';
import { loginDto, SignupDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { UserCredential } from 'firebase/auth';

@Controller('')
@ApiBearerAuth('access-token')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOkResponse({ type: BaseUserEntity })
  @Public()
  async login(@Body() loginDto: loginDto): Promise<string> {
    return await this.authService.login(loginDto);
  }

  @Post('/signup')
  @Public()
  @ApiOkResponse({ type: BaseUserEntity })
  async signup(@Body() signupDto: SignupDto): Promise<BaseUserEntity> {
    const user = await this.authService.signup(signupDto);
    return new BaseUserEntity(user);
  }
}
