-- CreateTable
CREATE TABLE "OrganisationInvite" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "token" TEXT NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganisationInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganisationInvite_token_key" ON "OrganisationInvite"("token");

-- CreateIndex
CREATE INDEX "OrganisationInvite_organisationId_idx" ON "OrganisationInvite"("organisationId");

-- CreateIndex
CREATE INDEX "OrganisationInvite_email_idx" ON "OrganisationInvite"("email");

-- CreateIndex
CREATE INDEX "OrganisationInvite_token_idx" ON "OrganisationInvite"("token");

-- CreateIndex
CREATE INDEX "OrganisationInvite_expiresAt_idx" ON "OrganisationInvite"("expiresAt");

-- AddForeignKey
ALTER TABLE "OrganisationInvite" ADD CONSTRAINT "OrganisationInvite_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
