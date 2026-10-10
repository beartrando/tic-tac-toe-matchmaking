import * as matchmakingProto from "../../../contracts/proto/matchmaking";
import BattleEntity, {BattleEntityProps} from "../../../domain/battle/battle.entity";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";
import BattlePlayerIds from "../../../domain/battle/value-objects/battle-player-ids.vo";
import ProfileId from "../../../domain/profile/value-objects/profile-id.vo";
import BattleBoardProtoMapper from "./battle/battle-board.proto.mapper";
import BattleStatusProtoMapper from "./battle/battle-status.proto.mapper";

export class MatchmakingProtoMapper {
    static toProto(battle: BattleEntity): matchmakingProto.BattleObject {

        return matchmakingProto.BattleObject.create({
            id: battle.id.value,
            playerIds: battle.playerIds.value.map(id => id.value),
            board: BattleBoardProtoMapper.toProto(battle.board),
            status: BattleStatusProtoMapper.toProto(battle.status),
            winnerId: battle.winnerId?.value,
            lastMoveAt: battle.lastMoveAt ?? undefined,
            createdAt: battle.createdAt,
            updatedAt: battle.updatedAt,
        });
    }

    static toDomain(battle: matchmakingProto.BattleObject): BattleEntity {
        const battleEntityProps: BattleEntityProps = {
            id: new BattleId(battle.id),
            playerIds: new BattlePlayerIds(battle.playerIds.map((id: string) => new ProfileId(id))),
            board: BattleBoardProtoMapper.toDomain(battle.board),
            status: BattleStatusProtoMapper.toDomain(battle.status),
            winnerId: battle.winnerId ? new ProfileId(battle.winnerId) : null,
            lastMoveAt: battle.lastMoveAt,
            createdAt: battle.createdAt,
            updatedAt: battle.updatedAt,
        };
        return BattleEntity.create(battleEntityProps);
    }
}

export default MatchmakingProtoMapper;
