import {BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import slugify from "../../../helpers";
import {Event} from "./event.entity";

@Entity('event_types')
@Unique(['id'])
export class EventType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({})
    title: string;

    @Column({})
    slug: string;

    @Column({})
    icon: string;

    @Column({})
    color: string;

    /**
     * Relations
     */

    @OneToMany(() => Event, (event: Event) => event.type)
    events: Event[];

    /**
     * Functions
     */

    @BeforeInsert()
    setSlug() {
        this.slug = slugify(this.title);
    }
}
