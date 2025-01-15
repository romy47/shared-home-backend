import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  @IsNotEmpty()
  @IsDecimal()
  amount: Prisma.Decimal;

  @ApiProperty({
    type: 'number',
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    type: 'number',
  })
  @IsNotEmpty()
  @IsNumber()
  houseId: number;

  @ApiProperty({
    type: 'number',
  })
  @IsNotEmpty()
  @IsNumber()
  expenseCategoryId: number;
}