import * as matchmakingProto from "../../../../contracts/proto/matchmaking";
import BattleStatus from "../../../../domain/battle/value-objects/battle-status.vo";
import BattleStatusEnum from "../../../../domain/battle/enums/battle-status.enum";

export class BattleStatusProtoMapper {

    static toProto(
        status: BattleStatus,
    ): matchmakingProto.BattleStatus {
        switch (status.value) {
            case BattleStatusEnum.Created:
                return matchmakingProto.BattleStatus.CREATED;
            case BattleStatusEnum.Ready:
                return matchmakingProto.BattleStatus.READY;
            case BattleStatusEnum.Matched:
                return matchmakingProto.BattleStatus.MATCHED;
            case BattleStatusEnum.Started:
                return matchmakingProto.BattleStatus.STARTED;
            case BattleStatusEnum.Finished:
                return matchmakingProto.BattleStatus.FINISHED;
            case BattleStatusEnum.Cancelled:
                return matchmakingProto.BattleStatus.CANCELLED;
            case BattleStatusEnum.TimeOut:
                return matchmakingProto.BattleStatus.TIMEOUT;
            default:
                return matchmakingProto.BattleStatus.UNKNOWN;
        }
    }

    static toDomain(
        status: matchmakingProto.BattleStatus,
    ): BattleStatus {
        switch (status) {
            case matchmakingProto.BattleStatus.CREATED:
                return new BattleStatus(BattleStatusEnum.Created);
            case matchmakingProto.BattleStatus.MATCHED:
                return new BattleStatus(BattleStatusEnum.Matched);
            case matchmakingProto.BattleStatus.READY:
                return new BattleStatus(BattleStatusEnum.Ready);
            case matchmakingProto.BattleStatus.STARTED:
                return new BattleStatus(BattleStatusEnum.Started);
            case matchmakingProto.BattleStatus.FINISHED:
                return new BattleStatus(BattleStatusEnum.Finished);
            case matchmakingProto.BattleStatus.CANCELLED:
                return new BattleStatus(BattleStatusEnum.Cancelled);
            case matchmakingProto.BattleStatus.TIMEOUT:
                return new BattleStatus(BattleStatusEnum.TimeOut);
            default:
                return new BattleStatus(BattleStatusEnum.Unknown);
        }
    }
}

export default BattleStatusProtoMapper;
