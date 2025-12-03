import type { Handler } from "express";
import type { Prisma } from "@prisma/client";
import { AddLeadResquestSchema, GetCampaignLeadResquestSchema, UpdateLeadStatusRequestSchema } from "./schemas/CampaignsResquestSchema.js";
import { prisma } from "src/database/index.js";
import type { CampaignLeadsRepository, CampaingLeasdWhereParams } from "src/repositories/CampaignsLeadsRepository.js";
import { HttpError } from "src/errors/HttpError.js";
import type { LeadsRepository, LeadWhereParams } from "src/repositories/LeadsRepository.js";

export class CampaignLeadsController {
    constructor(
        private readonly campaignLeadsRepository: CampaignLeadsRepository,
        private readonly leadsRepository: LeadsRepository

    ) {
    }

    getLeads: Handler = async (req, res, next) => {
        try {
            const campaignId = Number(req.params.campaignId);
            const query = GetCampaignLeadResquestSchema.parse(req.query);
            const { page = '1', pageSize = '10', name, status, sortBy = 'name', order = 'asc' } = query;

            const limit = Number(pageSize);
            const offset = (Number(page) - 1) * limit

            const where: LeadWhereParams = { campaignId, campaignStatus: status }

            if (name) where.name = { like: name, mode: "insensitive" };

            const leads = await this.leadsRepository.find({
                where,
                sortBy,
                order,
                limit,
                offset
            })

            const total = await this.leadsRepository.count(where);

            res.status(201).json({
                leads,
                meta: {
                    page: Number(page),
                    pageSize: limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            })

        } catch (error) {
            next(error)
        }
    }

    addLead: Handler = async (req, res, next) => {
        try {
            const campaignId = Number(req.params.campaignId);
            const { leadId, status = 'New' } = AddLeadResquestSchema.parse(req.body);

            const addedLead = await this.campaignLeadsRepository.addLeadById({ campaignId, leadId, status });

            if (!addedLead) throw new HttpError(404, "Não foi possível adicionar o lead");

            res.status(201).end()

        } catch (error) {
            next(error)
        }
    }

    updateLeadStatus: Handler = async (req, res, next) => {
        try {
            const campaignId = Number(req.params.campaignId);
            const leadId = Number(req.params.leadId);
            const { status } = AddLeadResquestSchema.parse(req.body);

            const udpatedLeadCampaing = await this.campaignLeadsRepository.updateLeadStatusById({ campaignId, leadId, status });

            if (!udpatedLeadCampaing) throw new HttpError(404, "Não foi possível atualizar o lead");

            res.status(204).json({ message: `Status do lead atualizado` })

        } catch (error) {
            next(error)
        }
    }

    removeLead: Handler = async (req, res, next) => {
        try {

            const leadId = Number(req.params.leadId);
            const campaignId = Number(req.params.campaignId);

            const removedLead = await this.campaignLeadsRepository.removeLeadById(leadId, campaignId);

            if (!removedLead) throw new HttpError(404, "Não foi possível remover  o lead");

            res.status(201).json({ removedLead })

        } catch (error) {
            next(error)
        }
    }
}