import type { Handler } from "express";
// import { prisma } from "../database/index.js";
import { CreateGroupResquestSchema, updateGroupResquestSchema } from "./schemas/GroupsResquestSchema.js";
import { HttpError } from "src/errors/HttpError.js";
import type { Prisma } from "@prisma/client";
import type { GroupsRespository } from "src/repositories/GroupsRepository.js";

export class GroupsController {

    constructor(private readonly groupsRepository: GroupsRespository){

    }

    index: Handler = async (req, res, next) => {
        try {

            const groups = await this.groupsRepository.find();
            res.json(groups);

        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = CreateGroupResquestSchema.parse(req.body);

            const newGroup = await this.groupsRepository.create(body);
            res.status(201).json(newGroup)
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const group = await this.groupsRepository.findById(Number(req.params.id))

            if (!group) throw new HttpError(404, `group not found`);

            res.status(201).json(group)


        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {

            const id = Number(req.params.id);
            const body = updateGroupResquestSchema.parse(req.body);
            // const cleanData: Prisma.GroupUpdateInput = JSON.parse(JSON.stringify(body));

            const updateGroup = await this.groupsRepository.updateById(id, body)
            
            if (!updateGroup) throw new HttpError(404, "Grupo não encontrado");
            
            res.json(updateGroup )

        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try {

            const id = Number(req.params.id);
            const deletedGroup = await this.groupsRepository.deleteById(id)
            
            if (!deletedGroup) throw new HttpError(404, "Grupo não encontrado");

            res.status(201).json({ deletedGroup })
        } catch (error) {
            next(error)
        }
    }
}