import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Users } from '../entities/Users';
import { Companies } from '../entities/Companies';
import { RefreshTokens } from '../entities/RefreshTokens';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { AuthUser } from './decorators/current-user.decorator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepo: Repository<Users>,
    @InjectRepository(Companies) private companiesRepo: Repository<Companies>,
    @InjectRepository(RefreshTokens) private refreshTokensRepo: Repository<RefreshTokens>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const company = await this.companiesRepo.save(
      this.companiesRepo.create({
        name: dto.companyName,
        apiKeyHash: crypto.randomBytes(32).toString('hex'),
      }),
    );

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.usersRepo.save(
      this.usersRepo.create({
        email: dto.email,
        passwordHash,
        role: 'manager',
        company,
      }),
    );

    return this.generateTokens(user, company.id);
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({
      where: { email: dto.email },
      relations: ['company'],
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    user.lastLoginDate = new Date();
    await this.usersRepo.save(user);

    return this.generateTokens(user, user.company.id);
  }

  async refresh(refreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const stored = await this.refreshTokensRepo.findOne({
      where: { tokenHash, isRevoked: false },
      relations: ['user', 'user.company'],
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    stored.isRevoked = true;
    await this.refreshTokensRepo.save(stored);

    return this.generateTokens(stored.user, stored.user.company.id);
  }

  async logout(refreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.refreshTokensRepo.update({ tokenHash }, { isRevoked: true });
  }

  async inviteUser(dto: InviteUserDto, inviter: AuthUser) {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.usersRepo.save(
      this.usersRepo.create({
        email: dto.email,
        passwordHash,
        role: dto.role,
        company: { id: inviter.companyId } as Companies,
      }),
    );

    return { id: user.id, email: user.email, role: user.role };
  }

  async getProfile(userId: string) {
    return this.usersRepo.findOne({
      where: { id: userId },
      relations: ['company'],
      select: ['id', 'email', 'role', 'lastLoginDate'],
    });
  }

  private async generateTokens(user: Users, companyId: string) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow('JWT_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = crypto.randomBytes(64).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await this.refreshTokensRepo.save(
      this.refreshTokensRepo.create({
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        user,
      }),
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId,
      },
    };
  }
}
