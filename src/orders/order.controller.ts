import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './create-order.dto';
import { UpdateOrderStatusDto } from './update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * POST /orders
   * Example:
   * /orders?page=1&limit=10
   * /orders?employeeId=56
   * /orders?orderId=ORD-1002
   */
  @Post('list')
  getOrderList(
    @Query('page') page = '1',
    @Query('size') size = '10',
    @Body()
    body: {
      status?: 'All' | 'Pending' | 'Confirmed' | 'Delivered' | 'Cancel';
      employeeId?: string;
      orderId?: string;
    },
  ) {
    return this.ordersService.getOrderList({
      page: Number(page),
      size: Number(size),
      status: body?.status ?? 'All',
      employeeId: body?.employeeId,
      orderId: body?.orderId,
    });
  }

  // ✅ CREATE ORDER
  @Post()
  createOrder(@Body() body: CreateOrderDto) {
    return this.ordersService.createOrder(body);
  }

  // ✅ GET BY ORDER ID
  @Get(':orderId')
  getOrderByOrderId(@Param('orderId') orderId: string) {
    return this.ordersService.getOrderByOrderId(orderId);
  }

  // ✅ UPDATE STATUS + RETURN LIST
  @Post(':id/status')
  updateStatusAndReturnList(
    @Param('id') id: string,
    @Query('page') page = '1',
    @Query('size') size = '10',
    @Body() body: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatusAndReturnList(id, {
      status: body.status,
      page: Number(page),
      size: Number(size),
      listStatus: body.listStatus ?? 'All',
      employeeId: body.employeeId,
      orderId: body.orderId,
    });
  }
}
