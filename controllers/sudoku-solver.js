class SudokuSolver {
  validate(puzzleString) {}

  checkRowPlacement(puzzleString, row, column, value) {}

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  /* Takes a partially filled-in grid and attempts
    to assign values to all unassigned locations in
    such a way to meet the requirements for
    Sudoku solution (non-duplication across rows,
    columns, and boxes) */
  solveSudoku(grid, row, col) {
    /* If we have reached the 8th
       row and 9th column (0
       indexed matrix) ,
       we are returning true to avoid further
       backtracking       */
    if (row == 9 - 1 && col == 9) return grid;

    // Check if column value  becomes 9 ,
    // we move to next row
    // and column start from 0
    if (col == 9) {
      row++;
      col = 0;
    }

    // Check if the current position
    // of the grid already
    // contains value >0, we iterate
    // for next column
    if (grid[row][col] != 0) return this.solveSudoku(grid, row, col + 1);

    for (let num = 1; num < 10; num++) {
      // Check if it is safe to place
      // the num (1-9)  in the given
      // row ,col ->we move to next column
      if (this.isSafe(grid, row, col, num)) {
        /*  assigning the num in the current
            (row,col)  position of the grid and
            assuming our assigned num in the position
            is correct */
        grid[row][col] = num;

        // Checking for next
        // possibility with next column
        if (this.solveSudoku(grid, row, col + 1)) return grid;
      }

      /* removing the assigned num , since our
           assumption was wrong , and we go for next
           assumption with diff num value   */
      grid[row][col] = 0;
    }
    return false;
  }

  // Check whether it will be legal
  // to assign num to the
  // given row, col
  isSafe(grid, row, col, num) {
    // Check if we find the same num
    // in the similar row , we
    // return false
    for (let x = 0; x <= 8; x++) if (grid[row][x] == num) return false;

    // Check if we find the same num
    // in the similar column ,
    // we return false
    for (let x = 0; x <= 8; x++) if (grid[x][col] == num) return false;

    // Check if we find the same num
    // in the particular 3*3
    // matrix, we return false
    let startRow = row - (row % 3),
      startCol = col - (col % 3);

    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] == num) return false;

    return true;
  }

  //receive ..44..34..23
  //return [[0,0,4,4,0,0,3,4,0], [0,2,3]]
  transform(puzzleString) {
    let grid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    let row = -1;
    let col = 0;

    for (let i = 0; i < puzzleString.length; i++) {
      if (i % 9 == 0) {
        row++;
      }

      if (col % 9 == 0) {
        col = 0;
      }

      grid[row][col] = puzzleString[i] === "." ? 0 : puzzleString[i];
      col++;
    }

    return grid;
  }

  transformBack(grid) {
    return grid.flat().join("");
  }

  solve(puzzleString) {
    let grid = this.transform(puzzleString);
    let solved = this.solveSudoku(grid, 0, 0);

    if (!solved) {
      return false;
    }

    let solvedString = this.transformBack(solved);

    return solvedString;
  }
}

module.exports = SudokuSolver;
