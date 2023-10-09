const { model, Schema } = require("mongoose");

const orderSchema = new Schema(
  {
    cost: {
      type: Number,
      required: true,
    },
    clinicID: {
      type: Schema.Types.ObjectId,
      ref: "Clinic",
    },
    patientID: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
  },
  { timestamps: true }
);

module.exports = model("PharmacyOrder", orderSchema);
