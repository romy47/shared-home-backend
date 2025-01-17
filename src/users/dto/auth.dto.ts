import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  emailVerified: boolean;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  displayName: string;
  @ApiProperty()
  disabled: boolean;
}

export class loginDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
