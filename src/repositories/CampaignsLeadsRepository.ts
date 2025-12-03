import type { Lead, LeadCampaign } from "@prisma/client";

export type LeadCampaignStatus = 'New' | 'Engaged' | 'FollowUp_Schedule' | 'Contacted' | 'Qualified' | 'Converted' |
    'Unresponsive' | 'Disqualified' | 'Re_engaged' | 'Opted_Out';

export interface CampaingLeasdWhereParams {
    name?: {
        like?: string,
        equals?: string,
        mode?: "default" | "insensitive"
    }
    status?: {
        some?: {
            status?: LeadCampaignStatus
        }
    }
    campaings?: {
        some?: number 
    }
}

export interface campaignLeadsSelectParams {
    campaigns?: {
        select?: {
            campaignId?: boolean,
            leadId?: boolean,
            status?: boolean
        }
    }
}

export interface FindCampaignLeadsParams {
    where?: CampaingLeasdWhereParams
    sortBy?: "name" | 'status' | 'createdAt'
    order?: 'asc' | 'desc'
    limit?: number
    offset?: number
    includes?: campaignLeadsSelectParams
}

export interface CreateLeadCampaignAttributes {
    status?: LeadCampaignStatus
}

export interface AddLeadToCampaignAttributes{
    campaignId: number
    leadId: number
    status: LeadCampaignStatus
}

export interface CampaignLeadsRepository {
    findLeads: (params : FindCampaignLeadsParams) => Promise<Lead[]>
    count: (where: Partial<CampaingLeasdWhereParams>) => Promise<number>
    addLeadById: (attributes: AddLeadToCampaignAttributes) => Promise<LeadCampaign>
    updateLeadStatusById: (attributes: AddLeadToCampaignAttributes) => Promise<LeadCampaign | null>
    removeLeadById: (leadId: number, campaignId: number) => Promise<LeadCampaign | null>
}