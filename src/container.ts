import { HttpError } from "./errors/HttpError.js";
import { LeadsController } from "./controllers/LeadsController.js";
import { GroupsController } from "./controllers/GroupsController.js";
import { CampaignsController } from "./controllers/CampaignsController.js";
import { CampaignLeadsController } from "./controllers/CampaignLeadsController.js";
import { GroupLeadsController } from "./controllers/GroupLeadsController .js";
import { PrismaLeadsRepository } from "./repositories/prisma/PrismaLeadsRepository.js";
import { PrismaGroupsRepository } from "./repositories/prisma/PrismaGroupsRepository.js";

export const leadsRepository = new PrismaLeadsRepository();
export const groupsRepository = new PrismaGroupsRepository();

export const leadsController = new LeadsController(leadsRepository);
export const groupsController = new GroupsController(groupsRepository);
export const campaignController = new CampaignsController();
export const campaignLeadsController = new CampaignLeadsController();
export const groupLeadsController = new GroupLeadsController(groupsRepository, leadsRepository);