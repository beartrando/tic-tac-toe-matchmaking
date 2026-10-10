import Board from "./value-objects/battle-board.vo";
import BattlePlayerIds from "./value-objects/battle-player-ids.vo";
import BattleStatus from "./value-objects/battle-status.vo";
import BattleStatusEnum from "./enums/battle-status.enum";
import BattleId from "./value-objects/battle-id.vo";
import ProfileId from "../profile/value-objects/profile-id.vo";

export type BattleEntityProps = {
    id?: BattleId;
    playerIds: BattlePlayerIds;
    status?: BattleStatus;
    createdAt?: Date;
    updatedAt?: Date;
};

export class BattleEntity {
    constructor(
        readonly id: BattleId,
        readonly playerIds: BattlePlayerIds,
        public status: BattleStatus,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {
    }

    static create(props: BattleEntityProps): BattleEntity {
        const now = new Date();

        return new BattleEntity(
            props.id ?? BattleId.create(),
            props.playerIds,
            props.status ?? new BattleStatus(BattleStatusEnum.Created),
            props.createdAt ?? now,
            props.updatedAt ?? now,
        );
    }

    static createNew(profileId: ProfileId): BattleEntity {
        return BattleEntity.create({playerIds: new BattlePlayerIds([profileId])});
    }

    cancel(): BattleEntity {
        this.status = BattleStatus.create(BattleStatusEnum.Cancelled);
        return this;
    }

    timeout(): BattleEntity {
        this.status = BattleStatus.create(BattleStatusEnum.TimeOut);
        return this;
    }

    final(): boolean {
        return this.finished()
            || this.status.equals(BattleStatus.create(BattleStatusEnum.Cancelled))
            || this.status.equals(BattleStatus.create(BattleStatusEnum.TimeOut));
    }

    finished(): boolean {
        return this.status.equals(BattleStatus.create(BattleStatusEnum.Finished));
    }
}

export default BattleEntity;
