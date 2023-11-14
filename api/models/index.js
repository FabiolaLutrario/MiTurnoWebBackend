const User = require("./User");
const Turn = require("./Turn");
const BranchOffice = require("./BranchOffice");
Turn.belongsTo(User, { as: "user" });
Turn.belongsTo(BranchOffice, { as: "branchOffice" });
User.belongsTo(BranchOffice, { as: "branchOffice" });
module.exports = { Turn, User, BranchOffice };
