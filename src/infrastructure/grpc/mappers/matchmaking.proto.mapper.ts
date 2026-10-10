import * as battleProto from "../../../contracts/proto/battle";
import BattleEntity, {BattleEntityProps} from "../../../domain/battle/battle.entity";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";
import BattlePlayerIds from "../../../domain/battle/value-objects/battle-player-ids.vo";
import ProfileId from "../../../domain/profile/value-objects/profile-id.vo";
import BattleStatusProtoMapper from "./battle/battle-status.proto.mapper";

export class MatchmakingProtoMapper {
    static toProto(battle: BattleEntity): battleProto.BattleObject {

        return battleProto.BattleObject.create({
            id: battle.id.value,
            playerIds: battle.playerIds.value.map(id => id.value),
            status: BattleStatusProtoMapper.toProto(battle.status),
            createdAt: battle.createdAt,
            updatedAt: battle.updatedAt,
        });
    }

    static toDomain(battle: battleProto.BattleObject): BattleEntity {
        const battleEntityProps: BattleEntityProps = {
            id: new BattleId(battle.id),
            playerIds: new BattlePlayerIds(battle.playerIds.map((id: string) => new ProfileId(id))),
            status: BattleStatusProtoMapper.toDomain(battle.status),
            createdAt: battle.createdAt,
            updatedAt: battle.updatedAt,
        };
        return BattleEntity.create(battleEntityProps);
    }
}

export default MatchmakingProtoMapper;
