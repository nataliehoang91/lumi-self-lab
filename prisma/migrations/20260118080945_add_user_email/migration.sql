-- AlterTable
ALTER TABLE "OrganisationMember" ADD COLUMN     "teamId" TEXT,
ADD COLUMN     "teamName" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE INDEX "OrganisationMember_role_idx" ON "OrganisationMember"("role");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
