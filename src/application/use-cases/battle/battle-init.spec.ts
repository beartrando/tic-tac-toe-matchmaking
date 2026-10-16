import BattleInitUseCase from "./battle-init";
import BattleEntity from "../../../domain/battle/battle.entity";
import BattleStatusEnum from "../../../domain/battle/enums/battle-status.enum";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";
import ProfileId from "../../../domain/profile/value-objects/profile-id.vo";
import BattleRepository from "../../../domain/battle/battle.repository";
import JobService from "../../../infrastructure/job/service";
import {NotFoundError} from "@shared/errors";

const MATCHMAKING_MATCHED_TOPIC = 'matchmaking.matched';

function makeBattle(id: string, players: string[], status: BattleStatusEnum): BattleEntity {
    return BattleEntity.create({
        id: new BattleId(id),
        playerIds: {value: players.map((p) => new ProfileId(p))} as any,
        status: {value: status, equals: (other: any) => other.value === status} as any,
    });
}

function makeProfile(id: string): ProfileId {
    return new ProfileId(id);
}

describe('BattleInitUseCase', () => {
    let useCase: BattleInitUseCase;
    let repository: jest.Mocked<BattleRepository>;
    let jobService: jest.Mocked<JobService>;

    beforeEach(() => {
        repository = {
            findById: jest.fn(),
            save: jest.fn(),
            join: jest.fn(),
            findCreatedByProfileId: jest.fn(),
            findCreatedForProfile: jest.fn(),
        } as unknown as jest.Mocked<BattleRepository>;

        jobService = {
            enqueue: jest.fn(),
        } as unknown as jest.Mocked<JobService>;

        useCase = new BattleInitUseCase(repository, jobService, MATCHMAKING_MATCHED_TOPIC);
    });

    describe('создание нового баттла', () => {
        it('создаёт новый CREATED-баттл, если у игрока нет активных и чужих свободных нет', async () => {
            const profileId = makeProfile('profile-1');
            const created = makeBattle('battle-new', ['profile-1'], BattleStatusEnum.Created);

            repository.findCreatedByProfileId.mockResolvedValue(null);
            repository.findCreatedForProfile.mockResolvedValue(null);
            repository.save.mockResolvedValue(created);

            const result = await useCase.execute(profileId);

            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(result.id.value).toBe('battle-new');
            expect(result.status.value).toBe(BattleStatusEnum.Created);
            expect(jobService.enqueue).not.toHaveBeenCalled();
        });

        it('не публикует matchmaking.matched при создании (статус Created)', async () => {
            repository.findCreatedByProfileId.mockResolvedValue(null);
            repository.findCreatedForProfile.mockResolvedValue(null);
            repository.save.mockImplementation(async (battle) => battle);

            await useCase.execute(makeProfile('profile-1'));

            expect(jobService.enqueue).not.toHaveBeenCalled();
        });
    });

    describe('возврат существующего баттла', () => {
        it('возвращает свой CREATED-баттл без создания нового', async () => {
            const existing = makeBattle('battle-mine', ['profile-1'], BattleStatusEnum.Created);

            repository.findCreatedByProfileId.mockResolvedValue(new Set([existing]));

            const result = await useCase.execute(makeProfile('profile-1'));

            expect(result.id.value).toBe('battle-mine');
            expect(repository.save).not.toHaveBeenCalled();
            expect(repository.findCreatedForProfile).not.toHaveBeenCalled();
        });
    });

    describe('join по battleId', () => {
        it('присоединяется к указанному баттлу и публикует matchmaking.matched как TracedBattle', async () => {
            const matched = makeBattle('battle-1', ['profile-1', 'profile-2'], BattleStatusEnum.Matched);

            repository.join.mockResolvedValue(matched);

            const result = await useCase.execute(makeProfile('profile-2'), new BattleId('battle-1'), 'track-1');

            expect(repository.join).toHaveBeenCalledWith(
                expect.objectContaining({value: 'profile-2'}),
                expect.objectContaining({value: 'battle-1'}),
            );
            expect(result.status.value).toBe(BattleStatusEnum.Matched);
            expect(jobService.enqueue).toHaveBeenCalledWith(
                MATCHMAKING_MATCHED_TOPIC,
                expect.objectContaining({
                    trackId: 'track-1',
                    battle: expect.objectContaining({id: 'battle-1'}),
                }),
            );
        });

        it('публикует TracedBattle с пустым trackId, если track не передан', async () => {
            const matched = makeBattle('battle-1', ['profile-1', 'profile-2'], BattleStatusEnum.Matched);

            repository.join.mockResolvedValue(matched);

            await useCase.execute(makeProfile('profile-2'), new BattleId('battle-1'));

            expect(jobService.enqueue).toHaveBeenCalledWith(
                MATCHMAKING_MATCHED_TOPIC,
                expect.objectContaining({
                    trackId: '',
                    battle: expect.objectContaining({id: 'battle-1'}),
                }),
            );
        });

        it('бросает NotFoundError, если баттл не найден', async () => {
            repository.join.mockResolvedValue(null);

            await expect(
                useCase.execute(makeProfile('profile-2'), new BattleId('battle-x')),
            ).rejects.toThrow(NotFoundError);
            expect(jobService.enqueue).not.toHaveBeenCalled();
        });

        it('бросает NotFoundError, если join упал с ошибкой', async () => {
            repository.join.mockRejectedValue(new Error('db down'));

            await expect(
                useCase.execute(makeProfile('profile-2'), new BattleId('battle-x')),
            ).rejects.toThrow(NotFoundError);
        });
    });

    describe('join к чужому CREATED-баттлу с ретраями', () => {
        it('присоединяется к чужому баттлу с первой попытки', async () => {
            const somebodies = makeBattle('battle-other', ['profile-9'], BattleStatusEnum.Created);
            const matched = makeBattle('battle-other', ['profile-9', 'profile-1'], BattleStatusEnum.Matched);

            repository.findCreatedByProfileId.mockResolvedValue(null);
            repository.findCreatedForProfile.mockResolvedValue(somebodies);
            repository.join.mockResolvedValue(matched);

            const result = await useCase.execute(makeProfile('profile-1'));

            expect(result.status.value).toBe(BattleStatusEnum.Matched);
            expect(repository.findCreatedForProfile).toHaveBeenCalledTimes(1);
            expect(repository.save).not.toHaveBeenCalled();
            expect(jobService.enqueue).toHaveBeenCalledTimes(1);
        });

        it('создаёт новый баттл, если join не удаётся (устаревший чужой CREATED)', async () => {
            const stale = makeBattle('battle-stale', ['profile-9'], BattleStatusEnum.Created);
            const created = makeBattle('battle-new', ['profile-1'], BattleStatusEnum.Created);

            repository.findCreatedByProfileId.mockResolvedValue(null);
            repository.findCreatedForProfile.mockResolvedValue(stale);
            repository.join.mockResolvedValue(null);
            repository.save.mockResolvedValue(created);

            const result = await useCase.execute(makeProfile('profile-1'));

            expect(repository.join).toHaveBeenCalledTimes(3);
            expect(result.id.value).toBe('battle-new');
        });
    });
});
