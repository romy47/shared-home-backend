import { da } from "@faker-js/faker/.";
import { ApiProperty } from "@nestjs/swagger";
import { Expense } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { Exclude, Transform } from "class-transformer";
import { ExpenseCategory } from "src/generated/nestjs-dto/expenseCategory.entity";
import { ExpenseSplit } from "src/generated/nestjs-dto/expenseSplit.entity";
import { House } from "src/generated/nestjs-dto/house.entity";
import { HouseUser } from "src/generated/nestjs-dto/houseUser.entity";
import { RecurringExpense } from "src/generated/nestjs-dto/recurringExpense.entity";

export class ExpenseBaseEntity implements Expense {
    @ApiProperty({
      type: 'integer',
      format: 'int32',
    })
    id: number ;
    @ApiProperty({
      type: 'integer',
      format: 'int32',
    })
    house_user_id: number ;
    @ApiProperty({
      type: 'integer',
      format: 'int32',
    })
    house_id: number ;
    @ApiProperty({
      type: 'integer',
      format: 'int32',
    })
    expense_category_id: number ;
    @ApiProperty({
      type: 'integer',
      format: 'int32',
      nullable: true,
    })
    recurring_expense_id: number  | null;
    @ApiProperty({
      type: 'string',
    })
    currency: string ;
    @ApiProperty({
      type: 'string',
    })
    title: string ;
    @ApiProperty({
      type: 'number',
      format: 'double',
    })
    amount: Prisma.Decimal ;
    @ApiProperty({
      type: 'string',
      format: 'date-time',
    })
    created_at: Date ;
    @ApiProperty({
      type: 'string',
      format: 'date-time',
    })
    updated_at: Date ;
    @ApiProperty({
      type: () => HouseUser,
      required: false,
    })
    user?: HouseUser ;
    @ApiProperty({
      type: () => House,
      required: false,
    })
    house?: House ;
    @ApiProperty({
      type: () => ExpenseCategory,
      required: false,
    })
    expenseCategory?: ExpenseCategory ;
    @ApiProperty({
      type: () => RecurringExpense,
      required: false,
      nullable: true,
    })
    recurringExpense?: RecurringExpense  | null;
    @ApiProperty({
      type: () => ExpenseSplit,
      isArray: true,
      required: false,
    })
    ExpenseSplit?: ExpenseSplit[] ;
    constructor(data: Partial<ExpenseBaseEntity>){
      Object.assign(this, data);
    }
}
