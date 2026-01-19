import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { UserBody } from './objects/body/user.body';
import { UserEntity } from './objects/entities/user.entity';

@Injectable()
export class UserService {
  
    constructor(
         @InjectRepository(UserEntity) private repository: Repository<UserEntity>
    ) { }

    async fetchOne(id: number): Promise<UserEntity | null> {
        return await this.repository.findOneBy({ id: id })
    }

    async create(body: UserBody): Promise<UserEntity> {
        const existing = await this.repository.findOne({ where: { email: body.email } });

        if (existing) {
            throw new BadRequestException("Email already used");
        }

        const hashedPassword = await argon2.hash(body.password);

        const userCreated = this.repository.create({
            ...body,
            password: hashedPassword,
        });

        const userSaved = await this.repository.save(userCreated);

        return userSaved
    }
}
