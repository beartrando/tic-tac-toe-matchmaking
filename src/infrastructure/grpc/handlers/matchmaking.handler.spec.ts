import {MatchmakingHandler} from "./matchmaking.handler";
import BattleInitUseCase from "../../../application/use-cases/battle/battle-init";
import BattleEntity from "../../../domain/battle/battle.entity";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";
import BattlePlayerIds from "../../../domain/battle/value-objects/battle-player-ids.vo";
import ProfileId from "../../../domain/profile/value-objects/profile-id.vo";
import BattleStatus from "../../../domain/battle/value-objects/battle-status.vo";
import BattleStatusEnum from "../../../domain/battle/enums/battle-status.enum";

function makeBattle(id: string): BattleEntity {
    return BattleEntity.create({
        id: new BattleId(id),
        playerIds: new BattlePlayerIds([new ProfileId('profile-1')]),
        status: new BattleStatus(BattleStatusEnum.Matched),
    });
}

describe('MatchmakingHandler', () => {
    let handler: MatchmakingHandler;
    let useCase: jest.Mocked<BattleInitUseCase>;

    beforeEach(() => {
        useCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<BattleInitUseCase>;

        handler = new MatchmakingHandler(useCase);
    });

    function runInit(request: any) {
        const callback = jest.fn();
        return handler
            .init({request} as any, callback)
            .then(() => callback.mock.calls[0]);
    }

    it('генерирует track_id при пустом входе и возвращает его в ответе', async () => {
        useCase.execute.mockResolvedValue(makeBattle('battle-1'));

        const [err, result] = await runInit({profileId: 'profile-1', battleId: 'battle-1', trackId: ''});

        expect(err).toBeNull();
        expect(result.trackId).toBeTruthy();

        const passedTrackId = useCase.execute.mock.calls[0][2];
        expect(passedTrackId).toBe(result.trackId);
    });

    it('переиспользует входящий track_id и эхает его в ответе', async () => {
        useCase.execute.mockResolvedValue(makeBattle('battle-1'));

        const [err, result] = await runInit({profileId: 'profile-1', battleId: 'battle-1', trackId: 'track-42'});

        expect(err).toBeNull();
        expect(result.trackId).toBe('track-42');
        expect(useCase.execute).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            'track-42',
        );
    });
});
