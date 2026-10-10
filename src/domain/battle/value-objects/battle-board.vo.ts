import BattleCellValueEnum from "../enums/battle-cell-value.enum";

export class BattleBoard {
    constructor(
        readonly cells: readonly BattleCellValueEnum[],
    ) {
        if (cells.length !== 9) {
            throw new Error("BattleBoard must contain 9 cells");
        }

        if (
            cells.some(
                cell => !Object.values(BattleCellValueEnum).includes(cell),
            )
        ) {
            throw new Error("Invalid cell value");
        }
    }

    static empty(): BattleBoard {
        return new BattleBoard(
            Array(9).fill(BattleCellValueEnum.EMPTY),
        );
    }
}

export default BattleBoard;
