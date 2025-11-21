import type { Handler } from "express";
import { prisma } from "src/database/index.js";
import { HttpError } from "src/errors/HttpError.js";
import { addLeadGroupRequestSchema } from "./schemas/GroupsResquestSchema.js";
import { connect } from "http2";
import { GetLeadsRequestSchema } from "./schemas/LeadRequestSchema.js";
import type { Prisma } from "@prisma/client";


export class GroupLeadsController {
    getLeads: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId);

            const query = GetLeadsRequestSchema.parse(req.query);

            const { page = '1', pageSize = '10', name, status, sortBy = 'name', order = 'asc' } = query;
            const pageNumber = Number(page);
            const pageSizeNumber = Number(pageSize);

            const where: Prisma.LeadWhereInput = {
                groups: {
                    some: {
                        id: groupId
                    }
                }
            }

            if (name) where.name = { contains: name, mode: 'insensitive' };
            if (status) where.status = status;

            const leads = await prisma.lead.findMany({
                where,
                orderBy: { [sortBy]: order },
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber,
                include: {
                    groups: true
                }
            });

            const total = await prisma.lead.count({ where })

            if (!leads) throw new HttpError(404, `Grupo não encontrado`);

            res.status(200).json({
                leads,
                meta: {
                    page: pageNumber,
                    pageSize: pageSizeNumber,
                    total,
                    totalPages: Math.ceil(total / pageSizeNumber)
                }
            })

        } catch (error) {
            next(error)
        }
    }

    addLead: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId);

            const body = addLeadGroupRequestSchema.parse(req.body)

            const addLead = await prisma.group.update({
                where: { id: groupId },
                data: {
                    leads: {
                        connect: {
                            id: body.leadId
                        }
                    }
                },
                include: { leads: true }
            })

            res.status(201).json(addLead)

        } catch (error) {
            next(error)
        }

    }


    removeLead: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId);
            const leadId = Number(req.params.leadId);

            const updatedGroup = await prisma.group.update({
                where: { id: groupId },
                data: {
                    leads: {
                        disconnect: {
                            id: leadId
                        }
                    }
                },
                include: {leads: true}
            })

            return res.status(201).json(updatedGroup);

        } catch (error) {
            next(error)
        }

    }
}