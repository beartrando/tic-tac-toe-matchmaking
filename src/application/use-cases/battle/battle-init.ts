import BattleRepository from "../../../domain/battle/battle.repository";
import BattleEntity from "../../../domain/battle/battle.entity";
import JobService from "../../../infrastructure/job/service";
import {NotFoundError} from "@shared/errors";
import MatchmakingProtoMapper from "../../../infrastructure/grpc/mappers/matchmaking.proto.mapper";
import BattleStatusEnum from "../../../domain/battle/enums/battle-status.enum";
import ProfileId from "../../../domain/profile/value-objects/profile-id.vo";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";

export class BattleInitUseCase {
    constructor(
        private readonly battleRepository: BattleRepository,
        private readonly jobService: JobService,
        private readonly matchmakingMatchedTopic: string,
    ) {
    }

    async execute(profileId: ProfileId, battleId?: BattleId | null): Promise<BattleEntity> {
        if (battleId) {
            let battle: BattleEntity | null;
            try {
                battle = await this.battleRepository.join(profileId, battleId);
            } catch (e) {
                throw new NotFoundError('battle ' + battleId.value);
            }

            if (!battle) {
                throw new NotFoundError('battle ' + battleId.value);
            }

            this.enqueue(battle);

            return battle;
        }

        const existingMyBattles = await this.battleRepository.findCreatedByProfileId(profileId);

        const existingMyBattle = existingMyBattles?.values().next().value;

        if (existingMyBattle) {
            return existingMyBattle;
        }

        for (let attempts = 0; attempts < 3; attempts++) {
            const existingSomebodiesBattle = await this.battleRepository.findCreatedForProfile(profileId);

            if (!existingSomebodiesBattle) {
                break;
            }

            try {
                const battle = await this.battleRepository.join(profileId, existingSomebodiesBattle.id);
                if (battle) {
                    this.enqueue(battle);
                    return battle;
                }
            } catch (e) {
                // logger.log(e);
            }
        }

        const newBattle = BattleEntity.createNew(profileId);
        const battle = await this.battleRepository.save(newBattle);

        return battle;
    }

    private enqueue(battle: BattleEntity): void {
        if (battle.status.value == BattleStatusEnum.Matched) {
            this.jobService.enqueue(this.matchmakingMatchedTopic, MatchmakingProtoMapper.toProto(battle));
        }
    }
}


export default BattleInitUseCase;
