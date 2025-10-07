import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UserDocument, Users } from './schema/user.schema';

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

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  // ---------------------------
  // CREATE USER
  // ---------------------------
  async create(user: Users): Promise<Users> {
    const created = new this.userModel(user);
    return created.save();
  }

  // ---------------------------
  // FIND ONE USER BY MONGO _id
  // ---------------------------
  async findOne(id: string): Promise<Users> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // ---------------------------
  // UPDATE USER
  // ---------------------------
  async update(id: string, user: Users): Promise<Users> {
    const updated = await this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return updated;
  }

  // ---------------------------
  // DELETE USER
  // ---------------------------
  async delete(id: string): Promise<void> {
    const res = await this.userModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException('User not found');
    }
  }

  // ---------------------------
  // PAGINATED LIST (POST /users/list)
  // ---------------------------
  async getAllByPagination(page: number, size: number, departments?: string[]) {
    const filter: FilterQuery<UserDocument> = {};

    if (departments && departments.length) {
      filter.department = { $in: departments };
    }

    const total = await this.userModel.countDocuments(filter);

    const data = await this.userModel
      .find(filter)
      .skip((page - 1) * size)
      .limit(size)
      .exec();

    return {
      data,
      total,
    };
  }

  // ---------------------------
  // FILTER LIST (GET /users)
  // ---------------------------
  async getUsersByFilters(
    pageNumber: number,
    pageSize: number,
    company?: string,
    department?: string,
  ) {
    const filter: FilterQuery<UserDocument> = {};

    if (company) {
      filter.company = company;
    }

    if (department) {
      filter.department = department;
    }

    const total = await this.userModel.countDocuments(filter);

    const data = await this.userModel
      .find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    return {
      total,
      data,
    };
  }

  async login(identifier: string, password: string): Promise<LoggedInUserDto> {
    // identifier can be phone OR email
    const user = await this.userModel
      .findOne({
        $or: [{ phone: identifier }, { email: identifier }],
      })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found with this phone or email');
    }

    // (Plain text compare for now – later you can hash)
    if (user.password !== password) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      company: user.company,
      employeeId: user.employeeId,
      department: user.department,
      designation: user.designation,
      phone: user.phone,
      email: user.email,
    };
  }
}
