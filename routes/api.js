const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const puzzle = req.body.puzzle;
    const coord = req.body.coordinate;
    const value = req.body.value;
    if (!puzzle || !coord || !value)
      return res.json({ error: "Required field(s) missing" });
    // check if puzzle is valid
    const validate = solver.validate(puzzle);
    if (validate[0] === false) return res.json(validate[1]);
    // check if coordinate and value is valid
    const coordRe = /^[a-iA-I]\d$/gi;
    const valueRe = /^\d$/;
    if (coordRe.test(coord) === false)
      return res.json({ error: "Invalid coordinate" });
    if (valueRe.test(value) === false)
      return res.json({ error: "Invalid value" });
    // seperate row and column
    const row = coord.split("")[0];
    const col = coord.split("")[1];
    // check conflict
    let conflicts = [];
    const checkRow = solver.checkRow(validate[1], row, col, value);
    const checkCol = solver.checkCol(validate[1], row, col, value);
    const checkReg = solver.checkReg(validate[1], row, col, value);
    if (checkRow !== true) conflicts.push(checkRow);
    if (checkCol !== true) conflicts.push(checkCol);
    if (checkReg !== true) conflicts.push(checkReg);
    if (conflicts.length !== 0)
      return res.json({ valid: false, conflict: conflicts });
    // return true if true
    res.json({ valid: true });
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;
    // error on no puzzle
    if (!puzzle) return res.json({ error: "Required field missing" });
    // validate puzzle
    const validate = solver.validate(puzzle);
    if (validate[0] === false) return res.json(validate[1]);
    // error if puzzle cannot be solved
    const solution = solver.solve(validate[1]);
    if (solution === false)
      return res.json({ error: "Puzzle cannot be solved" });
    // return puzzle solution
    res.json({ solution: solution });
  });
};
