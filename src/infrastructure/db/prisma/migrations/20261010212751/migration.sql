-- CreateEnum
CREATE TYPE "BattleStatus" AS ENUM ('Created', 'Matched', 'Ready', 'Started', 'Finished', 'Cancelled', 'TimeOut');

-- CreateTable
CREATE TABLE "battles" (
    "id" TEXT NOT NULL,
    "player_ids" TEXT[],
    "status" "BattleStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "battles_pkey" PRIMARY KEY ("id")
);
