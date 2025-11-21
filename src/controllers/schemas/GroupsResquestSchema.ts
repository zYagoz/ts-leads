import { describe } from "node:test";
import z from "zod";


const CreateGroupResquestSchema = z.object({
    name: z.string(),
    description: z.string()
});

const updateGroupResquestSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional()
})

const GelLeadsGroupResquestSchema = z.object({
    name: z.string(),
    descrpiton: z.string().optional
});

const addLeadGroupRequestSchema = z.object({
    leadId: z.coerce.number()
})

export {CreateGroupResquestSchema, updateGroupResquestSchema, 
    GelLeadsGroupResquestSchema, addLeadGroupRequestSchema}