import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UserEntity } from './objects/entities/user.entity';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [
                UserEntity
            ],
            synchronize: true // TODO: process.env.POSTGRES_SYNCHRONISE === 'true',
        }),
        TypeOrmModule.forFeature([UserEntity]),
        ClientsModule.register([
            {
                name: 'WALLET_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBIT_MQ ?? ''],
                    queue: 'WALLET_QUEUE',
                    queueOptions: { durable: false },
                },
            }
        ])
    ],
    controllers: [AppController],
    providers: [UserService],
})
export class AppModule { }
