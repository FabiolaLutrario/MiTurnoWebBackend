const User = require("./User");
const Turn = require("./Turn");
const BranchOffice = require("./BranchOffice");
const Horary = require("./Horary");
const Role = require("./Role");

Turn.belongsTo(User, { as: "user" });
Turn.belongsTo(BranchOffice, { as: "branch_office" });
Turn.belongsTo(Horary, { as: "horary" });
User.belongsTo(BranchOffice, { as: "branch_office" });
User.belongsTo(Role, { foreignKey: "role_id", as: "role" });
Turn.belongsTo(BranchOffice, {
  foreignKey: "branch_office_id",
  as: "branchOffice",
});

module.exports = { Turn, User, BranchOffice, Horary, Role };
