import { CreateUserDTO } from "../../application/dtos/create_user_dto";
import { UserService } from "../../application/services/user_service";
import { Request, Response } from "express";


export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async createUser(req: Request, res: Response): Promise<Response> {
        if(req.body.name === undefined || req.body.name.trim() === "") {
            return res.status(400).json({ message: "O campo nome é obrigatório." });
        }

        const dto: CreateUserDTO = {
            name: req.body.name,
        };

        const createdUser = await this.userService.createUser({ name: req.body.name });

        return res.status(201).json(createdUser);
    }
}