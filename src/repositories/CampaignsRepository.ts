import type { Campaign } from "@prisma/client";

export interface CampaignWhereParams {
    name?: {
        like?: string,
        equals?: string,
        mode?: "default" | "insensitive"
    }
    date? : Date
    
}

export interface FindCampaignsParams {
    where?: CampaignWhereParams
    sortBy?: "name" | 'status' | 'createdAt'
    order?: 'asc' | 'desc'
    limit?: number
    offset?: number
    includes?: {
        leads?: boolean
    }
}

export interface CreateCampaignAttributes {
    name: string
    description: string
    startDate: Date
    endDate?: Date
}

export interface CampaignsRepository {
    find: () => Promise<Campaign[]>
    findById: (id: number) => Promise<Campaign | null>
    create: (attributes: CreateCampaignAttributes) => Promise<Campaign>
    updateById: (id: number, attributes: Partial<CreateCampaignAttributes>) => Promise<Campaign | null>
    deleteById: (id: number) => Promise<Campaign | null>
}