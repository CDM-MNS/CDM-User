import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserBody } from './objects/body/user.body';
import { SetRefreshTokenDto } from './objects/dto/set-refresh-token.dto';
import { UserService } from './user.service';
import { RpcValidationPipe } from './utils/rpc-validation';

@Controller('user')
export class AppController {
    constructor(private readonly userService: UserService) { }

    @MessagePattern({ cmd: 'auth.findOneById' })
    findOneUserByIdFromEvent(
        @Payload(new RpcValidationPipe()) data: { id: number },
    ) {
        return this.userService.findOneById(data.id);
    }

    @MessagePattern({ cmd: 'auth.findOneByEmail' })
    findOneUserByEmailFromEvent(
        @Payload(new RpcValidationPipe()) data: { email: string },
    ) {
        return this.userService.findOneByEmail(data.email);
    }

    @MessagePattern({ cmd: 'auth.needUserCreation' })
    createUserFromEvent(@Payload(new RpcValidationPipe()) data: UserBody) {
        return this.userService.create(data);
    }

    @MessagePattern({ cmd: 'auth.setRefreshToken' })
    setRefreshTokenFromEvent(
        @Payload(new RpcValidationPipe()) data: SetRefreshTokenDto,
    ) {
        return this.userService.setRefreshToken(data);
    }
}
