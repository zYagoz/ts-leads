import type { Handler } from "express";
import { prisma } from "src/database/index.js";
import type { Prisma } from "@prisma/client";

import { CreateCampaignResquestSchema, UpdateCampaignResquestSchema } from "./schemas/CampaignsResquestSchema.js";
import { HttpError } from "src/errors/HttpError.js";
import type { CampaignsRepository } from "src/repositories/CampaignsRepository.js";

export class CampaignsController {
    constructor(
        private readonly campaignsRepository: CampaignsRepository
    ) {

    }
    index: Handler = async (req, res, next) => {

        try {
            const campaigns = await this.campaignsRepository.find();

            res.json(campaigns)

        } catch (error) {
            next(error)
        }

    }

    create: Handler = async (req, res, next) => {

        try {
            const body = CreateCampaignResquestSchema.parse(req.body);
            // const cleanData: Prisma.CampaignCreateInput = JSON.parse(JSON.stringify(body));

            

            const createCampaign = await this.campaignsRepository.create(body);
            res.status(201).json(createCampaign)
        } catch (error) {
            next(error)
        }

    }
    show: Handler = async (req, res, next) => {

        try {
            const id = Number(req.params.id);

            const campaign = await this.campaignsRepository.findById(id)

            res.status(201).json(campaign)

        } catch (error) {
            next(error)
        }

    }
    update: Handler = async (req, res, next) => {

        try {
            const id = Number(req.params.id);
            const body = UpdateCampaignResquestSchema.parse(req.body);
            // const cleanData: Prisma.CampaignUpdateInput = JSON.parse(JSON.stringify(body));

            const updatedCampaign = await this.campaignsRepository.updateById(id, body)

            if(!updatedCampaign) throw new HttpError(404, `Campanha não encontrada`)

            res.status(201).json(updatedCampaign);
        } catch (error) {
            next(error)
        }

    }

    delete: Handler = async (req, res, next) => {

        try {
            const id = Number(req.params.id);
            const deletedCampaign = await this.campaignsRepository.deleteById(id);

            if (!deletedCampaign) throw new HttpError(404, `Campanha não encontrada`)

            res.status(201).json({ data: deletedCampaign })
        } catch (error) {
            next(error)
        }

    }
}