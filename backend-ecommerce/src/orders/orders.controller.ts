import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '../auth/auth.guard'; // Import AuthGuard

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard) // Protect creation too (optional but recommended)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // 👇 ADD THIS: Get "My" Orders
  @UseGuards(AuthGuard)
  @Get('mine')
  findMyOrders(@Request() req) {
    // req.user is attached by AuthGuard
    return this.ordersService.findUserOrders(req.user.name);
  }
}