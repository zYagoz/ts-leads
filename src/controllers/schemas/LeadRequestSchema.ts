import z, { email } from "zod";

const LeadStatusSchema = z.enum([
    'New',
    'Contact',
    'Qualified',
    'Converted',
    'Unresponsive',
    'Disqualified',
    'Archived'
]);

export const GetLeadsRequestSchema = z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    name: z.string().optional(),
    status: LeadStatusSchema.optional(),
    sortBy: z.enum(["name", "status", "createdAt"]).optional(),
    order: z.enum(["asc", "desc"]).optional()

})

export const createLeadResquestSchema = z.object({
    name: z.string().min(1),
    email: z.string(),
    phone: z.string(),
    status: LeadStatusSchema.optional()
})

export const updateLeadRequest = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    status: LeadStatusSchema.optional()
})