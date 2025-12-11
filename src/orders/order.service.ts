import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Orders, OrdersDocument } from './schema/order.schema';
import { CreateOrderDto } from './create-order.dto';

interface OrderListQuery {
  page: number;
  size: number;
  employeeId?: string;
  orderId?: string;
  status?: 'All' | 'Pending' | 'Confirmed' | 'Delivered' | 'Cancel';
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name)
    private readonly ordersModel: Model<OrdersDocument>,
  ) {}

  async getOrderList(query: OrderListQuery) {
    const { page, size, status, employeeId, orderId } = query;

    const filter: FilterQuery<OrdersDocument> = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (employeeId) {
      filter['employeeInfo.employeeId'] = employeeId;
    }

    if (orderId) {
      filter.orderId = orderId;
    }

    const skip = (page - 1) * size;

    const [data, total] = await Promise.all([
      this.ordersModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .lean(),
      this.ordersModel.countDocuments(filter),
    ]);

    return {
      data,
      meta: {
        total,
      },
    };
  }

  async createOrder(dto: CreateOrderDto) {
    const exists = await this.ordersModel.findOne({
      orderId: dto.orderId,
    });

    if (exists) {
      throw new BadRequestException('Order already exists');
    }

    const order = new this.ordersModel({
      ...dto,
      // status: dto.status ?? 'Pending',
    });

    return order.save();
  }

  async getOrderByOrderId(orderId: string) {
    const order = await this.ordersModel.findOne({ orderId }).lean();

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    return order;
  }

  async updateOrderStatusAndReturnList(
    id: string,
    payload: {
      status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancel';
      page: number;
      size: number;
      listStatus?: 'All' | 'Pending' | 'Confirmed' | 'Delivered' | 'Cancel';
      employeeId?: string;
      orderId?: string;
    },
  ) {
    const {
      status,
      page,
      size,
      listStatus = 'All',
      employeeId,
      orderId,
    } = payload;

    if (!id) throw new BadRequestException('Order id is required');

    const updated = await this.ordersModel
      .findByIdAndUpdate(id, { $set: { status } }, { new: true })
      .lean();

    if (!updated) throw new NotFoundException('Order not found');

    // build same filter as list
    const filter: FilterQuery<OrdersDocument> = {};
    if (employeeId) filter['employeeInfo.employeeId'] = employeeId;
    if (orderId) filter.orderId = orderId;
    if (listStatus && listStatus !== 'All') filter.status = listStatus;

    const skip = (page - 1) * size;

    const [data, total] = await Promise.all([
      this.ordersModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .lean(),
      this.ordersModel.countDocuments(filter),
    ]);

    return {
      data,
      meta: {
        total,
      },
      updatedOrder: updated, // optional but useful
    };
  }
}
