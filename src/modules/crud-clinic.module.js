const { Router } = require("@grammyjs/router");
const { Bot } = require("grammy");
const {
  getClinic,
  postClinicName,
  postClinicImg,
  postClinicEmail,
  postClinicPassword,
  postClinicPhone,
  postClinicLocation,
  postClinicDays,
  postClinicHours,
  postClinicSubmition,
  getClinicNext,
  getClinicPrev,
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
} = require("../services/clinic-crud.service");
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
const clinicCrudStep = router.route("clinicCrud");
const ClinicName = router.route("ClinicName");
const ClinicImage = router.route("ClinicImage");
const ClinicEmail = router.route("ClinicEmail");
const ClinicPassword = router.route("ClinicPassword");
const ClinicPhone = router.route("ClinicPhone");
const ClinicLocation = router.route("ClinicLocation");
const ClinicDays = router.route("ClinicDays");
const ClinicHours = router.route("ClinicHours");
const ClinicSubmition = router.route("ClinicSubmition");
const PutClinicImg = router.route("PutClinicImg");
const PutClinicName = router.route("PutClinicName");
const PutClinicEmail = router.route("PutClinicEmail");
const PutClinicPassword = router.route("PutClinicPassword");
const PutClinicPhone = router.route("PutClinicPhone");
const PutClinicLocation = router.route("PutClinicLocation");
const PutClinicDays = router.route("PutClinicDays");
const PutClinicHours = router.route("PutClinicHours");
const Clinics = require("../models/clinic");
const { menuBtn } = require("../helpers/menu.helper");
const adminMenu = require("../utils/admin-menu");

clinicCrudStep.on("message", async (ctx) => {
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

clinicCrudStep.on("callback_query:data", async (ctx) => {
  // Clinics GET
  if ("🏨 Get All Clinics" == ctx.callbackQuery.data) {
    getClinic(ctx);
  }
  // get clinic (next,prev)
  else if ("Next⏩" == ctx.callbackQuery.data) {
    getClinicNext(ctx);
  } else if ("⏪Previous" == ctx.callbackQuery.data) {
    getClinicPrev(ctx);
  }
  // Clinics POST
  else if ("🪄 Create Clinic" == ctx.callbackQuery.data) {
    postClinicName(ctx);
  }
  // Clinics PUT
  else if ("✏️ Edit Clinic" == ctx.callbackQuery.data) {
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

ClinicName.on(":text", async (ctx) => {
  ctx.session.ClinicName = ctx.message.text;
  postClinicImg(ctx);
});

ClinicImage.on(":photo", async (ctx) => {
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

  ctx.session.ClinicImage = photoFileId;
  ctx.session.ClinicImageDataBase = fileName;
  console.log(fileName);
  postClinicEmail(ctx);
});

ClinicImage.on(":text", async (ctx) => {
  ctx.session.ClinicImage = ctx.message.text;
  postClinicEmail(ctx);
});

ClinicEmail.on(":text", async (ctx) => {
  ctx.session.ClinicEmail = ctx.message.text;
  postClinicPassword(ctx);
});

ClinicPassword.on(":text", async (ctx) => {
  ctx.session.ClinicPassword = ctx.message.text;
  postClinicPhone(ctx);
});

ClinicPhone.on("message", async (ctx) => {
  ctx.session.ClinicPhone =
    ctx.message.text || ctx.message?.contact?.phone_number;
  postClinicLocation(ctx);
});

ClinicLocation.on("message", async (ctx) => {
  const latitude = ctx.message?.location?.latitude;
  const longitude = ctx.message?.location?.longitude;
  // response to get location

  if (latitude && longitude) {
    const response = await axios({
      method: "GET",
      url: `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=87f526f534114673b84ec3e7d9b3adda`,
    });
    const locationFromMap = response.data.results[0].formatted;
    ctx.session.ClinicLocation = locationFromMap;
  } else {
    ctx.session.ClinicLocation = ctx.message.text;
  }

  postClinicDays(ctx);
});

ClinicDays.on(":text", async (ctx) => {
  ctx.session.ClinicDays = ctx.message.text;
  postClinicHours(ctx);
});

ClinicHours.on(":text", async (ctx) => {
  ctx.session.ClinicHours = ctx.message.text;
  postClinicSubmition(ctx);
});

ClinicSubmition.on("callback_query:data", async (ctx) => {
  if (ctx.callbackQuery.data == "Yes Confirm✅") {
    const clinic = new Clinics({
      img: ctx.session.ClinicImageDataBase,
      name: ctx.session.ClinicName,
      email: ctx.session.ClinicEmail,
      password: ctx.session.ClinicPassword,
      phone: ctx.session.ClinicPhone,
      location: ctx.session.ClinicLocation,
      workingDays: ctx.session.ClinicDays,
      workingHours: ctx.session.ClinicHours,
    });
    await clinic.save();
    await ctx.reply(`<b>Clinic created successfully✅</b>`, {
      parse_mode: "HTML",
    });
    ClinicService(ctx);
  } else if (ctx.callbackQuery.data == "No Cancel❌") {
    await ctx.reply(
      `<b>Creating Clinic Cancelled❌ Please try again to create</b>`,
      {
        parse_mode: "HTML",
      }
    );
    ClinicService(ctx);
  }
});

// Update ********************************
PutClinicImg.on(":photo", async (ctx) => {
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

PutClinicImg.on(":text", async (ctx) => {
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

PutClinicName.on(":text", async (ctx) => {
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

PutClinicEmail.on(":text", async (ctx) => {
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

PutClinicPassword.on(":text", async (ctx) => {
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

PutClinicPhone.on("message", async (ctx) => {
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

PutClinicLocation.on("message", async (ctx) => {
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

PutClinicDays.on(":text", async (ctx) => {
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

PutClinicHours.on(":text", async (ctx) => {
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
