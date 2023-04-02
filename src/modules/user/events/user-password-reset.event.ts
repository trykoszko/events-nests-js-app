export class UserPasswordResetEvent {

    public constructor(
        readonly firstName: string,
        readonly email: string,
        readonly passwordResetToken: string
    )
    {

    }

}
