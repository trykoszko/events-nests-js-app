import {Injectable} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class MailService {

    constructor(
        private mailerService: MailerService,
        private configService: ConfigService
    ) {
    }

    async sendRegisterConfirmationEmail(name: string, email: string, confirmationToken: string): Promise<boolean> {
        return await this.mailerService.sendMail({
            to: email,
            subject: 'welcome to CYA.', // @TODO: i18n
            template: './confirm-registration.template.hbs',
            context: {
                name,
                logo: `${this.configService.get('APP_URL')}/assets/icon.png`,
                link: `${this.configService.get('APP_LANDING_URL')}/confirm-registration/${confirmationToken}`,
            },
        });
    }

    async sendForgotPasswordEmail(name: string, email: string, resetPasswordToken: string): Promise<boolean> {
        return await this.mailerService.sendMail({
            to: email,
            subject: 'CYA forgot password link', // @TODO: i18n
            template: './forgot-password.template.hbs',
            context: {
                name,
                logo: `${this.configService.get('APP_URL')}/assets/icon.png`,
                link: `${this.configService.get('APP_LANDING_URL')}/forgot-password/${resetPasswordToken}`
            },
        });
    }

}
