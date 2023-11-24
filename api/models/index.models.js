const User = require("./User.models");
const Turn = require("./Turn.models");
const BranchOffice = require("./BranchOffice.models");
const Horary = require("./Horary.models");
const Role = require("./Role.models");

Turn.belongsTo(User, { foreignKey: "user_id", as: "user" });
Turn.belongsTo(Horary, { foreignKey: "horary_id", as: "horary" });
Turn.belongsTo(BranchOffice, {
  foreignKey: "branch_office_id",
  as: "branchOffice",
});
User.belongsTo(BranchOffice, {
  foreignKey: "branch_office_id",
  as: "branchOffice",
});
User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

module.exports = { Turn, User, BranchOffice, Horary, Role };
