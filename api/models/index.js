const User = require("./User");
const Turn = require("./Turn");
const BranchOffice = require("./BranchOffice");
const Horary = require("./Horary");
const Role = require("./Role");

Turn.belongsTo(User, { foreignKey: "user_id", as: "user" });
Turn.belongsTo(Horary, { foreignKey: "horary_id", as: "horary" });
Turn.belongsTo(BranchOffice, {
  foreignKey: "branch_office_id",
  as: "branchOffice",
});
User.belongsTo(BranchOffice, {
  foreignKey: "branch_office_id",
  as: "branch_office",
});
User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

module.exports = { Turn, User, BranchOffice, Horary, Role };
