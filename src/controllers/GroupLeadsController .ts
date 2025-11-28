import type { Handler } from "express";
import { prisma } from "src/database/index.js";
import { HttpError } from "src/errors/HttpError.js";
import { addLeadGroupRequestSchema } from "./schemas/GroupsResquestSchema.js";
import { connect } from "http2";
import { GetLeadsRequestSchema } from "./schemas/LeadRequestSchema.js";
import type { Prisma } from "@prisma/client";
import type { GroupsRespository } from "src/repositories/GroupsRepository.js";
import type { LeadsRepository, LeadWhereParams } from "src/repositories/LeadsRepository.js";


export class GroupLeadsController {
    constructor(
        private readonly groupsRepository: GroupsRespository,
        private readonly leadsRepository: LeadsRepository
    ) {

    }

    getLeads: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId);

            const query = GetLeadsRequestSchema.parse(req.query);

            const { page = '1', pageSize = '10', name, status, sortBy = 'name', order = 'asc' } = query;
            const limit = Number(pageSize);
            const offset = (Number(page) - 1) * limit

            const where: LeadWhereParams = { groupId }

            if (name) where.name = { like: name, mode: 'insensitive' };
            if (status) where.status = status;

            const leads = await this.leadsRepository.find({
                where,
                sortBy,
                order,
                limit,
                offset,
                includes: {groups: true}
            })

            const total = await this.leadsRepository.count(where)

            if (!leads) throw new HttpError(404, `Grupo não encontrado`);

            res.status(200).json({
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
            const groupId = Number(req.params.groupId);

            const { leadId } = addLeadGroupRequestSchema.parse(req.body)

            const addLead = await this.groupsRepository.addLead(groupId, leadId)

            res.status(201).json(addLead)

        } catch (error) {
            next(error)
        }

    }


    removeLead: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId);
            const leadId = Number(req.params.leadId);

            const updatedGroup = await this.groupsRepository.removeLead(groupId, leadId);

            if (!updatedGroup) throw new HttpError(404, `Grupo ou lead não encontrado`)

            return res.status(201).json(updatedGroup);

        } catch (error) {
            next(error)
        }

    }
}