const Pills = require("../../src/models/pill");
const Pharmacy = require("../../src/models/pharmacy");

exports.pillAdd = async (req, res) => {
  const { name, cost, total, pharmacyID } = req.body;
  const { imageName: img } = req;

  const pills = await Pills.create({
    name,
    cost,
    total,
    pharmacyID,
    img,
  });

  try {
    await Pharmacy.findByIdAndUpdate(pharmacyID, {
      $push: {
        pharmacyPills: pills._id,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }

  res.status(201).json({ message: "Pills added successfully" });
};

exports.pillGetAll = async (req, res) => {
  const skip = req.params["skip"].split("=")[1];
  const limit = req.params["limit"].split("=")[1];
  const s = (skip - 1) * limit;
  const pills = await Pills.find().skip(s).limit(limit).populate("pharmacyID");

  const allData = await Pills.find();
  const total_page = Math.ceil(allData.length / limit);

  res.status(200).json({ data: pills, total_page });
};

exports.pillGet = async (req, res) => {
  const allData = await Pills.find().populate("pharmacyID");

  res.status(200).json({ data: allData });
};

exports.pillGetOne = async (req, res) => {
  const { id } = req.params;
  const pill = await Pills.findById(id).populate("pharmacyID");

  res.status(200).json({ data: pill });
};

exports.pillEdit = async (req, res) => {
  const { id } = req.params;
  const { name, cost, total, pharmacyID } = req.body;
  const { imageName: img } = req;
  await Pills.findByIdAndUpdate(id, {
    $set: {
      name,
      cost,
      total,
      pharmacyID,
      img,
    },
  });

  res.status(200).json({ message: "Updated pill" });
};

exports.pillDelete = async (req, res) => {
  const { id } = req.params;
  await Pills.findByIdAndDelete(id);

  res.status(200).json({ message: "Deleted pill" });
};

exports.pillSearch = async (req, res) => {
  const search = req.params["search"].split("=")[1].toLowerCase();
  const pills = await Pills.find({});

  const searchedPills = pills.filter((pill) =>
    pill.name.toLowerCase().includes(search)
  );

  res.status(200).json({ data: searchedPills });
};
