const User = require("./User");
const Turn = require("./Turn");
const BranchOffice = require("./BranchOffice");
const Horary = require("./Horary");
const Role = require("./Role");
const BranchOfficeService = require("./BranchOffice");

Turn.belongsTo(User, { as: "user" });
Turn.belongsTo(BranchOffice, { as: "branchOffice" });
Turn.belongsTo(Horary, { as: "horary" });
User.belongsTo(BranchOffice, { as: "branchOffice" });
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
User.belongsTo(Role, { foreignKey: "initialRoleId", as: "initialRole" });

module.exports = { Turn, User, BranchOffice, Horary, Role };
