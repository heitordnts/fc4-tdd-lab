import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";
import { v4 as uuidv4 } from "uuid";
import { CreatePropertyDTO } from "../dtos/create_property_dto";

export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) { }

  async findPropertyById(id: string): Promise<Property | null> {
    return this.propertyRepository.findById(id);
  }


  async createProperty(dto: CreatePropertyDTO): Promise<Property> {
    const newProperty = new Property(
      uuidv4(),
      dto.name,
      dto.description,
      dto.maxGuests,
      dto.pricePerNight
    );
    await this.propertyRepository.save(newProperty);
    return newProperty;
  }
}
