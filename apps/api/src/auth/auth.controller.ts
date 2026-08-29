import { Controller, Post, Get, Delete, Patch, Body, HttpCode, HttpStatus, UseGuards, Req, Param, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getUsers(@Req() req: any) {
    return this.authService.getUsers(req.user.companyId);
  }

  @Post('users')
  @UseGuards(JwtAuthGuard)
  async createUser(@Req() req: any, @Body() body: any) {
    return this.authService.createUser(req.user.companyId, body);
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only Super Admins can delete user accounts');
    }
    if (req.user.sub === id || req.user.id === id) {
      throw new ForbiddenException('You cannot delete your own account');
    }
    return this.authService.deleteUser(req.user.companyId, id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req: any, @Body() body: any) {
    return this.authService.updateProfile(req.user.id, body);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Req() req: any, @Body() body: any) {
    return this.authService.changePassword(req.user.id, body);
  }
}
