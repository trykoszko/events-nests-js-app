import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MailService } from "../../mail/services/mail.service";
import { UserCreatedEvent } from "../events/user-created.event";
import { UserPasswordResetEvent } from "../events/user-password-reset.event";

@Injectable()
export class UserEventsService {

    constructor(
        private mailService: MailService
    ) {
    }

    @OnEvent('user.created')
    async sendUserEmailConfirmation(payload: UserCreatedEvent) {
        // send only to users registered via register form (non-social)
        if (payload.confirmationToken) {
            return await this.mailService.sendRegisterConfirmationEmail(payload.firstName, payload.email, payload.confirmationToken);
        }
    }

    @OnEvent('user.password-reset')
    async sendUserPasswordResetToken(payload: UserPasswordResetEvent) {
        // send only to users registered via register form (non-social)
        if (payload.passwordResetToken) {
            return await this.mailService.sendForgotPasswordEmail(payload.firstName, payload.email, payload.passwordResetToken);
        }
    }

}
