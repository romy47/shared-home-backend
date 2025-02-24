import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class loginDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
