import {BattleCellValue} from "@prisma/client";
import BattleCellValueMapper from "./battle-cell-value.mapper";
import Board from "../../../../domain/battle/value-objects/battle-board.vo";

export class BattleBoardMapper {

    static toPersistence(board: Board): BattleCellValue[] {
        return board.cells.map(BattleCellValueMapper.toPersistence);
    }

    static toDomain(
        cells: readonly BattleCellValue[],
    ): Board {
        return new Board(cells.map(BattleCellValueMapper.toDomain));
    }
}

export default BattleBoardMapper;
