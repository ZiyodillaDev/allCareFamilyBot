const { model, Schema } = require("mongoose");

const orderSchema = new Schema(
  {
    scheduledDay: {
      type: String,
      required: true,
    },
    scheduledHour: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    serviceID: {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
    clinicID: {
      type: Schema.Types.ObjectId,
      ref: "Clinic",
    },
    doctorID: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    patientID: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
  },
  { timestamps: true }
);

module.exports = model("Order", orderSchema);
