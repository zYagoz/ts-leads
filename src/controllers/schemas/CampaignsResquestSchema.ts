import { LeadCampaignStatus } from "@prisma/client";
import z from "zod";

export const CreateCampaignResquestSchema = z.object({
    name: z.string(),
    description: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional()
})

export const UpdateCampaignResquestSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional()
})

const LeadCampaignStatusSchema = z.enum([
    'New',
    'Engaged',
    'FollowUp_Schedule',
    'Contacted',
    'Qualified',
    'Converted',
    'Unresponsive',
    'Disqualified',
    'Re_engaged',
    'Opted_Out',
])

export const GetCampaignLeadResquestSchema = z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    name: z.string().optional(),
    status: LeadCampaignStatusSchema.optional(),
    sortBy: z.enum(["name", "createdAt"]).optional(),
    order: z.enum(["asc", "desc"]).optional()
})

export const AddLeadResquestSchema = z.object({
    leadId: z.coerce.number(),
    campaignId: z.coerce.number(),
    status: LeadCampaignStatusSchema
})

export const UpdateLeadStatusRequestSchema = z.object({
    status: LeadCampaignStatusSchema
})