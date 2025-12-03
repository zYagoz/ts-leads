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
                leads: {
                    include:{
                        lead: true
                    }
                }
            }
        })
    }

    create (attributes: CreateCampaignAttributes) : Promise<Campaign>{
        return prisma.campaign.create({data: attributes})
    }

    async updateById (id: number, attributes: Partial<CreateCampaignAttributes>) : Promise<Campaign | null>{
        const campaignExist = await prisma.campaign.findUnique({where: {id}})

        if(!campaignExist) return null
        
        return prisma.campaign.update({
            where: {id},
            data: attributes
        })
    }

    async deleteById (id: number) : Promise<Campaign | null>{
        const campaignExist = await prisma.campaign.findUnique({where: {id}})

        if(!campaignExist) return null
            
        return prisma.campaign.delete({where: {id}})

    }


}