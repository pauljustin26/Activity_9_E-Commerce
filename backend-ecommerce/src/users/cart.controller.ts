import { Controller, Get, Put, Body, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // Import the guard we fixed earlier
import { UsersService } from './users.service';

@Controller('cart')
export class CartController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard) // <--- Protects the route
  @Get()
  async getCart(@Request() req) {
    // req.user is populated by AuthGuard from the JWT token
    console.log("Fetching cart for user:", req.user.sub); // Debug log
    return this.usersService.getCart(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Put()
  async syncCart(@Request() req, @Body() body: { items: any[] }) {
    console.log("Saving cart for user:", req.user.sub, body.items); // Debug log
    return this.usersService.updateCart(req.user.sub, body.items);
  }
}