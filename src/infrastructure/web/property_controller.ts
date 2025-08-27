import { CreatePropertyDTO } from "../../application/dtos/create_property_dto";
import { PropertyService } from "../../application/services/property_service";
import { Request, Response } from "express";

export class PropertyController {
    private propertyService: PropertyService;

    constructor(propertyService: PropertyService) {
        this.propertyService = propertyService;
    }

    async createProperty(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.body.name || req.body.name.trim() === "") {
                return res.status(400).json({ message: "O nome da propriedade é obrigatório." });
            }

            if (req.body.maxGuests <= 0) {
                return res.status(400).json({ message: "A capacidade máxima deve ser maior que zero." });
            }

            if (!req.body.pricePerNight) {
                return res.status(400).json({ message: "O preço base por noite é obrigatório." });
            }

            const dto: CreatePropertyDTO = {
                name: req.body.name,
                description: req.body.description,
                maxGuests: req.body.maxGuests,
                pricePerNight: req.body.pricePerNight,
            };

            const property = await this.propertyService.createProperty(dto);

            return res.status(201).json({
                id: property.getId(),
                name: property.getName(),
                description: property.getDescription(),
                maxGuests: property.getMaxGuests(),
                pricePerNight: property.getBasePricePerNight(),
            });
        } catch (error: any) {
            return res.status(400).json({ message: error.message || "An unexpected error occurred" });
        }
    }
}