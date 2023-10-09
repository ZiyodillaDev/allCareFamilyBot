const Doctors = require("../../src/models/doctor");
const Clinics = require("../../src/models/clinic");
const Patients = require("../../src/models/patient");
const Orders = require("../../src/models/order");

exports.orderAdd = async (req, res) => {
  const {
    scheduledDay,
    scheduledHour,
    serviceID,
    clinicID,
    doctorID,
    patientID,
  } = req.body;

  const orders = await Orders.create({
    scheduledDay,
    scheduledHour,
    serviceID,
    clinicID,
    doctorID,
    patientID,
  });
  try {
    await Clinics.findByIdAndUpdate(clinicID, {
      $push: {
        clinicOrders: orders._id,
      },
    });
    await Doctors.findByIdAndUpdate(doctorID, {
      $push: {
        doctorOrders: orders._id,
      },
    });
    await Patients.findByIdAndUpdate(patientID, {
      $push: {
        patientOrders: orders._id,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }

  res.status(201).json({ message: "Order added successfully" });
};

exports.orderGetAll = async (req, res) => {
  const skip = req.params["skip"].split("=")[1];
  const limit = req.params["limit"].split("=")[1];
  const s = (skip - 1) * limit;
  const orders = await Orders.find()
    .skip(s)
    .limit(limit)
    .populate("serviceID clinicID doctorID patientID");

  const allData = await Orders.find();
  const total_page = Math.ceil(allData.length / limit);

  res.status(200).json({ data: orders, total_page });
};

exports.orderGet = async (req, res) => {
  const allData = await Orders.find().populate(
    "serviceID clinicID doctorID patientID"
  );

  res.status(200).json({ data: allData });
};

exports.orderGetOne = async (req, res) => {
  const { id } = req.params;
  const order = await Orders.findById(id).populate(
    "serviceID clinicID doctorID patientID"
  );

  res.status(200).json({ data: order });
};

exports.orderEdit = async (req, res) => {
  const { id } = req.params;
  const {
    scheduledDay,
    scheduledHour,
    serviceID,
    clinicID,
    doctorID,
    patientID,
  } = req.body;
  await Orders.findByIdAndUpdate(id, {
    $set: {
      scheduledDay,
      scheduledHour,
      serviceID,
      clinicID,
      doctorID,
      patientID,
    },
  });

  res.status(200).json({ message: "Updated order" });
};

exports.orderDelete = async (req, res) => {
  const { id } = req.params;
  await Orders.findByIdAndDelete(id);

  res.status(200).json({ message: "Deleted order" });
};

exports.orderStatusEdit = async (req, res) => {
  const { id } = req.params;
  const status = true;
  await Orders.findByIdAndUpdate(id, {
    $set: {
      status,
    },
  });

  res.status(200).json({ message: "Updated stauts order" });
};
