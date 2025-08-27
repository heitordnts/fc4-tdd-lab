import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyEntity } from "../entities/property_entity";
import { UserEntity } from "../entities/user_entity";
import { PropertyMapper } from "./property_mapper";

describe('PropertyMapper', () => {

    it('deve converter PropertyEntity em Property corretamente', () => {
        const ORMproperty = new PropertyEntity();
        ORMproperty.bookings = [];
        ORMproperty.id = '1';
        ORMproperty.name = 'Casa na Praia';
        ORMproperty.description = 'Vista para o mar';
        ORMproperty.maxGuests = 6;
        ORMproperty.basePricePerNight = 200;

        const domainEntity = PropertyMapper.toDomain(ORMproperty);

        expect(domainEntity.getId()).toBe(ORMproperty.id);
        expect(domainEntity.getName()).toBe(ORMproperty.name);
        expect(domainEntity.getDescription()).toBe(ORMproperty.description);
        expect(domainEntity.getMaxGuests()).toBe(ORMproperty.maxGuests);
        expect(domainEntity.getBasePricePerNight()).toBe(ORMproperty.basePricePerNight);
    });

    it('deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity', () => {
        const ORMproperty = new PropertyEntity();
        ORMproperty.bookings = [];
        ORMproperty.id = '1';
        ORMproperty.name = ''; 
        ORMproperty.description = 'Vista para o mar';
        ORMproperty.maxGuests = 6;
        ORMproperty.basePricePerNight = 200;

        expect(() => {
            PropertyMapper.toDomain(ORMproperty);
        }).toThrow("O nome é obrigatório");
    });

    it('deve converter Property para PropertyEntity corretamente', () => {
        const domainEntity = new Property(
            '1',
            'Casa na Praia',
            'Vista para o mar',
            6,
            200
        );

        const ORMEntity = PropertyMapper.toPersistence(domainEntity);

        expect(ORMEntity.id).toBe(domainEntity.getId());
        expect(ORMEntity.name).toBe(domainEntity.getName());
        expect(ORMEntity.description).toBe(domainEntity.getDescription());
        expect(ORMEntity.maxGuests).toBe(domainEntity.getMaxGuests());
        expect(ORMEntity.basePricePerNight).toBe(domainEntity.getBasePricePerNight());
    });

})