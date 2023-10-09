const { Router } = require("@grammyjs/router");
const { Bot } = require("grammy");
const {
  getDoctor,
  postDoctorName,
  postDoctorImg,
  postDoctorEmail,
  postDoctorPassword,
  postDoctorPhone,
  postDoctorDays,
  postDoctorHours,
  postDoctorService,
  postDoctorClinic,
  postDoctorSubmition,
  getDoctorNext,
  getDoctorPrev,
  putClinic,
  putClinicNext,
  putClinicPrev,
  putClinicSingle,
  putClinicImg,
  putClinicName,
  putClinicEmail,
  putClinicPassword,
  putClinicPhone,
  putClinicLocation,
  putClinicDays,
  putClinicHours,
  deleteClinic,
  deleteClinicNext,
  deleteClinicPrev,
  deleteClinicSingle,
} = require("../services/doctor-crud.service");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const sharp = require("sharp");
const {
  adminStatisticsService,
  ClinicService,
  DoctorService,
  PatientService,
} = require("../services/admin.service");
const router = new Router((ctx) => ctx.session.step);
const bot = new Bot(process.env.BotToken);
const doctorCrudStep = router.route("doctorCrud");
const DoctorName = router.route("DoctorName");
const DoctorImage = router.route("DoctorImage");
const DoctorEmail = router.route("DoctorEmail");
const DoctorPassword = router.route("DoctorPassword");
const DoctorPhone = router.route("DoctorPhone");
const DoctorDays = router.route("DoctorDays");
const DoctorHours = router.route("DoctorHours");
const DoctorServise = router.route("DoctorServise");
const DoctorClinic = router.route("DoctorClinic");
const DoctorSubmition = router.route("DoctorSubmition");
const PutDoctorImg = router.route("PutDoctorImg");
const PutDoctorName = router.route("PutDoctorName");
const PutDoctorEmail = router.route("PutDoctorEmail");
const PutDoctorPassword = router.route("PutDoctorPassword");
const PutDoctorPhone = router.route("PutDoctorPhone");
const PutDoctorLocation = router.route("PutDoctorLocation");
const PutDoctorDays = router.route("PutDoctorDays");
const PutDoctorHours = router.route("PutDoctorHours");
const Doctors = require("../models/doctor");
const { menuBtn } = require("../helpers/menu.helper");
const adminMenu = require("../utils/admin-menu");

doctorCrudStep.on("message", async (ctx) => {
  if ("📊 Statistics" == ctx.message?.text) {
    adminStatisticsService(ctx);
  } else if ("🏥 Clinics" == ctx.message?.text) {
    ClinicService(ctx);
  } else if ("👨‍⚕️ Doctors" == ctx.message?.text) {
    DoctorService(ctx);
  } else if ("🤒 Patients" == ctx.message?.text) {
    PatientService(ctx);
  }
});

doctorCrudStep.on("callback_query:data", async (ctx) => {
  // Clinics GET
  if ("👨‍⚕️ Get All Doctors" == ctx.callbackQuery.data) {
    getDoctor(ctx);
  }
  // get clinic (next,prev)
  else if ("Next⏩" == ctx.callbackQuery.data) {
    getDoctorNext(ctx);
  } else if ("⏪Previous" == ctx.callbackQuery.data) {
    getDoctorPrev(ctx);
  }
  // Clinics POST
  else if ("🪄 Create Doctor" == ctx.callbackQuery.data) {
    postDoctorName(ctx);
  }
  // Clinics PUT
  else if ("✏️ Edit Doctor" == ctx.callbackQuery.data) {
    putClinic(ctx);
  }
  // update clinic (next,prev)
  else if ("Next▶️" == ctx.callbackQuery.data) {
    putClinicNext(ctx);
  } else if ("◀️Previous" == ctx.callbackQuery.data) {
    putClinicPrev(ctx);
  }
  // update clinic start
  else if (
    "Update✏️" ==
    ctx.callbackQuery.message.reply_markup.inline_keyboard[0][0].text
  ) {
    ctx.session.editClinicID = ctx.callbackQuery.data;
    putClinicSingle(ctx);
  }
  //edit *
  else if ("🖼Picture of Clinic" == ctx.callbackQuery.data) {
    putClinicImg(ctx);
  } else if ("🏥Name of Clinic" == ctx.callbackQuery.data) {
    putClinicName(ctx);
  } else if ("✉️Email of Clinic" == ctx.callbackQuery.data) {
    putClinicEmail(ctx);
  } else if ("🔒Password of Clinic" == ctx.callbackQuery.data) {
    putClinicPassword(ctx);
  } else if ("📞Phone of Clinic" == ctx.callbackQuery.data) {
    putClinicPhone(ctx);
  } else if ("📍Location of Clinic" == ctx.callbackQuery.data) {
    putClinicLocation(ctx);
  } else if ("📆Working Days of Clinic" == ctx.callbackQuery.data) {
    putClinicDays(ctx);
  } else if ("🕰Working Hours of Clinic" == ctx.callbackQuery.data) {
    putClinicHours(ctx);
  }
  // Clinics DELETE
  else if ("🗑 Delete Clinic" == ctx.callbackQuery.data) {
    deleteClinic(ctx);
  }
  // delete clinic (next,prev)
  else if ("Next➡️" == ctx.callbackQuery.data) {
    deleteClinicNext(ctx);
  } else if ("⬅️Previous" == ctx.callbackQuery.data) {
    deleteClinicPrev(ctx);
  }
  // Delete single
  else if (
    "Delete🗑" ==
    ctx.callbackQuery.message.reply_markup.inline_keyboard[0][0].text
  ) {
    ctx.session.deleteClinicID = ctx.callbackQuery.data;
    deleteClinicSingle(ctx);
  }
});

