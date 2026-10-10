import * as matchmakingProto from "../../../../contracts/proto/matchmaking";
import BattleCellValueProtoMapper from "./battle-cell-value.proto.mapper";
import BattleBoard from "../../../../domain/battle/value-objects/battle-board.vo";

export class BattleBoardProtoMapper {

    static toProto(board: BattleBoard): matchmakingProto.BattleCellValue[] {
        return board.cells.map(BattleCellValueProtoMapper.toProto);
    }

    static toDomain(
        cells: readonly matchmakingProto.BattleCellValue[],
    ): BattleBoard {
        return new BattleBoard(cells.map(BattleCellValueProtoMapper.toDomain));
    }
}

export default BattleBoardProtoMapper;
