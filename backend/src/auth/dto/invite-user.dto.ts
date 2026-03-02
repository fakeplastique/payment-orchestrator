import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';

export class InviteUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsIn(['manager', 'viewer'])
  role: 'manager' | 'viewer';
}
