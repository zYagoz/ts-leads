import type { LeadCampaign, Lead } from "@prisma/client";
import type { CampaignLeadsRepository, CampaingLeasdWhereParams, CreateLeadCampaignAttributes, FindCampaignLeadsParams, LeadCampaignStatus } from "../CampaignsLeadsRepository.js";
import { prisma } from "src/database/index.js";

export class PrismaCampaignLeadsRepositoy implements CampaignLeadsRepository {
    findLeads(params: FindCampaignLeadsParams): Promise<Lead[]> {
        return prisma.lead.findMany({
            where: {
                name: {
                    contains: params.where?.name?.like,
                    equals: params.where?.name?.equals,
                    mode: params.where?.name?.mode
                },
                status: params.where?.status as any,
                campaigns: {
                    some: params.where?.campaings?.some as any
                }
            },
            orderBy: { [params.sortBy ?? "name"]: params.order },
            skip: params.offset,
            take: params.limit,
            include: {
                campaigns: {
                    select: {
                        campaignId: true,
                        leadId: true,
                        status: true
                    }
                }
            }
        })
    }

    count(where: Partial<CampaingLeasdWhereParams>): Promise<number> {
        return prisma.lead.count({
            where: {
                campaigns: {
                    some: where?.campaings?.some as any
                },
                name: {
                    contains: where?.name?.like,
                    equals: where?.name?.equals,
                    mode: where?.name?.mode
                },
                status: where?.status as any
            }
        })

    }

    addLeadById(leadId: number, campaignId: number, status?: LeadCampaignStatus): Promise<LeadCampaign> {
        return prisma.leadCampaign.create({
            data: {
                campaignId,
                leadId,
                status
            }
        })

    }

    updateLeadStatusById(leadId: number, campaignId: number, attributes: CreateLeadCampaignAttributes): Promise<LeadCampaign | null> {
        return prisma.leadCampaign.update({
            data: attributes,
            where: {
                leadId_campaignId: {
                    leadId,
                    campaignId
                }
            }
        })

    }

    removeLeadById(leadId: number, campaignId: number): Promise<LeadCampaign | null> {
        return prisma.leadCampaign.delete({
            where: {
                leadId_campaignId: {
                    leadId,
                    campaignId
                }
            }
        })

    }

}