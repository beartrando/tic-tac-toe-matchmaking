import * as healthProto from '../../../contracts/proto/common/health';
import HealthUseCase from './health';
import DbService from '../../../infrastructure/db/service';
import MessageService from '../../../infrastructure/message/service';
import JobService from '../../../infrastructure/job/service';

describe('HealthUseCase', () => {
    let healthUseCase: HealthUseCase;
    let mockDbService: jest.Mocked<DbService>;
    let mockMessageService: jest.Mocked<MessageService>;
    let mockJobService: jest.Mocked<JobService>;

    beforeEach(() => {
        mockDbService = {
            check: jest.fn(),
        } as unknown as jest.Mocked<DbService>;
        mockMessageService = {
            check: jest.fn(),
        } as unknown as jest.Mocked<MessageService>;
        mockJobService = {
            check: jest.fn(),
        } as unknown as jest.Mocked<JobService>;

        healthUseCase = new HealthUseCase(mockDbService, mockMessageService, mockJobService);
    });

    it('should return HEALTH_STATUS_OK when all components healthy', async () => {
        mockDbService.check.mockResolvedValue(true);
        mockMessageService.check.mockResolvedValue(true);
        mockJobService.check.mockResolvedValue(true);

        const result = await healthUseCase.execute();

        expect(result.service).toBe('matchmaking');
        expect(result.status).toBe(healthProto.HealthStatus.HEALTH_STATUS_OK);
        expect(result.components).toEqual({
            db: healthProto.HealthStatus.HEALTH_STATUS_OK,
            message: healthProto.HealthStatus.HEALTH_STATUS_OK,
            job: healthProto.HealthStatus.HEALTH_STATUS_OK,
        });
        expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should return HEALTH_STATUS_FAIL when any component fails', async () => {
        mockDbService.check.mockResolvedValue(true);
        mockMessageService.check.mockResolvedValue(false);
        mockJobService.check.mockResolvedValue(true);

        const result = await healthUseCase.execute();

        expect(result.status).toBe(healthProto.HealthStatus.HEALTH_STATUS_FAIL);
        expect(result.components).toEqual({
            db: healthProto.HealthStatus.HEALTH_STATUS_OK,
            message: healthProto.HealthStatus.HEALTH_STATUS_FAIL,
            job: healthProto.HealthStatus.HEALTH_STATUS_OK,
        });
    });
});
