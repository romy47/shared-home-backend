import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  first_name: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  last_name: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  email: string | null;
  @ApiProperty({
    type: 'string',
  })
  auth_id: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  username: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  birthday: Date | null;
}
