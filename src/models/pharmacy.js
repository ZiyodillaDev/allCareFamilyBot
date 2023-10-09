const { model, Schema } = require("mongoose");

const pharmacySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    clinicID: {
      type: Schema.Types.ObjectId,
      ref: "Clinic",
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
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    pharmacyPills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Pill",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Pharmacy", pharmacySchema);
