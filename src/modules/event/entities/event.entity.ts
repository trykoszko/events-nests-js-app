import {
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import slugify from "../../../helpers";
import { EventType } from "./event-type.entity";
import { Invite } from "../../invite/entities/invite.entity";

@Entity('events')
@Unique(['id'])
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({})
    title: string;

    @Column({})
    slug: string;

    @Column({})
    location_city: string;

    @Column({})
    location_country: string;

    @Column({})
    description: string;

    @Column({})
    slots: number;

    @Column({})
    date_time: Date;

    @Column({})
    duration: number;

    @Column({
        nullable: true
    })
    background_image_url: string;

    @Column({})
    is_open: boolean;

    @Column({})
    is_address_visible: boolean;

    @Column({})
    is_userlist_visible: boolean;

    @Column({})
    is_allowed_to_join_when_in_progress: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    /**
     * General relations
     */

    @ManyToOne(() => EventType, (eventType: EventType) => eventType.events, {
        eager: true,
        cascade: true
    })
    @JoinColumn({ name: 'type_id', referencedColumnName: 'id' })
    type: EventType;

    @OneToMany(() => Invite, (invite: Invite) => invite.event)
    invites: Invite[];

    /**
     * User relations
     */

    @ManyToOne(() => User, (user: User) => user.events_owned, { eager: true })
    @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' })
    owner: User;

    @ManyToMany(() => User, (user: User) => user.events_joined)
    @JoinTable({
        name: 'event_users_joined',
        joinColumn: {
            name: 'event_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    })
    users_joined!: User[];

    @ManyToMany(() => User, (user: User) => user.events_rejected)
    @JoinTable({
        name: 'event_users_rejected',
        joinColumn: {
            name: 'event_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    })
    users_rejected!: User[];

    @ManyToMany(() => User, (user: User) => user.events_pending)
    @JoinTable({
        name: 'event_users_pending',
        joinColumn: {
            name: 'event_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    })
    users_pending!: User[];

    @ManyToMany(() => User, (user: User) => user.events_removed)
    @JoinTable({
        name: 'event_users_removed',
        joinColumn: {
            name: 'event_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    })
    users_removed!: User[];

    /**
     * Functions
     */

    slots_left: number;

    @AfterLoad()
    countEmptySlots() {
        this.slots_left = this.users_joined ? (this.slots - this.users_joined.length) : this.slots;
    }

    @BeforeInsert()
    @BeforeUpdate()
    setSlug() {
        /**
         * Add unique slug for web use
         */
        if (!this.slug) {
            const uid = (Math.random() + 1).toString(36).substring(2);
            this.slug = slugify(`${this.title}-${uid}`);
        }
    }

}
