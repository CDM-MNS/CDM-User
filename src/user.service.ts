import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { UserDto, UserEventType } from 'cdm-models';
import { Repository } from 'typeorm';
import { UserBody } from './objects/body/user.body';
import { SetRefreshTokenDto } from './objects/dto/set-refresh-token.dto';
import { UserEntity } from './objects/entities/user.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private repository: Repository<UserEntity>,
        @Inject('WALLET_SERVICE') private readonly walletClient: ClientProxy
    ) { }

    async findOneByEmail(email: string): Promise<UserDto | null> {
        const user = await this.repository.findOneBy({ email });
        if (user) {
            return user.toDto()
        } else { return null }
    }

    async findOneById(id: number): Promise<UserDto | null> {
        const user = await this.repository.findOneBy({ id });
         if (user) {
            return user.toDto()
        } else { return null }
    }

    async create(body: UserBody): Promise<UserDto> {
        const existing = await this.repository.findOne({ where: { email: body.email } });

        if (existing) {
            throw new BadRequestException("Email already used");
        }

        const hashedPassword = await argon2.hash(body.password);

        const userCreated = this.repository.create({
            ...body,
            password: hashedPassword,
        });

        try{
            const userSaved = await this.repository.save(userCreated);
            this.walletClient.emit(UserEventType.CREATED, userSaved.id);
            return userSaved.toDto()
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async setRefreshToken(body: SetRefreshTokenDto): Promise<UserDto> {
        const user = await this.findOneById(body.userId)
        if (user && user.id) {
            await this.repository.update(user.id, { refreshToken: body.refreshToken });
            user.refreshToken = body.refreshToken
            return user
        } else {
            throw new NotFoundException('User not found')
        }
    }
}
