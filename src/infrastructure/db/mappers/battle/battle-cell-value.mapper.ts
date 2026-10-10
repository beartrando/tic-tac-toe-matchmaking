import {BattleCellValue} from "@prisma/client";

import BattleCellValueEnum from "../../../../domain/battle/enums/battle-cell-value.enum";

export class BattleCellValueMapper {

    static toPersistence(cell: BattleCellValueEnum): BattleCellValue {
        switch (cell) {
            case BattleCellValueEnum.EMPTY:
                return BattleCellValue.EMPTY;
            case BattleCellValueEnum.X:
                return BattleCellValue.X;
            case BattleCellValueEnum.O:
                return BattleCellValue.O;
            default:
                throw new Error(`Unknown BattleCellValueEnum: ${cell}`);
        }
    }

    static toDomain(cell: BattleCellValue): BattleCellValueEnum {
        switch (cell) {
            case BattleCellValue.EMPTY:
                return BattleCellValueEnum.EMPTY;
            case BattleCellValue.X:
                return BattleCellValueEnum.X;
            case BattleCellValue.O:
                return BattleCellValueEnum.O;
            default:
                throw new Error(`Unknown BattleCellValue: ${cell}`);
        }
    }

}

export default BattleCellValueMapper;
