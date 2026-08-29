import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(loginDto: LoginDto) {
    const email = (loginDto.email || '').toLowerCase().trim();
    const password = loginDto.password || '';

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException('Invalid email or password');
    if (!user.isActive) throw new UnauthorizedException('Account has been deactivated');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    // Get company name safely
    let companyName = 'Apex Edible Oils & Foods Pvt Ltd';
    if (user.companyId) {
      const company = await this.prisma.company.findUnique({ where: { id: user.companyId } });
      if (company?.name) companyName = company.name;
    }

    const payload = { sub: user.id, email: user.email, role: user.role, companyId: user.companyId };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || email,
        role: user.role,
        companyId: user.companyId,
        companyName,
      },
    };
  }

  async getUsers(companyId: string) {
    return this.prisma.user.findMany({
      where: { companyId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteUser(companyId: string, userId: string) {
    const result = await this.prisma.user.deleteMany({ where: { id: userId, companyId } });
    if (result.count === 0) {
      throw new NotFoundException('User not found');
    }
    return { id: userId };
  }

  async createUser(companyId: string, data: { email: string; password?: string; firstName: string; lastName: string; role: any }) {
    const email = (data.email || '').toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('User with this email already exists');

    const hashedPassword = await bcrypt.hash(data.password || 'OilERP@123', 10);
    return this.prisma.user.create({
      data: { email, passwordHash: hashedPassword, firstName: (data.firstName || '').trim(), lastName: (data.lastName || '').trim(), role: data.role, companyId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, createdAt: true },
    });
  }

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName?.trim() || user.firstName,
        lastName: data.lastName?.trim() || user.lastName,
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, companyId: true },
    });
  }

  async changePassword(userId: string, data: { currentPassword: string; newPassword: string }) {
    if (!data.currentPassword || !data.newPassword) {
      throw new BadRequestException('Current and new passwords are required');
    }

    if (data.newPassword.length < 8) {
      throw new BadRequestException('New password must be at least 8 characters');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Current password is incorrect');

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }
}
