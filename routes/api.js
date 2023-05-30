"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {});

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    const solvedString = solver.solve(puzzle);

    switch (true) {
      case !puzzle:
        res.json({ error: "Required field missing" });
        return;

      case puzzle.length != 81:
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
  });
};
