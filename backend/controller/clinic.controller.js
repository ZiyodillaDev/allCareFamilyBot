const Clinics = require("../../src/models/clinic");

exports.clinicAdd = async (req, res) => {
  const { email, password, phone, name, location, workingDays, workingHours } =
    req.body;
  const { imageName: img } = req;

  Clinics.create({
    email,
    password,
    phone,
    name,
    img,
    location,
    workingDays,
    workingHours,
  });
  res.status(201).json({ message: "Clinic added successfully" });
};

exports.clinicGetAll = async (req, res) => {
  const skip = req.params["skip"].split("=")[1];
  const limit = req.params["limit"].split("=")[1];
  const s = (skip - 1) * limit;
  const clinics = await Clinics.find()
    .skip(s)
    .limit(limit)
    .populate([
      {
        path: "clinicDoctors",
        populate: "doctorServiceID doctorOrders",
      },
      "clinicServices",
      "clinicOrders",
      "clinicPharmacyOrders",
      "clinicPharmacy",
    ]);

  const allData = await Clinics.find();
  const total_page = Math.ceil(allData.length / limit);

  res.status(200).json({ data: clinics, total_page });
};

exports.clinicGet = async (req, res) => {
  const allData = await Clinics.find().populate([
    {
      path: "clinicDoctors",
      populate: "doctorServiceID doctorOrders",
    },
    "clinicServices",
    "clinicOrders",
    "clinicPharmacyOrders",
    "clinicPharmacy",
  ]);

  res.status(200).json({ data: allData });
};

exports.clinicGetOne = async (req, res) => {
  const { id } = req.params;
  const skip = req.params["skip"].split("=")[1];
  const limit = req.params["limit"].split("=")[1];
  const s = (skip - 1) * limit;
  const clinic = await Clinics.findById(id).populate([
    {
      path: "clinicDoctors",
      populate: "doctorServiceID doctorOrders",
      options: {
        skip: s,
        limit: limit,
      },
    },
    {
      path: "clinicServices",
      options: {
        skip: s,
        limit: limit,
      },
    },
    "clinicOrders",
    "clinicPharmacyOrders",
    "clinicPharmacy",
  ]);
  res.status(200).json({ data: clinic });
};

exports.clinicEdit = async (req, res) => {
  const { id } = req.params;
  const { email, password, phone, name, location, workingDays, workingHours } =
    req.body;
  const { imageName: img } = req;
  await Clinics.findByIdAndUpdate(id, {
    $set: {
      email,
      password,
      phone,
      name,
      img,
      location,
      workingDays,
      workingHours,
    },
  });

  res.status(200).json({ message: "Updated Clinic" });
};

exports.clinicDelete = async (req, res) => {
  const { id } = req.params;
  await Clinics.findByIdAndDelete(id);

  res.status(200).json({ message: "Deleted Clinic" });
};

exports.clinicSearch = async (req, res) => {
  const search = req.params["search"].split("=")[1].toLowerCase();
  const clinics = await Clinics.find({});

  const searchedClinics = clinics.filter((clinic) =>
    clinic.name.toLowerCase().includes(search)
  );

  res.status(200).json({ data: searchedClinics });
};
