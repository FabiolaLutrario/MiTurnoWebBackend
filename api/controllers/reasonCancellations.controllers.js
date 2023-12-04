const ReasonCancellation = require("../models/ReasonCancellation.models");

class ReasonCancellationController {
  static getAll(req, res) {
    ReasonCancellation.findAll()
      .then((reasonCancellations) => {
        if (!reasonCancellations) return res.sendStatus(404);
        return res.status(200).send(reasonCancellations);
      })
      .catch((error) => {
        console.error("Error getting reason cancellations:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
}
module.exports = ReasonCancellationController;