import type { Handler } from "express";
import { prisma } from '../database/index.js'
import { createLeadResquestSchema, GetLeadsRequestSchema, updateLeadRequest } from "./schemas/LeadRequestSchema.js";
import { HttpError } from "src/errors/HttpError.js";
import type { Prisma } from "@prisma/client";

export class LeadsController {
    index: Handler = async (req, res, next) => {
        try {
            const query = GetLeadsRequestSchema.parse(req.query);
            const {page = '1', pageSize = '10', name, status, sortBy = 'name', order = 'asc'} = query;
            const pageNumber = Number(page);
            const pageSizeNumber = Number(pageSize);

            const where: Prisma.LeadWhereInput = {}

            if(name) where.name = {contains: name, mode: "insensitive"};
            if(status) where.status = status;

            const leads = await prisma.lead.findMany({
                where,
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber,
                orderBy: {[sortBy] : order}
            })

            const total = await prisma.lead.count({where})

            res.json({
                data: leads,
                meta: {
                    page: pageNumber,
                    pageSize: pageSizeNumber,
                    total,
                    totalPages : Math.ceil(total / pageSizeNumber )
                }
            })
        } catch (error) {
            next(error)

        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = createLeadResquestSchema.parse(req.body)
            const cleanData: Prisma.LeadCreateInput = JSON.parse(JSON.stringify(body));
            
            const newLead = await prisma.lead.create({ data: cleanData });
            res.status(201).json(newLead)
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);

            const lead = await prisma.lead.findUnique({
                where: { id },
                include: {
                    groups: true,
                    campaigns: true
                }
            })

            if (!lead) throw new HttpError(404, "Lead não encontrado")

            res.json(lead)
        } catch (error) {
            next(error)
        }

    }

    update: Handler = async (req, res, next) => {
        try {
            const body = updateLeadRequest.parse(req.body);
            const id = Number(req.params.id);

            const leadExists = await prisma.lead.findUnique({ where: { id } });
            if (!leadExists) throw new HttpError(404, `Lead não encontrado`);

            const cleanData: Prisma.LeadUpdateInput = JSON.parse(JSON.stringify(body));

            const updatedLead = await prisma.lead.update({
                data: cleanData,
                where: { id }
            })

            res.status(201).json(updatedLead);

        } catch (error) {
            next(error)
        }

    }

    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const leadExists = await prisma.lead.findUnique({ where: { id } });
            if (!leadExists) throw new HttpError(404, `Lead não encontrado`);

            const deletedLead = await prisma.lead.delete({
                where: { id }
            });


            res.status(201).json({ message: `Lead excluído` })

        } catch (error) {
            next(error)
        }
    }
}