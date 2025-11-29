import { HttpError } from "./errors/HttpError.js";
import { LeadsController } from "./controllers/LeadsController.js";
import { GroupsController } from "./controllers/GroupsController.js";
import { CampaignsController } from "./controllers/CampaignsController.js";
import { CampaignLeadsController } from "./controllers/CampaignLeadsController.js";
import { GroupLeadsController } from "./controllers/GroupLeadsController .js";
import { PrismaLeadsRepository } from "./repositories/prisma/PrismaLeadsRepository.js";
import { PrismaGroupsRepository } from "./repositories/prisma/PrismaGroupsRepository.js";
import { PrismaCampaignsRepository } from "./repositories/prisma/PrismaCampaignsRepository.js";
import { PrismaCampaignLeadsRepositoy } from "./repositories/prisma/PrismaCampaignsLeadsRepository.js";

export const leadsRepository = new PrismaLeadsRepository();
export const groupsRepository = new PrismaGroupsRepository();
export const campaignsRepository = new PrismaCampaignsRepository()
export const campaignLeadsRepository = new PrismaCampaignLeadsRepositoy()

export const leadsController = new LeadsController(leadsRepository);
export const groupsController = new GroupsController(groupsRepository);
export const campaignController = new CampaignsController(campaignsRepository);
export const campaignLeadsController = new CampaignLeadsController(campaignLeadsRepository);
export const groupLeadsController = new GroupLeadsController(groupsRepository, leadsRepository);