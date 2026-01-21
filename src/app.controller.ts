import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthEventType } from 'cdm-models';
import { UserBody } from './objects/body/user.body';
import { SetRefreshTokenDto } from './objects/dto/set-refresh-token.dto';
import { UserService } from './user.service';
import { RpcValidationPipe } from './utils/rpc-validation';

@Controller('user')
export class AppController {
    constructor(private readonly userService: UserService) { }

    @MessagePattern({ cmd: AuthEventType.FIND_ONE_BY_ID })
    findOneUserByIdFromEvent(
        @Payload(new RpcValidationPipe()) data: { id: number },
    ) {
        return this.userService.findOneById(data.id);
    }

    @MessagePattern({ cmd: AuthEventType.FIND_ONE_BY_EMAIL })
    findOneUserByEmailFromEvent(
        @Payload(new RpcValidationPipe()) data: { email: string },
    ) {
        return this.userService.findOneByEmail(data.email);
    }

    @MessagePattern({ cmd: AuthEventType.NEED_USER_CREATION })
    createUserFromEvent(@Payload(new RpcValidationPipe()) data: UserBody) {
        return this.userService.create(data);
    }

    @MessagePattern({ cmd: AuthEventType.SET_REFRESH_TOKEN })
    setRefreshTokenFromEvent(
        @Payload(new RpcValidationPipe()) data: SetRefreshTokenDto,
    ) {
        return this.userService.setRefreshToken(data);
    }
}
