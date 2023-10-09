const { model, Schema } = require("mongoose");

const pillSchema = new Schema(
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
    total: {
      type: Number,
      required: true,
    },
    pharmacyID: {
      type: Schema.Types.ObjectId,
      ref: "Pharmacy",
    },
  },
  { timestamps: true }
);

module.exports = model("Pill", pillSchema);
