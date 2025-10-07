import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './schema/user.schema';

export class LoggedInUserDto {
  _id: string;
  name: string;
  company: string;
  employeeId: string | number;
  department: string;
  designation?: string | null;
  phone: string;
  email: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  // ---------------------------
  // PAGINATED USER LIST
  // ---------------------------
  @Post('list')
  async getUsers(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Body('departments') departments?: string[],
  ) {
    return this.userService.getAllByPagination(
      Number(page),
      Number(size),
      departments,
    );
  }

  // ---------------------------
  // CREATE USER
  // ---------------------------
  @Post()
  async addUser(@Body() user: Users): Promise<any> {
    return this.userService.create(user);
  }

  // ---------------------------
  // GET SINGLE USER
  // ---------------------------
  @Get(':id')
  async findUser(@Param('id') id: string): Promise<any> {
    return this.userService.findOne(id);
  }

  // ---------------------------
  // UPDATE USER
  // ---------------------------
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() user: Users): Promise<any> {
    return this.userService.update(id, user);
  }

  // ---------------------------
  // DELETE USER
  // ---------------------------
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  // ---------------------------
  // OPTIONAL: FILTER BY COMPANY / DEPARTMENT
  // ---------------------------
  @Get()
  async getUsersByFilters(
    @Query('pageNumber') pageNumber: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('company') company?: string,
    @Query('department') department?: string,
  ) {
    return this.userService.getUsersByFilters(
      pageNumber,
      pageSize,
      company,
      department,
    );
  }

  @Post('login')
  async login(
    @Body('identifier') identifier: string,
    @Body('password') password: string,
  ): Promise<LoggedInUserDto> {
    return this.userService.login(identifier, password);
  }
}
