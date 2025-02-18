
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      access_token,
    };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
      isAdmin: false,
    });

    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      access_token,
    };
  }

  async loginAdmin(adminLoginDto: LoginDto) {
    const admin = await this.userService.findByEmail(adminLoginDto.email);
    if (!admin || !admin.isAdmin) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const isPasswordValid = await bcrypt.compare(adminLoginDto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const payload = { sub: admin.id, email: admin.email, isAdmin: true };
    const access_token = this.jwtService.sign(payload);

    return {
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        isAdmin: true,
      },
      access_token,
    };
  }

  async registerAdmin(adminRegisterDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(adminRegisterDto.password, 10);
    const admin = await this.userService.create({
      ...adminRegisterDto,
      password: hashedPassword,
      isAdmin: true,
    });

    const payload = { sub: admin.id, email: admin.email, isAdmin: true };
    const access_token = this.jwtService.sign(payload);

    return {
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        isAdmin: true,
      },
      access_token,
    };
  }

  async getCurrentUser(userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    };
  }
}
