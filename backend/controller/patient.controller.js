const Patients = require("../../src/models/patient");

exports.patientAdd = async (req, res) => {
  const { email, password, phone, fullName } = req.body;
  const { imageName: img } = req;
let userImg =img || "user_icon.jpg"

 const user =  await Patients.create({
    email,
    password,
    phone,
    fullName,
    img :userImg ,
  });
  res.status(201).json({ message: "Patient added successfully" ,user });
};

exports.patientGetAll = async (req, res) => {
  const skip = req.params["skip"].split("=")[1];
  const limit = req.params["limit"].split("=")[1];
  const s = (skip - 1) * limit;
  const patients = await Patients.find()
    .skip(s)
    .limit(limit)
    .populate("patientPharmacyOrders patientOrders");

  const allData = await Patients.find();
  const total_page = Math.ceil(allData.length / limit);

  res.status(200).json({ data: patients, total_page });
};

exports.patientGet = async (req, res) => {
  const allData = await Patients.find().populate(
    "patientPharmacyOrders patientOrders"
  );

  res.status(200).json({ data: allData });
};

exports.patientGetOne = async (req, res) => {
  const { id } = req.params;
  const patient = await Patients.findById(id).populate(
    "patientPharmacyOrders patientOrders"
  );

  res.status(200).json({ data: patient });
};

exports.patientEdit = async (req, res) => {
  const { id } = req.params;
  const { email, password, phone, fullName } = req.body;
  const { imageName: img } = req;
  await Patients.findByIdAndUpdate(id, {
    $set: {
      email,
      password,
      phone,
      fullName,
      img,
    },
  });

  res.status(200).json({ message: "Updated patient" });
};

exports.patientDelete = async (req, res) => {
  const { id } = req.params;
  await Patients.findByIdAndDelete(id);

  res.status(200).json({ message: "Deleted patient" });
};

exports.patientSearch = async (req, res) => {
  const search = req.params["search"].split("=")[1].toLowerCase();
  const patients = await Patients.find({});

  const searchedPatients = patients.filter((patient) =>
    patient.fullName.toLowerCase().includes(search)
  );

  res.status(200).json({ data: searchedPatients });
};
