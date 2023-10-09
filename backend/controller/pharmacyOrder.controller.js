const Clinics = require("../../src/models/clinic");
const Patients = require("../../src/models/patient");
const PharmacyOrders = require("../../src/models/order");

exports.pharmacyOrderAdd = async (req, res) => {
  const { cost, clinicID, patientID } = req.body;

  const orders = await PharmacyOrders.create({
    cost,
    clinicID,
    patientID,
  });
  try {
    await Clinics.findByIdAndUpdate(clinicID, {
      $push: {
        clinicPharmacyOrders: orders._id,
      },
    });
    await Patients.findByIdAndUpdate(patientID, {
      $push: {
        patientPharmacyOrders: orders._id,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }

  res.status(201).json({ message: "Pharmacy Order added successfully" });
};

exports.pharmacyOrderGetAll = async (req, res) => {
  const skip = req.params["skip"].split("=")[1];
  const limit = req.params["limit"].split("=")[1];
  const s = (skip - 1) * limit;
  const orders = await PharmacyOrders.find()
    .skip(s)
    .limit(limit)
    .populate("clinicID patientID");

  const allData = await PharmacyOrders.find();
  const total_page = Math.ceil(allData.length / limit);

  res.status(200).json({ data: orders, total_page });
};

exports.pharmacyOrderGet = async (req, res) => {
  const allData = await PharmacyOrders.find().populate("clinicID patientID");

  res.status(200).json({ data: allData });
};

exports.pharmacyOrderGetOne = async (req, res) => {
  const { id } = req.params;
  const order = await PharmacyOrders.findById(id).populate(
    "clinicID patientID"
  );

  res.status(200).json({ data: order });
};

exports.pharmacyOrderEdit = async (req, res) => {
  const { id } = req.params;
  const { cost, clinicID, patientID } = req.body;
  await Orders.findByIdAndUpdate(id, {
    $set: {
      cost,
      clinicID,
      patientID,
    },
  });

  res.status(200).json({ message: "Updated pharmacy order" });
};

exports.pharmacyOrderDelete = async (req, res) => {
  const { id } = req.params;
  await PharmacyOrders.findByIdAndDelete(id);

  res.status(200).json({ message: "Deleted pharmacy order" });
};