// Create ********************************

DoctorName.on(":text", async (ctx) => {
  ctx.session.DoctorName = ctx.message.text;
  postDoctorImg(ctx);
});

DoctorImage.on(":photo", async (ctx) => {
  const photoFileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  const file = await bot.api.getFile(photoFileId);
  const filePath = file.file_path;
  const photoUrl = `https://api.telegram.org/file/bot${process.env.BotToken}/${filePath}`;
  const ext = path.extname(file.file_path.split("/")[1]);
  const fileName = `${uuid()}${ext}`;
  const filePathBig = path.join(`${process.cwd()}/uploads/${fileName}`);

  const response = await axios({
    method: "GET",
    url: photoUrl,
    responseType: "arraybuffer",
  });

  const imageBuffer = response.data;
  const processedImageBuffer = await sharp(imageBuffer)
    .resize(800)
    .jpeg({ quality: 90 })
    .toBuffer();

  fs.writeFileSync(filePathBig, processedImageBuffer);

  ctx.session.DoctorImage = photoFileId;
  ctx.session.DoctorImageDataBase = fileName;
  postDoctorEmail(ctx);
});

DoctorImage.on(":text", async (ctx) => {
  ctx.session.DoctorImage = ctx.message.text;
  postDoctorEmail(ctx);
});

DoctorEmail.on(":text", async (ctx) => {
  ctx.session.DoctorEmail = ctx.message.text;
  postDoctorPassword(ctx);
});

DoctorPassword.on(":text", async (ctx) => {
  ctx.session.DoctorPassword = ctx.message.text;
  postDoctorPhone(ctx);
});

DoctorPhone.on("message", async (ctx) => {
  ctx.session.DoctorPhone =
    ctx.message.text || ctx.message?.contact?.phone_number;
  postDoctorDays(ctx);
});

DoctorDays.on(":text", async (ctx) => {
  ctx.session.DoctorDays = ctx.message.text;
  postDoctorHours(ctx);
});

DoctorHours.on(":text", async (ctx) => {
  ctx.session.DoctorHours = ctx.message.text;
  postDoctorService(ctx);
});

DoctorServise.on("callback_query:data", async (ctx) => {
  ctx.session.doctorServiceID = ctx.callbackQuery.data;
  ctx.session.doctorServiceText = ctx.callbackQuery.callback_data;
  postDoctorClinic(ctx);
  console.log(ctx.session.doctorServiceText);
});

DoctorClinic.on("callback_query:data", async (ctx) => {
  ctx.session.doctorClinicID = ctx.callbackQuery.data;
  ctx.session.doctorClinicText =
    ctx.callbackQuery.message.reply_markup.inline_keyboard[0][0].text;
  postDoctorSubmition(ctx);
});

DoctorSubmition.on("callback_query:data", async (ctx) => {
  if (ctx.callbackQuery.data == "Yes Confirm✅") {
    const doctor = new Doctors({
      img: ctx.session.DoctorImageDataBase,
      fullName: ctx.session.DoctorName,
      email: ctx.session.DoctorEmail,
      password: ctx.session.DoctorPassword,
      phone: ctx.session.DoctorPhone,
      workingDays: ctx.session.DoctorDays,
      workingHours: ctx.session.DoctorHours,
      doctorServiceID: ctx.session.doctorServiceID,
      clinicID: ctx.session.doctorClinicID,
    });
    await doctor.save();
    await ctx.reply(`<b>Doctor created successfully✅</b>`, {
      parse_mode: "HTML",
    });
    DoctorService(ctx);
  } else if (ctx.callbackQuery.data == "No Cancel❌") {
    await ctx.reply(
      `<b>Creating Clinic Cancelled❌ Please try again to create</b>`,
      {
        parse_mode: "HTML",
      }
    );
    DoctorService(ctx);
  }
});

