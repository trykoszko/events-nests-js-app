import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn
} from 'typeorm'
import { IsEmail, Matches, MinLength } from 'class-validator'
import * as bcrypt from 'bcryptjs'
import { Event } from '../../event/entities/event.entity';
import { Invite } from "../../invite/entities/invite.entity";

const salt = bcrypt.genSaltSync()

@Entity('users')
@Unique(['id', 'email'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({ select: false })
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password should contain at least one special character and uppercase letter' })
    password: string;

    @Column({ nullable: true })
    first_name: string;

    @Column({ nullable: true })
    last_name: string;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    birthdate: Date;

    @Column({ nullable: true })
    location_city: string;

    @Column({ nullable: true })
    location_country: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    avatar_url: string;

    @Column({ nullable: true })
    social_url_instagram: string;

    @Column({ nullable: true })
    social_url_facebook: string;

    @Column({ nullable: true })
    facebook_user_id: string;

    @Column({ default: 1 })
    permissions: number;

    @Column({ default: false })
    terms_accepted: boolean;

    @Column({ default: false })
    is_active: boolean;

    @Column({ nullable: true, select: false })
    confirmation_token?: string;

    @Column({ nullable: true, select: false })
    password_reset_token?: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    /**
     * General relations
     */

    @OneToMany(() => Invite, (invite: Invite) => invite.owner)
    owned_invites: Invite[];

    /**
     * Event relations
     */

    @OneToMany(() => Event, (event: Event) => event.owner)
    events_owned: Event[];

    @ManyToMany(() => Event, (event: Event) => event.users_joined)
    events_joined: Event[]

    @ManyToMany(() => Event, (event: Event) => event.users_rejected)
    events_rejected: Event[]

    @ManyToMany(() => Event, (event: Event) => event.users_pending)
    events_pending: Event[]

    @ManyToMany(() => Event, (event: Event) => event.users_removed)
    events_removed: Event[]

    /**
     * Functions
     */

    @BeforeInsert()
    @BeforeUpdate()
    async setPassword(password: string) {
        if (password || this.password) {
            this.password = await bcrypt.hash(password || this.password, salt);
        }
    }

}
