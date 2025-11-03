import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly repo: Repository<Admin>,
  ) {}

  async createAdmin(username: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const admin = this.repo.create({ username, password: hashed });
    return this.repo.save(admin);
  }

  async findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }
}
