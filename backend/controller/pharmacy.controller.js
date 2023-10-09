const Pharmacy = require("../../src/models/pharmacy");
const Clinics = require("../../src/models/clinic");

exports.pharmacyAdd = async (req, res) => {
  const { name, clinicID, location, workingDays, workingHours, phone } =
    req.body;
  const { imageName: img } = req;

  const pharmacy = await Pharmacy.create({
    name,
    clinicID,
    location,
    workingDays,
    workingHours,
    phone,
    img,
  });
  try {
    await Clinics.findByIdAndUpdate(clinicID, {
      $push: {
        clinicPharmacy: pharmacy._id,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }

  res.status(201).json({ message: "Pharmacy added successfully" });
};

exports.pharmacyGetAll = async (req, res) => {
  const skip = req.params["skip"].split("=")[1];
  const limit = req.params["limit"].split("=")[1];
  const s = (skip - 1) * limit;
  const pharmacy = await Pharmacy.find()
    .skip(s)
    .limit(limit)
    .populate("clinicID pharmacyPills");

  const allData = await Pharmacy.find();
  const total_page = Math.ceil(allData.length / limit);

  res.status(200).json({ data: pharmacy, total_page });
};

exports.pharmacyGet = async (req, res) => {
  const allData = await Pharmacy.find().populate("clinicID pharmacyPills");

  res.status(200).json({ data: allData });
};

exports.pharmacyGetOne = async (req, res) => {
  const { id } = req.params;
  const pharmacy = await Pharmacy.findById(id).populate(
    "clinicID pharmacyPills"
  );

  res.status(200).json({ data: pharmacy });
};

exports.pharmacyEdit = async (req, res) => {
  const { id } = req.params;
  const { name, clinicID, location, workingDays, workingHours, phone } =
    req.body;
  const { imageName: img } = req;
  await Pharmacy.findByIdAndUpdate(id, {
    $set: {
      name,
      clinicID,
      location,
      workingDays,
      workingHours,
      phone,
      img,
    },
  });

  res.status(200).json({ message: "Updated pharmacy" });
};

exports.pharmacyDelete = async (req, res) => {
  const { id } = req.params;
  await Pharmacy.findByIdAndDelete(id);

  res.status(200).json({ message: "Deleted pharmacy" });
};

exports.pharmacySearch = async (req, res) => {
  const search = req.params["search"].split("=")[1].toLowerCase();
  const pharmacy = await Pharmacy.find({});

  const searchedPharmacy = pharmacy.filter((pharmacy) =>
    pharmacy.name.toLowerCase().includes(search)
  );

  res.status(200).json({ data: searchedPharmacy });
};
