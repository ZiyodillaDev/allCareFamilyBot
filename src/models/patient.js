const { model, Schema } = require("mongoose");

const patientSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    fullName: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    patientOrders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    patientPharmacyOrders: [
      {
        type: Schema.Types.ObjectId,
        ref: "PharmacyOrder",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Patient", patientSchema);
