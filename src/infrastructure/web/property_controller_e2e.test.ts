import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyService } from "../../application/services/property_service";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import { PropertyController } from "./property_controller";
import { BookingEntity } from "../persistence/entities/booking_entity";
const app = express();
app.use(express.json());

let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

beforeAll(async () => {
    dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [PropertyEntity, UserEntity, BookingEntity],
        synchronize: true,
        logging: false,
    });

    await dataSource.initialize();

    propertyRepository = new TypeORMPropertyRepository(
        dataSource.getRepository(PropertyEntity)
    );

    propertyService = new PropertyService(propertyRepository);

    propertyController = new PropertyController(propertyService);

    app.post("/properties", (req, res, next) => {
        propertyController.createProperty(req, res).catch((err) => next(err));
    });

});

afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    await dataSource.destroy();
});

describe("UserController E2E", () => {
    beforeAll(async () => {
        const propertyRepo = dataSource.getRepository(PropertyEntity);

        await propertyRepo.clear();
    });


    it("deve criar uma propriedade com sucesso", async () => {
        const response = await request(app).post("/properties").send({
            name: "Nova Propriedade",
            description: "Descrição da nova propriedade",
            maxGuests: 4,
            pricePerNight: 150.00
        });

        const createdProperty = await propertyService.findPropertyById(response.body.id);

        expect(response.status).toBe(201);
        expect(response.body.name).toBe(createdProperty?.getName());
        expect(response.body.description).toBe(createdProperty?.getDescription());
        expect(response.body.maxGuests).toBe(createdProperty?.getMaxGuests());
        expect(response.body.pricePerNight).toBe(createdProperty?.getBasePricePerNight());

    });

    it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
        const response = await request(app).post("/properties").send({
            name: "",
            description: "Descrição da nova propriedade",
            maxGuests: 4,
            pricePerNight: 150.00
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O nome da propriedade é obrigatório.");
    });


    it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
        const response = await request(app).post("/properties").send({
            name: "Nova Propriedade",
            description: "Descrição da nova propriedade",
            maxGuests: 0,
            pricePerNight: 150.00
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("A capacidade máxima deve ser maior que zero.");
    });

    it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
        const response = await request(app).post("/properties").send({
            name: "Nova Propriedade",
            description: "Descrição da nova propriedade",
            maxGuests: 4,
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O preço base por noite é obrigatório.");
    });
});