// Update ********************************
PutDoctorImg.on(":photo", async (ctx) => {
  const photoFileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  const file = await bot.api.getFile(photoFileId);
  const filePath = file.file_path;
  const photoUrl = `https://api.telegram.org/file/bot${process.env.BotToken}/${filePath}`;
  const ext = path.extname(file.file_path.split("/")[1]);
  const fileName = `${uuid()}${ext}`;
  const filePathBig = path.join(`${process.cwd()}/uploads/${fileName}`);

  const response = await axios({
    method: "GET",
    url: photoUrl,
    responseType: "arraybuffer",
  });

  const imageBuffer = response.data;
  const processedImageBuffer = await sharp(imageBuffer)
    .resize(800)
    .jpeg({ quality: 90 })
    .toBuffer();

  fs.writeFileSync(filePathBig, processedImageBuffer);

  await Clinics.findByIdAndUpdate(ctx.session.editClinicID, {
    $set: {
      img: photoFileId,
    },
  });
  await ctx.reply("Successfully updated Clinic's image✅", {
    reply_markup: {
      ...menuBtn(adminMenu),
      resize_keyboard: true,
    },
  });
  ClinicService(ctx);
});

PutDoctorImg.on(":text", async (ctx) => {
  await Clinics.findByIdAndUpdate(ctx.session.editClinicID, {
    $set: {
      img: ctx.message.text,
    },
  });
  await ctx.reply("Successfully updated Clinic's image✅", {
    reply_markup: {
      ...menuBtn(adminMenu),
      resize_keyboard: true,
    },
  });
  ClinicService(ctx);
});

PutDoctorName.on(":text", async (ctx) => {
  await Clinics.findByIdAndUpdate(ctx.session.editClinicID, {
    $set: {
      name: ctx.message.text,
    },
  });
  await ctx.reply("Successfully updated Clinic's name✅", {
    reply_markup: {
      ...menuBtn(adminMenu),
      resize_keyboard: true,
    },
  });
  ClinicService(ctx);
});

PutDoctorEmail.on(":text", async (ctx) => {
  await Clinics.findByIdAndUpdate(ctx.session.editClinicID, {
    $set: {
      email: ctx.message.text,
    },
  });
  await ctx.reply("Successfully updated Clinic's email✅", {
    reply_markup: {
      ...menuBtn(adminMenu),
      resize_keyboard: true,
    },
  });
  ClinicService(ctx);
});

PutDoctorPassword.on(":text", async (ctx) => {
  await Clinics.findByIdAndUpdate(ctx.session.editClinicID, {
    $set: {
      password: ctx.message.text,
    },
  });
  await ctx.reply("Successfully updated Clinic's password✅", {
    reply_markup: {
      ...menuBtn(adminMenu),
      resize_keyboard: true,
    },
  });
  ClinicService(ctx);
});

PutDoctorPhone.on("message", async (ctx) => {
  await Clinics.findByIdAndUpdate(ctx.session.editClinicID, {
    $set: {
      phone: ctx.message.text || ctx.message?.contact?.phone_number,
    },
  });
  await ctx.reply("Successfully updated Clinic's phone✅", {
    reply_markup: {
      ...menuBtn(adminMenu),
      resize_keyboard: true,
    },
  });
  ClinicService(ctx);
});

PutDoctorLocation.on("message", async (ctx) => {
  const latitude = ctx.message?.location?.latitude;
  const longitude = ctx.message?.location?.longitude;
  // response to get location

  if (latitude && longitude) {
    const response = await axios({
      method: "GET",
      url: `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=87f526f534114673b84ec3e7d9b3adda`,
    });
    const locationFromMap = response.data.results[0].formatted;
    await Clinics.findByIdAndUpdate(ctx.session.editClinicID, {
      $set: {
        location: locationFromMap,
      },
    });
  } else {
    await Clinics.findByIdAndUpdate(ctx.session.editClinicID, {
      $set: {
        location: ctx.message.text,
      },
    });
  }

  await ctx.reply("Successfully updated Clinic's location✅", {
    reply_markup: {
      ...menuBtn(adminMenu),
      resize_keyboard: true,
    },
  });
  ClinicService(ctx);
});

PutDoctorDays.on(":text", async (ctx) => {
  await Clinics.findByIdAndUpdate(ctx.session.editClinicID, {
    $set: {
      workingDays: ctx.message.text,
    },
  });
  await ctx.reply("Successfully updated Clinic's working days✅", {
    reply_markup: {
      ...menuBtn(adminMenu),
      resize_keyboard: true,
    },
  });
  ClinicService(ctx);
});

PutDoctorHours.on(":text", async (ctx) => {
  await Clinics.findByIdAndUpdate(ctx.session.editClinicID, {
    $set: {
      workingHours: ctx.message.text,
    },
  });
  await ctx.reply("Successfully updated Clinic's working hours✅", {
    reply_markup: {
      ...menuBtn(adminMenu),
      resize_keyboard: true,
    },
  });
  ClinicService(ctx);
});

module.exports = router;
