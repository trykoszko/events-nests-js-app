export class UserCreatedEvent {

    public constructor(
        readonly firstName: string,
        readonly email: string,
        readonly confirmationToken: string
    )
    {

    }

}
