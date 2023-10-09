const { model, Schema } = require("mongoose");

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    img: {
      type: String,
    },
    clinicID: {
      type: Schema.Types.ObjectId,
      ref: "Clinic",
    },
  },
  { timestamps: true }
);

module.exports = model("Service", serviceSchema);
