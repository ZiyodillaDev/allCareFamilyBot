const Doctors = require("../../src/models/doctor");
const Clinics = require("../../src/models/clinic");

exports.doctorAdd = async (req, res) => {
  const {
    email,
    password,
    phone,
    fullName,
    workingDays,
    workingHours,
    salary,
    clinicID,
    doctorServiceID,
  } = req.body;
  const { imageName: img } = req;

  const doctors = await Doctors.create({
    email,
    password,
    phone,
    fullName,
    workingDays,
    workingHours,
    salary,
    clinicID,
    doctorServiceID,
    img,
  });

  // Get the clinic document.
  const clinic = await Clinics.findById(clinicID);
  if (!clinic) {
    return res.status(404).json({ message: "Clinic not found" });
  }

  try {
    await Clinics.findByIdAndUpdate(clinicID, {
      $push: {
        clinicDoctors: doctors._id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }

  res.status(201).json({ message: "Doctor added successfully" });
};

exports.doctorGetAll = async (req, res) => {
  const skip = req.params["skip"].split("=")[1];
  const limit = req.params["limit"].split("=")[1];
  const s = (skip - 1) * limit;
  const doctors = await Doctors.find()
    .skip(s)
    .limit(limit)
    .populate("clinicID doctorServiceID doctorOrders");

  const allData = await Doctors.find();
  const total_page = Math.ceil(allData.length / limit);

  res.status(200).json({ data: doctors, total_page });
};

exports.doctorGet = async (req, res) => {
  const allData = await Doctors.find().populate(
    "clinicID doctorServiceID doctorOrders"
  );

  res.status(200).json({ data: allData });
};

exports.doctorGetOne = async (req, res) => {
  const { id } = req.params;
  const doctor = await Doctors.findById(id).populate(
    "clinicID doctorServiceID doctorOrders"
  );

  res.status(200).json({ data: doctor });
};

exports.doctorEdit = async (req, res) => {
  const { id } = req.params;
  const {
    email,
    password,
    phone,
    fullName,
    workingDays,
    workingHours,
    salary,
    clinicID,
    doctorServiceID,
  } = req.body;
  const { imageName: img } = req;
  await Doctors.findByIdAndUpdate(id, {
    $set: {
      email,
      password,
      phone,
      fullName,
      workingDays,
      workingHours,
      salary,
      clinicID,
      doctorServiceID,
      img,
    },
  });

  res.status(200).json({ message: "Updated doctor" });
};

exports.doctorDelete = async (req, res) => {
  const { id } = req.params;
  await Doctors.findByIdAndDelete(id);

  res.status(200).json({ message: "Deleted doctor" });
};

exports.doctorSearch = async (req, res) => {
  const search = req.params["search"].split("=")[1].toLowerCase();
  const doctors = await Doctors.find({});

  const searchedDoctors = doctors.filter((doctor) =>
    doctor.fullName.toLowerCase().includes(search)
  );

  res.status(200).json({ data: searchedDoctors });
};
