const Service = require("../../src/models/service");
const Clinic = require("../../src/models/clinic");

exports.serviceAdd = async (req, res) => {
  const { name, cost, clinicID } = req.body;
  const { imageName: img } = req;

  const servises = await Service.create({
    name,
    cost,
    clinicID,
    img,
  });

  const clinic = await Clinic.findById(clinicID);
  if (!clinic) {
    return res.status(404).json({ message: "Clinic not found" });
  }
  try {
    await Clinic.findByIdAndUpdate(clinicID, {
      $push: {
        clinicServices: servises._id,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }

  res.status(201).json({ message: "Service added successfully" });
};

exports.serviceGetAll = async (req, res) => {
  const skip = req.params["skip"].split("=")[1];
  const limit = req.params["limit"].split("=")[1];
  const s = (skip - 1) * limit;
  const servises = await Service.find()
    .skip(s)
    .limit(limit)
    .populate("clinicID");

  const allData = await Service.find();
  const total_page = Math.ceil(allData.length / limit);

  res.status(200).json({ data: servises, total_page });
};

exports.serviceGet = async (req, res) => {
  const allData = await Service.find().populate("clinicID");

  res.status(200).json({ data: allData });
};

exports.serviceGetOne = async (req, res) => {
  const { id } = req.params;
  const service = await Service.findById(id).populate("clinicID");

  res.status(200).json({ data: service });
};

exports.serviceEdit = async (req, res) => {
  const { id } = req.params;
  const { name, cost, clinicID } = req.body;
  const { imageName: img } = req;
  await Service.findByIdAndUpdate(id, {
    $set: {
      name,
      cost,
      clinicID,
      img,
    },
  });

  res.status(200).json({ message: "Updated service" });
};

exports.serviceDelete = async (req, res) => {
  const { id } = req.params;
  await Service.findByIdAndDelete(id);

  res.status(200).json({ message: "Deleted service" });
};
