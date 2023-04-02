import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {EventType} from "../entities/event-type.entity";

@Injectable()
export class EventTypeService {

    constructor(
        @InjectRepository(EventType)
        private eventTypeRepository: Repository<EventType>,
    ) {
    }

    async findAll(): Promise<EventType[]> {
        return this.eventTypeRepository.find();
    }

}
