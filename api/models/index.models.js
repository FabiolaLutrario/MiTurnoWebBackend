const User = require("./User.models");
const Turn = require("./Turn.models");
const BranchOffice = require("./BranchOffice.models");
const Horary = require("./Horary.models");
const Role = require("./Role.models");
const Confirmation = require("./Confirmation.models");
const ReasonCancellation = require("./ReasonCancellation.models");

Turn.belongsTo(User, { foreignKey: "user_id", as: "user" });
Turn.belongsTo(Horary, { foreignKey: "horary_id", as: "horary" });
Turn.belongsTo(BranchOffice, {
  foreignKey: "branch_office_id",
  as: "branch_office",
});
Turn.belongsTo(Confirmation, {
  foreignKey: "confirmation_id",
  as: "confirmation",
});
Turn.belongsTo(ReasonCancellation, { foreignKey: "reason_cancellation_id", as: "reason_cancellation" });
User.belongsTo(BranchOffice, {
  foreignKey: "branch_office_id",
  as: "branch_office",
});
User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

module.exports = { Turn, User, BranchOffice, Horary, Role, Confirmation, ReasonCancellation };
