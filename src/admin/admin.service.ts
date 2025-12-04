import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from '../DTO/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly repo: Repository<Admin>,
  ) {}

  async createAdmin(dto: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const admin = this.repo.create({
      username: dto.username,
      password: hashedPassword,
    });

    return this.repo.save(admin);
  }

  async findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }
}
