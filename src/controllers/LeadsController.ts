import type { Handler } from "express";
import { prisma } from '../database/index.js'
import { createLeadResquestSchema, GetLeadsRequestSchema, updateLeadRequest } from "./schemas/LeadRequestSchema.js";
import { HttpError } from "src/errors/HttpError.js";
import type { Prisma } from "@prisma/client";
import type { LeadsRepository, LeadWhereParams } from "src/repositories/LeadsRepository.js";
import type { LeadService } from "src/services/LeadsService.js";

export class LeadsController {

    constructor(private readonly leadService: LeadService) { }

    index: Handler = async (req, res, next) => {
        try {
            const query = GetLeadsRequestSchema.parse(req.query);
            const { page = '1', pageSize = '10', name, status, sortBy = 'name', order = 'asc' } = query;

            const result = await this.leadService.getAllLeadsPaginated({
                name,
                status,
                page: Number(page),
                pageSize: Number(pageSize),
                sortBy,
                order
            })

            res.json(res);
        } catch (error) {
            next(error)

        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = createLeadResquestSchema.parse(req.body)
            const newLead = await this.leadService.createLead(body)
            res.status(201).json(newLead)
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const lead = this.leadService.getLeadById(Number(req.params.id))
            res.json(lead)
        } catch (error) {
            next(error)
        }

    }

    update: Handler = async (req, res, next) => {
        try {
            const body = updateLeadRequest.parse(req.body);
            const id = Number(req.params.id);

            const updates = Object.fromEntries(
                Object.entries(body).filter(([_, value]) => value !== undefined)
            );

            const updatedLead = this.leadService.updateLead(id, updates)

            res.status(201).json(updatedLead);

        } catch (error) {
            next(error)
        }

    }

    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const deletedLead = await this.leadService.deleteLead(id)

            res.status(201).json({ message: `Lead excluído` })
        } catch (error) {
            next(error)
        }
    }
}