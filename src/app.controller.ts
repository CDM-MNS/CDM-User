import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserBody } from './objects/body/user.body';
import { SetRefreshTokenDto } from './objects/dto/set-refresh-token.dto';
import { UserService } from './user.service';
import { RpcValidationPipe } from './utils/rpc-validation';

@Controller('user')
export class AppController {
    constructor(private readonly userService: UserService) { }

    @MessagePattern({ cmd: 'user.findOne' })
    findOneUserFromEvent(@Payload(new RpcValidationPipe()) data: { email: string }) {
        return this.userService.findOneByEmail(data.email);
    }

    @MessagePattern({ cmd: 'user.create' })
    createUserFromEvent(@Payload(new RpcValidationPipe()) data: UserBody) {
        return this.userService.create(data);
    }

    @MessagePattern({ cmd: 'user.setRefreshToken' })
    setRefreshTokenFromEvent(@Payload(new RpcValidationPipe()) data: SetRefreshTokenDto) {
        return this.userService.setRefreshToken(data);
    }

}
