const { model, Schema } = require("mongoose");

const doctorSchema = new Schema(
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
    status: {
      type: Boolean,
      default: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    img: {
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
    doctorOrders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    doctorServiceID: {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
    salary: {
      type: String,
    },
    clinicID: {
      type: Schema.Types.ObjectId,
      ref: "Clinic",
    },
  },
  { timestamps: true }
);

module.exports = model("Doctor", doctorSchema);
