import type { Handler } from "express";
import { prisma } from "src/database/index.js";
import type { Prisma } from "@prisma/client";

import { CreateCampaignResquestSchema, UpdateCampaignResquestSchema } from "./schemas/CampaignsResquestSchema.js";
import { HttpError } from "src/errors/HttpError.js";

export class CampaignsController {
    index: Handler = async (req, res, next) => {

        try {
            const campaigns = await prisma.campaign.findMany();

            res.json(campaigns)

        } catch (error) {
            next(error)
        }

    }

    create: Handler = async (req, res, next) => {

        try {
            const body = CreateCampaignResquestSchema.parse(req.body);
            const cleanData: Prisma.CampaignCreateInput = JSON.parse(JSON.stringify(body));
            
            const createCampaign = await prisma.campaign.create({data: cleanData});
            res.status(201).json(createCampaign)
        } catch (error) {
            next(error)
        }
        
    }
    show: Handler = async (req, res, next) => {
        
        try {
            const id = Number(req.params.id);
            
            const campaign = await prisma.campaign.findUnique({
                where: {id},
                include: {leads: true}
            })
            
            res.status(201).json(campaign)
            
        } catch (error) {
            next(error)
        }
        
    }
    update: Handler = async (req, res, next) => {
        
        try {
            
            const body = UpdateCampaignResquestSchema.parse(req.body);
            const cleanData: Prisma.CampaignUpdateInput = JSON.parse(JSON.stringify(body));

            const id = Number(req.params.id);

            const updatedCampaign = await prisma.campaign.update({
                data: cleanData,
                where: {id}
            })

            res.status(201).json(updatedCampaign);
        } catch (error) {
            next(error)
        }

    }

    delete: Handler = async (req, res, next) => {

        try {

            const id = Number(req.params.id);

            const campaingExist = await prisma.campaign.findUnique({where: {id}});
            if(!campaingExist) throw new HttpError(404, `Campanha não encontrada`)

            const deletedCampaign = await prisma.campaign.delete({where: {id}});

            res.status(201).json({data: deletedCampaign})
            
        } catch (error) {
            next(error)
        }

    }
}