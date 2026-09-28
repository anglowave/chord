-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "TokenAsset" (
    "id" TEXT NOT NULL,
    "image" BYTEA NOT NULL,
    "imageType" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "mint" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "metadataUri" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "stocks" TEXT[],
    "signature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("mint")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_signature_key" ON "Token"("signature");

-- CreateIndex
CREATE INDEX "Token_createdAt_idx" ON "Token"("createdAt" DESC);

