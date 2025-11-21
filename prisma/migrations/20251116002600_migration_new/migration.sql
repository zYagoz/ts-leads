/*
  Warnings:

  - The values [Desqualified] on the enum `LeadCampaignStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Desqualified] on the enum `LeadStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LeadCampaignStatus_new" AS ENUM ('New', 'Engaged', 'FollowUp_Schedule', 'Contacted', 'Qualified', 'Converted', 'Unresponsive', 'Disqualified', 'Re_engaged', 'Opted_Out');
ALTER TABLE "public"."LeadCampaign" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "LeadCampaign" ALTER COLUMN "status" TYPE "LeadCampaignStatus_new" USING ("status"::text::"LeadCampaignStatus_new");
ALTER TYPE "LeadCampaignStatus" RENAME TO "LeadCampaignStatus_old";
ALTER TYPE "LeadCampaignStatus_new" RENAME TO "LeadCampaignStatus";
DROP TYPE "public"."LeadCampaignStatus_old";
ALTER TABLE "LeadCampaign" ALTER COLUMN "status" SET DEFAULT 'New';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "LeadStatus_new" AS ENUM ('New', 'Contact', 'Qualified', 'Converted', 'Unresponsive', 'Disqualified', 'Archived');
ALTER TABLE "public"."Lead" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Lead" ALTER COLUMN "status" TYPE "LeadStatus_new" USING ("status"::text::"LeadStatus_new");
ALTER TYPE "LeadStatus" RENAME TO "LeadStatus_old";
ALTER TYPE "LeadStatus_new" RENAME TO "LeadStatus";
DROP TYPE "public"."LeadStatus_old";
ALTER TABLE "Lead" ALTER COLUMN "status" SET DEFAULT 'New';
COMMIT;
