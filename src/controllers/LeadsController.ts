import type { Handler } from "express";
import { prisma } from '../database/index.js'
import { createLeadResquestSchema, GetLeadsRequestSchema, updateLeadRequest } from "./schemas/LeadRequestSchema.js";
import { HttpError } from "src/errors/HttpError.js";
import type { Prisma } from "@prisma/client";
import type { LeadsRepository, LeadWhereParams } from "src/repositories/LeadsRepository.js";

export class LeadsController {
    private leadsRepository: LeadsRepository

    constructor(leadsRepository: LeadsRepository) {
        this.leadsRepository = leadsRepository;
    }

    index: Handler = async (req, res, next) => {
        try {
            const query = GetLeadsRequestSchema.parse(req.query);
            const { page = '1', pageSize = '10', name, status, sortBy = 'name', order = 'asc' } = query;
            const limit = Number(pageSize);
            const offset = (Number(page) - 1) * limit

            const where: LeadWhereParams = {}

            if (name) where.name = { like: name, mode: "insensitive" };
            if (status) where.status = status;

            const leads = await this.leadsRepository.find({
                where,
                sortBy,
                order,
                limit,
                offset
            })

            const total = await this.leadsRepository.count(where)

            // const leads = await prisma.lead.findMany({
            //     where,
            //     skip: (pageNumber - 1) * pageSizeNumber,
            //     take: pageSizeNumber,
            //     orderBy: {[sortBy] : order}
            // })

            // const total = await prisma.lead.count({where})

            res.json({
                data: leads,
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

    create: Handler = async (req, res, next) => {
        try {
            const body = createLeadResquestSchema.parse(req.body)

            if (!body.status) body.status = 'New'

            const cleanData: Prisma.LeadCreateInput = JSON.parse(JSON.stringify(body));

            const newLead = await this.leadsRepository.create(cleanData)

            // const newLead = await prisma.lead.create({ data: cleanData });
            res.status(201).json(newLead)
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);

            const lead = await this.leadsRepository.findById(id)

            // const lead = await prisma.lead.findUnique({
            //     where: { id },
            //     include: {
            //         groups: true,
            //         campaigns: true
            //     }
            // })

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

            const lead = await this.leadsRepository.findById(id);
            // const lead = await prisma.lead.findUnique({ where: { id } });
            if (!lead) throw new HttpError(404, `Lead não encontrado`);

            if (lead.status === 'New' && body.status !== undefined && body.status !== "Contact") {
                throw new HttpError(400, "Um novo lead deve ser contatado antes de alterar para outros valores")
            }

            if (body.status && body.status === 'Archived') {
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - lead.updatedAt.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays < 180) throw new HttpError(400, `Um lead só pode ser arquivado após 6 meses de inatividade`)
            }


            const updates = Object.fromEntries(
                Object.entries(body).filter(([_, value]) => value !== undefined)
            );


            const updatedLead = this.leadsRepository.updateById(id, updates)

            // const cleanData: Prisma.LeadUpdateInput = JSON.parse(JSON.stringify(body));

            // const updatedLead = await prisma.lead.update({
            //     data: cleanData,
            //     where: { id }
            // })

            res.status(201).json(updatedLead);

        } catch (error) {
            next(error)
        }

    }

    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            // const leadExists = await prisma.lead.findUnique({ where: { id } });
            const leadExists = await this.leadsRepository.findById(id)
            if (!leadExists) throw new HttpError(404, `Lead não encontrado`);

            const deletedLead = await this.leadsRepository.deleteById(id)

            // const deletedLead = await prisma.lead.delete({
            //     where: { id }
            // });


            res.status(201).json({ message: `Lead excluído` })

        } catch (error) {
            next(error)
        }
    }
}