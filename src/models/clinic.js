const { model, Schema } = require("mongoose");

const clinicSchema = new Schema(
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
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    location: {
      type: String,
    },
    workingDays: {
      type: String,
      required: true,
    },
    workingHours: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    clinicDoctors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
    clinicServices: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    clinicOrders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    clinicPharmacyOrders: [
      {
        type: Schema.Types.ObjectId,
        ref: "PharmacyOrder",
      },
    ],
    clinicPharmacy: {
      type: Schema.Types.ObjectId,
      ref: "Pharmacy",
    },
  },
  { timestamps: true }
);

module.exports = model("Clinic", clinicSchema);
