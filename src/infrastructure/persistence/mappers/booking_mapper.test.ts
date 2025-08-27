import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { User } from "../../../domain/entities/user";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyEntity } from "../entities/property_entity";
import { UserEntity } from "../entities/user_entity";
import { BookingMapper } from "./booking_mapper";

describe("BookingMapper", () => {

    it("deve converter BookingEntity em Booking corretamente", () => {
        const ORMUser = {
            id: '1',
            name: 'João Silva',
        } as UserEntity;

        const ORMproperty = {
            id: '1',
            name: 'Casa na Praia',
            description: 'Vista para o mar',
            maxGuests: 6,
            basePricePerNight: 200,
        } as PropertyEntity;

        const ORMBooking = new BookingEntity();
        ORMBooking.id = '1';
        ORMBooking.startDate = new Date('2023-10-01');
        ORMBooking.endDate = new Date('2023-10-05');
        ORMBooking.guestCount = 2;
        ORMBooking.totalPrice = 800;
        ORMBooking.status = 'CONFIRMED';
        ORMBooking.guest = ORMUser;
        ORMBooking.property = ORMproperty;

        const domainEntity = BookingMapper.toDomain(ORMBooking);

        expect(domainEntity.getId()).toBe(ORMBooking.id);
        expect(domainEntity.getDateRange().getStartDate()).toEqual(ORMBooking.startDate);
        expect(domainEntity.getDateRange().getEndDate()).toEqual(ORMBooking.endDate);
        expect(domainEntity.getGuestCount()).toBe(ORMBooking.guestCount);
        expect(domainEntity.getTotalPrice()).toBe(ORMBooking.totalPrice);
        expect(domainEntity.getStatus()).toBe(ORMBooking.status);
    });

    it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
        //aparentemente o dominio, principalmente de Booking, não tem muitas validações
        const ORMuser = {
            id: '1',
            name: 'João Silva',
        } as UserEntity;

        const ORMbooking = new BookingEntity();
        ORMbooking.startDate = new Date("2024-12-20");
        ORMbooking.endDate = new Date("2024-12-25");
        ORMbooking.guestCount = 4;
        ORMbooking.totalPrice = 1000;
        ORMbooking.status = 'CONFIRMED';
        ORMbooking.guest = ORMuser;
        ORMbooking.property = {} as PropertyEntity;

        expect(() => {
            BookingMapper.toDomain(ORMbooking);
        }).toThrow("O nome é obrigatório");

    });

    it("deve converter Booking para BookingEntity corretamente", () => {
        const domainUser = new User('1', 'João Silva');
        const domainProperty = new Property('1', 'Casa na Praia', 'Vista para o mar', 6, 200);
        const domainDateRange = new DateRange(new Date("2024-12-20"), new Date("2024-12-25"));

        const domainEntity = new Booking(
            '1',
            new Property(
                '1',
                'Casa na Praia',
                'Vista para o mar',
                6,
                200
            ),
            domainUser,
            domainDateRange,
            4
        );

        domainEntity["totalPrice"] = 1000;
        domainEntity["status"] = 'CONFIRMED';

        const ORMEntity = BookingMapper.toPersistence(domainEntity);

        expect(ORMEntity.id).toBe(domainEntity.getId());
        expect(ORMEntity.startDate).toEqual(domainEntity.getDateRange().getStartDate());
        expect(ORMEntity.endDate).toEqual(domainEntity.getDateRange().getEndDate());
        expect(ORMEntity.guestCount).toBe(domainEntity.getGuestCount());
        expect(ORMEntity.totalPrice).toBe(domainEntity.getTotalPrice());
        expect(ORMEntity.status).toBe(domainEntity.getStatus());

    });
});
