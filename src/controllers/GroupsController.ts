import type { Handler } from "express";
import { prisma } from "../database/index.js";
import { CreateGroupResquestSchema, updateGroupResquestSchema } from "./schemas/GroupsResquestSchema.js";
import { HttpError } from "src/errors/HttpError.js";
import type { Prisma } from "@prisma/client";

export class GroupsController {
    index: Handler = async (req, res, next) => {
        try {

            const groups = await prisma.group.findMany();
            res.json(groups);

        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = CreateGroupResquestSchema.parse(req.body);

            const newGroup = await prisma.group.create({ data: body });
            res.status(201).json(newGroup)
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const group = await prisma.group.findUnique({
                where: { id: Number(req.params.id) },
                include: { leads: true }
            });

            if (!group) throw new HttpError(404, `group not found`);

            res.status(201).json(group)


        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {

            const id = Number(req.params.id);
            const groupExists = await prisma.group.findUnique({ where: { id } });
            if (!groupExists) throw new HttpError(404, "Grupo não encontrado");

            const body = updateGroupResquestSchema.parse(req.body);
            const cleanData: Prisma.GroupUpdateInput = JSON.parse(JSON.stringify(body));

            const updateGroup = await prisma.group.update({
                data: cleanData,
                where: {id}
            });

            res.json(updateGroup )

        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try {

            const id = Number(req.params.id);
            const groupExists = await prisma.group.findUnique({ where: { id } });
            if (!groupExists) throw new HttpError(404, "Grupo não encontrado");

            const deletedGroup = await prisma.group.delete({ where: { id } });


            res.status(201).json({ deletedGroup })
        } catch (error) {
            next(error)
        }
    }
}