import { faker } from "@faker-js/faker/locale/pl";
import slugify from "src/helpers";
import { EventType } from "../modules/event/entities/event-type.entity";
import { Event } from "../modules/event/entities/event.entity";
import { Invite } from "../modules/invite/entities/invite.entity";
import { User } from "../modules/user/entities/user.entity";
import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedDatabase1678440431391 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        /**
         * Users
         */

        let users = [];

        const adminUser = {
            email: 'trykoszkom@gmail.com',
            password: 'Qweasd123!',
            first_name: 'Admin',
            last_name: 'Adminski',
            gender: 'm',
            birthdate: faker.date.birthdate(),
            location_city: 'Białystok',
            location_country: 'Poland',
            bio: faker.random.words(15),
            avatar_url: faker.image.avatar(),
            social_url_instagram: 'https://instagram.com/p/' + slugify(faker.random.words(3)),
            social_url_facebook: 'https://facebook.com/p/' + slugify(faker.random.words(2)),
            permissions: 9,
            is_active: true,
            terms_accepted: true,
        };

        users.push(adminUser);

        const realFacebookUser = {
            email: 'traszka@techie.com',
            password: faker.datatype.string(32),
            first_name: 'Michał',
            last_name: 'Trykoszko',
            gender: 'm',
            birthdate: faker.date.birthdate(),
            location_city: 'Białystok',
            location_country: 'Poland',
            bio: faker.random.words(15),
            avatar_url: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=5312931598810660&height=100&width=100&ext=1673363097&hash=AeST0CtdN6V_BxHBRIM',
            social_url_facebook: 'https://www.facebook.com/michal88888/',
            permissions: 1,
            is_active: true,
            terms_accepted: true,
            facebook_user_id: '5312931598810660',
        };

        users.push(realFacebookUser);

        const regularUser = {
            email: 'regular@user.xc',
            password: 'Qweasd123!',
            first_name: 'Regular',
            last_name: 'User',
            gender: 'm',
            birthdate: faker.date.birthdate(),
            location_city: 'Białystok',
            location_country: 'Poland',
            bio: faker.random.words(15),
            avatar_url: faker.image.avatar(),
            social_url_instagram: 'https://instagram.com/p/' + slugify(faker.random.words(3)),
            social_url_facebook: 'https://facebook.com/p/' + slugify(faker.random.words(2)),
            permissions: 1,
            is_active: true,
            terms_accepted: true,
        };

        users.push(regularUser);

        for (let i = 0; i < 80; i++) {
            users.push({
                email: faker.internet.email().toLowerCase().replace(/ /g,''),
                password: faker.internet.password(),
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                gender: i % 2 === 0 ? 'm' : 'f',
                birthdate: faker.date.birthdate(),
                location_city: 'Białystok',
                location_country: 'Poland',
                bio: faker.random.words(15),
                avatar_url: faker.image.avatar(),
                social_url_instagram: 'https://instagram.com/p/' + slugify(faker.random.words(3)),
                social_url_facebook: 'https://facebook.com/p/' + slugify(faker.random.words(2)),
                permissions: 1,
                is_active: true,
                terms_accepted: true,
            });
        }

        for (const userData of users) {
            const user: User = new User();
            for (const [key, value] of Object.entries(userData)) {
                user[key] = value;
            }
            await queryRunner.manager.save(user);
        }

        const allUsers: User[] = await queryRunner.manager.find(User);        

        /**
         * EventTypes
         */
        const eventTypes: any[] = [
            {
                name: 'Impreza',
                icon: 'team',
                color: 'fuchsia'
            },
            {
                name: 'Sport',
                icon: 'Trophy',
                color: 'violet'
            },
            {
                name: 'Hobby',
                icon: 'car',
                color: 'orange'
            },
            {
                name: 'Relaks',
                icon: 'rest',
                color: 'indigo'
            }
        ];

        for (const eventTypeObj of eventTypes) {
            const eventType: EventType = new EventType();
            eventType.title = eventTypeObj.name;
            eventType.icon = eventTypeObj.icon;
            eventType.color = eventTypeObj.color;

            await queryRunner.manager.save(eventType);
        }

        const allEventTypes: EventType[] = await queryRunner.manager.find(EventType);

        /**
         * Events
         */

        let events = [];

        for (let i = 0; i < 15; i++) {
            events.push({
                title: faker.random.words(5),
                location_city: 'Białystok',
                location_country: 'Polska',
                description: faker.random.words(15),
                slots: faker.datatype.number({min: 2, max: 100}),
                date_time: faker.date.future(),
                duration: faker.datatype.number({min: 30, max: 480}),
                background_image_url: faker.image.avatar(),
                is_open: i % 3 === 0,
                is_address_visible: i % 2 === 0,
                is_userlist_visible: i % 3 === 1,
                is_allowed_to_join_when_in_progress: i % 2 === 1,
                type: allEventTypes[faker.datatype.number({min: 0, max: allEventTypes.length - 1})],
                owner: i === 0 ? 1 : allUsers[faker.datatype.number({min: 0, max: allUsers.length - 1})],
            });
        }
 
        let i = 1;
        for (const eventData of events) {
            const event: Event = new Event();
            for (const [key, value] of Object.entries(eventData)) {
                event[key] = value;
            }

            await queryRunner.manager.save(event);

            if (i >= 5) {
                continue;
            }

            const ownerIndex = allUsers.findIndex(item => item.uuid === eventData.owner.uuid);

            const allowedUsers = [...allUsers];
            allowedUsers.splice(ownerIndex, 1);

            event.users_joined = [
                allowedUsers[0 + i],
                allowedUsers[10 + i],
            ];
            event.users_pending = [
                allowedUsers[20 + i],
                allowedUsers[30 + i],
            ];
            event.users_rejected = [
                allowedUsers[40 + i],
                allowedUsers[50 + i],
            ];
            event.users_removed = [
                allowedUsers[60 + i],
                allowedUsers[70 + i],
            ];

            await queryRunner.manager.save(event);

            i++;
        }

        const allEvents: Event[] = await queryRunner.manager.find(Event);

        /**
         * Invites
         */

        for (let i = 0; i < 5; i++) {
            const invite: Invite = new Invite();
            invite.owner = faker.helpers.arrayElement(allUsers);
            invite.event = faker.helpers.arrayElement(allEvents);
            invite.message = faker.random.words(15);
            await queryRunner.manager.save(invite);
        }

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
