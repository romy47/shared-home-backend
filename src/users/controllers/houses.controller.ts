import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BaseHouseEntity, HouseDetailEntity } from '../entities/house.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { HousesService } from '../services/houses.service';
import { HouseRolesGuard } from 'src/guards/authorization/roles.guard';
import { HouseRoles } from 'src/guards/authorization/roles.decorator';
import { HouseRole } from 'src/guards/types';

@Controller('houses')
@ApiBearerAuth('access-token')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  // @Post()
  // @ApiOkResponse({ type: UserBaseEntity })
  // async create(@Body() createUserDto: CreateUserDto): Promise<UserBaseEntity> {
  //   console.log(createUserDto);
  //   const user = await this.housesService.create(createUserDto);
  //   return new UserBaseEntity(user);
  // }

  @Get(':house_id')
  @UseGuards(HouseRolesGuard)
  @HouseRoles(HouseRole.TENANT, HouseRole.ADMIN)
  @ApiOkResponse({ type: HouseDetailEntity })
  async findOne(@Request() req, @Param('house_id') id: string) {
    const houseDetail = await this.housesService.findOne(+id);
    return new HouseDetailEntity(houseDetail);
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
