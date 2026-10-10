import * as grpc from "@grpc/grpc-js";
import * as healthProto from '../../contracts/proto/common/health';
import * as matchmakingProto from '../../contracts/proto/matchmaking';
import logger from "@shared/logger";
import HealthHandler from "./handlers/health.handler";
import MatchmakingHandler from "./handlers/matchmaking.handler";

export class GrpcService {
    private readonly server: grpc.Server;

    constructor(
        private readonly port: number,
        private readonly healthHandler: HealthHandler,
        private readonly matchmakingHandler: MatchmakingHandler,
    ) {
        this.server = new grpc.Server();
    }

    async start(): Promise<void> {
        return new Promise<void>(
            (resolve, reject) => {
                this.addServices();
                this.server.bindAsync(
                    `0.0.0.0:${this.port}`,
                    grpc.ServerCredentials.createInsecure(),
                    (err, port) => {
                        if (err) {
                            logger.error(
                                {err},
                                '❌ Failed to start gRPC',
                            );

                            return reject(err);
                        }

                        logger.info(
                            `🟢 gRPC server started on port ${port}`,
                        );
                        resolve();
                    },
                );
            },
        );
    }

    stop() {
        this.server.forceShutdown();
    }

    private addServices() {
        this.registerHealthService();
        this.registerMatchmakingService();
    }

    private registerHealthService() {
        this.server.addService(healthProto.HealthService, {
            check: this.healthHandler.check.bind(this.healthHandler),
            status: this.healthHandler.status.bind(this.healthHandler),
            livez: this.healthHandler.livez.bind(this.healthHandler),
            readyz: this.healthHandler.readyz.bind(this.healthHandler),
        });
    }

    private registerMatchmakingService() {
        this.server.addService(matchmakingProto.MatchmakingService, {
            init: this.matchmakingHandler.init.bind(this.matchmakingHandler),
        });
    }
}

export default GrpcService;
