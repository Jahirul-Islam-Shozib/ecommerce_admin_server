/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsIn(['Pending', 'Confirmed', 'Delivered', 'Cancel'])
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancel';

  @IsOptional()
  @IsIn(['All', 'Pending', 'Confirmed', 'Delivered', 'Cancel'])
  listStatus?: 'All' | 'Pending' | 'Confirmed' | 'Delivered' | 'Cancel';

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsString()
  orderId?: string;
}
