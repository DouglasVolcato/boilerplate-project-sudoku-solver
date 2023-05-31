const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const puzzle = req.body.puzzle;
    const coord = req.body.coordinate;
    const value = req.body.value;

    if (!puzzle || !coord || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    if (
      coord.length !== 2 ||
      coord[0].toLowerCase().charCodeAt(0) - 97 + 1 > 9 ||
      coord[1] == 0
    ) {
      return res.json({ error: "Invalid coordinate" });
    }

    if (!/[1-9]/.test(value)) {
      return res.json({ error: "Invalid value" });
    }

    const validate = solver.validate(puzzle);

    if (validate[0] === false) {
      return res.json(validate[1]);
    }

    const coordRe = /^[a-iA-I]\d$/gi;
    const valueRe = /^\d$/;

    if (coordRe.test(coord) === false) {
      return res.json({ error: "Invalid coordinate" });
    }

    if (valueRe.test(value) === false) {
      return res.json({ error: "Invalid value" });
    }

    const row = coord.split("")[0];
    const col = coord.split("")[1];

    const checkRow = solver.checkRow(validate[1], row, col, value);
    const checkCol = solver.checkCol(validate[1], row, col, value);
    const checkReg = solver.checkReg(validate[1], row, col, value);

    let conflicts = [];

    if (checkRow !== true) {
      conflicts.push(checkRow);
    }

    if (checkCol !== true) {
      conflicts.push(checkCol);
    }

    if (checkReg !== true) {
      conflicts.push(checkReg);
    }

    if (conflicts.length !== 0) {
      return res.json({ valid: false, conflict: conflicts });
    }

    res.json({ valid: true });
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;

    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }

    const validate = solver.validate(puzzle);

    if (validate[0] === false) {
      return res.json(validate[1]);
    }

    const solution = solver.solve(validate[1]);

    if (solution === false) {
      return res.json({ error: "Puzzle cannot be solved" });
    }

    res.json({ solution: solution });
  });
};
