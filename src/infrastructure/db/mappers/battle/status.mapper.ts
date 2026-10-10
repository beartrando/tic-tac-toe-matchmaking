import {BattleStatus as PrismaBattleStatus,} from "@prisma/client";

import BattleStatus from "../../../../domain/battle/value-objects/battle-status.vo";
import BattleStatusEnum from "../../../../domain/battle/enums/battle-status.enum";

export class BattleStatusMapper {

    static toPersistence(
        status: BattleStatus,
    ): PrismaBattleStatus {
        switch (status.value) {
            case BattleStatusEnum.Created:
                return PrismaBattleStatus.Created;
            case BattleStatusEnum.Matched:
                return PrismaBattleStatus.Matched;
            case BattleStatusEnum.Ready:
                return PrismaBattleStatus.Ready;
            case BattleStatusEnum.Started:
                return PrismaBattleStatus.Started;
            case BattleStatusEnum.Finished:
                return PrismaBattleStatus.Finished;
            case BattleStatusEnum.Cancelled:
                return PrismaBattleStatus.Cancelled;
            case BattleStatusEnum.TimeOut:
                return PrismaBattleStatus.TimeOut;
            default:
                throw new Error(`Unknown BattleStatus: ${status.value}`);
        }
    }

    static toDomain(
        status: PrismaBattleStatus,
    ): BattleStatus {
        switch (status) {
            case PrismaBattleStatus.Created:
                return new BattleStatus(BattleStatusEnum.Created);
            case PrismaBattleStatus.Matched:
                return new BattleStatus(BattleStatusEnum.Matched);
            case PrismaBattleStatus.Ready:
                return new BattleStatus(BattleStatusEnum.Ready);
            case PrismaBattleStatus.Started:
                return new BattleStatus(BattleStatusEnum.Started);
            case PrismaBattleStatus.Finished:
                return new BattleStatus(BattleStatusEnum.Finished);
            case PrismaBattleStatus.Cancelled:
                return new BattleStatus(BattleStatusEnum.Cancelled);
            case PrismaBattleStatus.TimeOut:
                return new BattleStatus(BattleStatusEnum.TimeOut);
            default:
                throw new Error(`Unknown PrismaBattleStatus: ${status}`);
        }
    }
}

export default BattleStatusMapper;
