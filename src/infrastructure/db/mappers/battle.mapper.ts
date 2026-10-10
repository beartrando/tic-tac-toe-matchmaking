import {Battle} from "@prisma/client";

import BattleEntity from "../../../domain/battle/battle.entity";
import BattlePlayerIds from "../../../domain/battle/value-objects/battle-player-ids.vo";
import BattleStatusMapper from "./battle/status.mapper";
import BattleBoardMapper from "./battle/board.mapper";
import ProfileId from "../../../domain/profile/value-objects/profile-id.vo";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";

type BattleSaveData = Omit<
    Battle,
    "createdAt" | "updatedAt"
>;

export class BattleDbMapper {

    static toPersistence(battle: BattleEntity): BattleSaveData {
        return {
            id: battle.id.value,
            playerIds: battle.playerIds.value.map((id: ProfileId) => id.value),
            board: BattleBoardMapper.toPersistence(battle.board),
            status: BattleStatusMapper.toPersistence(battle.status),
            winnerId: battle.winnerId?.value ?? null,
            lastMoveAt: battle.lastMoveAt,
        };
    }

    static toDomain(battle: Battle): BattleEntity {
        return BattleEntity.create({
            id: new BattleId(battle.id),
            playerIds: new BattlePlayerIds(battle.playerIds.map((id: string) => new ProfileId(id))),
            board: BattleBoardMapper.toDomain(battle.board),
            status: BattleStatusMapper.toDomain(battle.status),
            winnerId: battle.winnerId ? new ProfileId(battle.winnerId) : null,
            lastMoveAt: battle.lastMoveAt,
            createdAt: battle.createdAt,
            updatedAt: battle.updatedAt,
        });
    }
}

export default BattleDbMapper;
