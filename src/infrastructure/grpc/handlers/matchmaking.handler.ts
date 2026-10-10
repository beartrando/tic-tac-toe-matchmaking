import * as grpc from '@grpc/grpc-js';
import * as matchmakingProto from '../../../contracts/proto/matchmaking';
import logger from "@shared/logger";
import BattleInitUseCase from "../../../application/use-cases/battle/battle-init";
import callbackError from "./callback.error";
import MatchmakingProtoMapper from "../mappers/matchmaking.proto.mapper";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";
import ProfileId from "../../../domain/profile/value-objects/profile-id.vo";


export class MatchmakingHandler {
    constructor(
        private readonly initUseCase: BattleInitUseCase
    ) {
    }

    async init(
        call: grpc.ServerUnaryCall<matchmakingProto.BattleInitRequest, matchmakingProto.BattleResponse>,
        callback: grpc.sendUnaryData<matchmakingProto.BattleResponse>
    ) {

        try {
            const {profileId, battleId} = call.request;

            const battle = await this.initUseCase.execute(new ProfileId(profileId), battleId ? new BattleId(battleId) : null);

            const result = matchmakingProto.BattleResponse.create({battle: MatchmakingProtoMapper.toProto(battle)});

            logger.log(result);

            if (!result) {
                throw new Error('Battle');
            }

            callback(null, result);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    }
}

export default MatchmakingHandler;
