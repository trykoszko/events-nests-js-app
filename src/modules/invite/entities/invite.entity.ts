import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Event } from '../../event/entities/event.entity';
import { User } from "../../user/entities/user.entity";

@Entity('invites')
@Unique(['id'])
export class Invite {

    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({})
    message: string;

    /**
     * Relations
     */

    @ManyToOne(() => Event, (event: Event) => event.invites)
    @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
    event: Event;

    @ManyToOne(() => User, (user: User) => user.owned_invites)
    @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' })
    owner: User;

}
