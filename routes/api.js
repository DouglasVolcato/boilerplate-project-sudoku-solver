"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    try {
      const { puzzle, coordinate, value } = req.body;
      const row = coordinate.split("")[0];
      const column = coordinate.split("")[1];

      switch (true) {
        case !puzzle || !coordinate || !value:
          res.json({ error: "Required field(s) missing" });
          return;

        case coordinate.length !== 2 ||
          !/[a-i]/i.test(row) ||
          !/[1-9]/i.test(column):
          res.json({ error: "Invalid coordinate" });
          return;

        case !/[1-9]/i.test(value):
          res.json({ error: "Invalid value" });
          return;

        case puzzle.length !== 81:
          res.json({ error: "Expected puzzle to be 81 characters long" });
          return;

        case !/[^0-9]/g.test(puzzle):
          res.json({ error: "Invalid characters in puzzle" });
          return;

        default:
          let validCol = solver.checkColPlacement(puzzle, row, column, value);
          let validReg = solver.checkRegionPlacement(
            puzzle,
            row,
            column,
            value
          );
          let validRow = solver.checkRowPlacement(puzzle, row, column, value);
          let conflicts = [];

          if (validCol && validReg && validRow) {
            res.json({ valid: true });
            return;
          }

          if (!validRow) {
            conflicts.push("row");
          }

          if (!validCol) {
            conflicts.push("column");
          }

          if (!validRow) {
            conflicts.push("region");
          }

          res.json({ valid: false, conflict: conflicts });
          return;
      }
    } catch (error) {
      res.json({ error: error.message });
      return;
    }
  });

  app.route("/api/solve").post((req, res) => {
    try {
      const { puzzle } = req.body;

      if (!puzzle) {
        res.json({ error: "Required field missing" });
        return;
      }

      const solvedString = solver.solve(puzzle);

      switch (true) {
        case !puzzle:
          res.json({ error: "Required field missing" });
          return;

        case puzzle.length !== 81:
          res.json({ error: "Expected puzzle to be 81 characters long" });
          return;

        case /[^0-9.]/g.test(puzzle):
          res.json({ error: "Invalid characters in puzzle" });
          return;

        case !solvedString:
          res.json({ error: "Puzzle cannot be solved" });
          return;

        default:
          res.json({ solution: solvedString });
          return;
      }
    } catch (error) {
      res.json({ error: error.message });
      return;
    }
  });
};
