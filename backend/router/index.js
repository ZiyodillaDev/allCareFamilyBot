const clinic = require("./clinic.routes");
const doctor = require("./doctor.routes");
const order = require("./order.routes");
const patient = require("./patient.routes");
const pharmacy = require("./pharmacy.routes");
const pharmacyOrders = require("./pharmacyOrder.routes");
const pill = require("./pill.routes");
const service = require("./service.routes");

module.exports = [
  clinic,
  doctor,
  order,
  patient,
  pharmacy,
  pharmacyOrders,
  pill,
  service,
];
