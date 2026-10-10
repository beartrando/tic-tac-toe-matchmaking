-- DropColumns
ALTER TABLE "battles" DROP COLUMN "board",
DROP COLUMN "winner_id",
DROP COLUMN "last_move_at";

-- DropEnum
DROP TYPE "BattleCellValue";
