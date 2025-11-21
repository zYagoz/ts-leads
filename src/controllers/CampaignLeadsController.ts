import type { Handler } from "express";
import type { Prisma } from "@prisma/client";
import { AddLeadResquestSchema, GetCampaignLeadResquestSchema, UpdateLeadStatusRequestSchema } from "./schemas/CampaignsResquestSchema.js";
import { prisma } from "src/database/index.js";

export class CampaignLeadsController{
    getLeads: Handler = async (req,res, next) => {
        try {
            const campaignId = Number(req.params.campaignId);
            const query = GetCampaignLeadResquestSchema.parse(req.body);

            const {page = '1', pageSize = '10', name, status, sortBy = 'name', order = 'asc'} = query;

            const pageNumber = Number(page);
            const pageSizeNumber = Number(pageSize);

            const where: Prisma.LeadWhereInput = {
                campaigns: {
                    some: {campaignId}
                }
            }

            if(name) where.name = {contains: name, mode: "insensitive"};
            if(status) where.campaigns = { some: {status}}

            const leads = await prisma.lead.findMany({
                where,
                orderBy: {[sortBy]: order},
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageNumber,
                include: {
                    campaigns: {
                        select: {
                            campaignId: true,
                            leadId: true,
                            status: true
                        }
                    }
                }
            });

            const total = await prisma.lead.count({where});

            res.status(201).json({
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

    addLead: Handler = async (req,res, next) => {
        try {
            const body = AddLeadResquestSchema.parse(req.body);

            // const cleanData: Prisma.LeadCampaignCreateInput = JSON.parse(JSON.stringify(body));

            await prisma.leadCampaign.create({
                data: {
                    campaignId: Number(req.params.campaignId),
                    leadId: body.leadId,
                    status: body.status
                }
            })
            
            res.status(201).end()

        } catch (error) {
           next(error) 
        }
    }

    updateLeadStatus: Handler = async (req,res, next) => {
        try {
            const body = UpdateLeadStatusRequestSchema.parse(req.body);

            const udpatedLeadCampaing = await prisma.leadCampaign.update({
                data: body,
                where: {
                    leadId_campaignId: {
                        leadId: Number(req.params.leadId),
                        campaignId: Number(req.params.campaignId)
                    }
                }
            })

            res.status(201).json(udpatedLeadCampaing)

        } catch (error) {
           next(error) 
        }
    }

    removeLead: Handler = async (req,res, next) => {
        try {

            const removedLead = await prisma.leadCampaign.delete({
                where: {
                    leadId_campaignId:{
                        campaignId: Number(req.params.campaignId),
                        leadId: Number(req.params.leadId)
                    }
                }
            })

            res.status(201).json({removedLead})
            
        } catch (error) {
           next(error) 
        }
    }
}