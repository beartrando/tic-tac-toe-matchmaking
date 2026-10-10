import * as matchmakingProto from "../../../../contracts/proto/matchmaking";
import BattleCellValueEnum from "../../../../domain/battle/enums/battle-cell-value.enum";

export class BattleCellValueProtoMapper {

    static toProto(cell: BattleCellValueEnum): matchmakingProto.BattleCellValue {
        switch (cell) {
            case BattleCellValueEnum.EMPTY:
                return matchmakingProto.BattleCellValue.CELL_EMPTY;
            case BattleCellValueEnum.X:
                return matchmakingProto.BattleCellValue.CELL_X;
            case BattleCellValueEnum.O:
                return matchmakingProto.BattleCellValue.CELL_O;
            default:
                throw new Error(`Unknown BattleCellValueEnum: ${cell}`);
        }


    }

    static toDomain(cell: matchmakingProto.BattleCellValue): BattleCellValueEnum {
        switch (cell) {
            case matchmakingProto.BattleCellValue.CELL_EMPTY:
                return BattleCellValueEnum.EMPTY;
            case matchmakingProto.BattleCellValue.CELL_X:
                return BattleCellValueEnum.X;
            case matchmakingProto.BattleCellValue.CELL_O:
                return BattleCellValueEnum.O;
            default:
                throw new Error(`Unknown BattleCellValueEnum: ${cell}`);
        }
    }

}

export default BattleCellValueProtoMapper;
