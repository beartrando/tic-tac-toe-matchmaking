import BattleEntity from "./battle.entity";
import BattleId from "./value-objects/battle-id.vo";
import ProfileId from "../profile/value-objects/profile-id.vo";

export interface BattleRepository {

    findById(id: BattleId): Promise<BattleEntity | null>;

    save(battle: BattleEntity): Promise<BattleEntity>;

    join(profileId: ProfileId, battleId: BattleId): Promise<BattleEntity | null>;

    findCreatedByProfileId(profileId: ProfileId): Promise<Set<BattleEntity> | null>;

    findCreatedForProfile(profileId: ProfileId): Promise<BattleEntity | null>;

}

export default BattleRepository;
