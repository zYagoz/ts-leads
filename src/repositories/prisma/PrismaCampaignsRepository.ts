import type { Campaign } from "@prisma/client";
import type { CampaignsRepository, CreateCampaignAttributes, FindCampaignsParams } from "../CampaignsRepository.js";
import { prisma } from "src/database/index.js";

export class PrismaCampaignsRepository implements CampaignsRepository{
    find () : Promise<Campaign[]>{
        return prisma.campaign.findMany()
    }

    findById (id: number) : Promise<Campaign | null>{
        return prisma.campaign.findUnique({
            where: {id},
            include: {
                leads: true
            }
        })
    }

    create (attributes: CreateCampaignAttributes) : Promise<Campaign>{
        return prisma.campaign.create({data: attributes})
    }

    updateById (id: number, attributes: Partial<CreateCampaignAttributes>) : Promise<Campaign | null>{
        return prisma.campaign.update({
            where: {id},
            data: attributes
        })
    }

    deleteById (id: number) : Promise<Campaign | null>{
        return prisma.campaign.delete({where: {id}})

    }


}