const doctors = require("../models/doctor");
const services = require("../models/service");
const clinics = require("../models/clinic");
const { menuBtn } = require("../helpers/menu.helper");
const { inlinemenuBtn } = require("../helpers/inline-menu.helper");
const { InlineKeyboard, Keyboard } = require("grammy");
const { DoctorService, ClinicService } = require("./admin.service");
const adminMenu = require("../utils/admin-menu");

// get
const getDoctor = async (ctx) => {
  const allDoctors = await doctors
    .find()
    .skip(0)
    .limit(4)
    .populate("doctorServiceID clinicID");
  const DoctorsCount = await doctors.find();
  await ctx.reply(
    `Hi <a href="tg://user?id=${process.env.AdminID}">Admin</a> 👋, Welcome to AllCare Family Doctors Page. Here is Doctors👨‍⚕️`,
    {
      parse_mode: "HTML",
    }
  );
  for (const element of allDoctors) {
    await ctx.replyWithPhoto("https://sqwdsfgb.onrender.com/" + element.img, {
      caption: `👨‍⚕️Full Name: ${element.fullName}\n✉️Email: ${element.email}\n🔒Password: ${element.password}\n📞Phone: ${element.phone}\n💉Service: ${element.doctorServiceID.name}\n💵Salary: ${element.salary}\n📆Working Days: ${element.workingDays}\n🕰Working Hours: ${element.workingHours}\n🏨Clinic: He works in ${element.clinicID.name}`,
    });
  }

  DoctorsCount.length > 4
    ? await ctx.reply(`To see more doctors select next button`, {
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard().row().text("Next⏩"),
      })
    : null;
};

const getDoctorNext = async (ctx) => {
  if (!ctx.session.nextClinic) {
    ctx.session.nextClinic = 1;
  } else {
    ctx.session.nextClinic += 1;
  }
  const allDoctors = await doctors
    .find()
    .skip(0)
    .limit(4)
    .populate("doctorServiceID clinicID");
  const DoctorsCount = await doctors.find();

  for (const element of allDoctors) {
    await ctx.replyWithPhoto("https://sqwdsfgb.onrender.com/" + element.img, {
      caption: `👨‍⚕️Full Name: ${element.fullName}\n✉️Email: ${element.email}\n🔒Password: ${element.password}\n📞Phone: ${element.phone}\n💉Service: ${element.doctorServiceID.name}\n💵Salary: ${element.salary}\n📆Working Days: ${element.workingDays}\n🕰Working Hours: ${element.workingHours}\n🏨Clinic: He works in ${element.clinicID.name}`,
    });
  }
  await ctx.reply(
    `To see more Doctors select next or previous button`,
    DoctorsCount.length > (ctx.session.nextClinic + 1) * 4
      ? {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard()
            .row()
            .text("⏪Previous")
            .text("Next⏩"),
        }
      : {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard().row().text("⏪Previous"),
        }
  );
};

const getDoctorPrev = async (ctx) => {
  if (!ctx.session.nextClinic) {
    ctx.session.nextClinic = 1;
  } else {
    ctx.session.nextClinic -= 1;
  }
  const allDoctors = await doctors
    .find()
    .skip(0)
    .limit(4)
    .populate("doctorServiceID clinicID");
  for (const element of allDoctors) {
    await ctx.replyWithPhoto("https://sqwdsfgb.onrender.com/" + element.img, {
      caption: `👨‍⚕️Full Name: ${element.fullName}\n✉️Email: ${element.email}\n🔒Password: ${element.password}\n📞Phone: ${element.phone}\n💉Service: ${element.doctorServiceID.name}\n💵Salary: ${element.salary}\n📆Working Days: ${element.workingDays}\n🕰Working Hours: ${element.workingHours}\n🏨Clinic: He works in ${element.clinicID.name}`,
    });
  }
  await ctx.reply(
    `To see more Doctors select next or previous button`,
    ctx.session.nextClinic >= 1
      ? {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard()
            .row()
            .text("⏪Previous")
            .text("Next⏩"),
        }
      : {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard().row().text("Next⏩"),
        }
  );
};

// post

const postDoctorName = async (ctx) => {
  await ctx.reply(
    `<b>Hi <a href="tg://user?id=${process.env.AdminID}">Admin</a> 👋, Welcome to AllCare Family Doctors Page. To create Doctor first Send me Doctor's fullname</b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        remove_keyboard: true,
      },
    }
  );
  ctx.session.step = "DoctorName";
};

const postDoctorImg = async (ctx) => {
  await ctx.reply(
    `<b>Good. Now  Send me Doctor's Image. You can send Url or From your Device</b>`,
    {
      parse_mode: "HTML",
    }
  );
  ctx.session.step = "DoctorImage";
};

const postDoctorEmail = async (ctx) => {
  await ctx.reply(
    `<b>Well Done. Now  Send me Doctor's Email.(Doctors login through this email)</b>`,
    {
      parse_mode: "HTML",
    }
  );
  ctx.session.step = "DoctorEmail";
};

const postDoctorPassword = async (ctx) => {
  await ctx.reply(
    `<b>Excellent. Now Send me Doctor's Password.(Doctors login through this password)</b>`,
    {
      parse_mode: "HTML",
    }
  );
  ctx.session.step = "DoctorPassword";
};

const postDoctorPhone = async (ctx) => {
  await ctx.reply(
    `<b>Good. Now Send me Doctor's Phone Number. You can click "Send Contact" button or type it</b>`,
    {
      reply_markup: new Keyboard()
        .row()
        .requestContact("Send Contact")
        .resized(),
      parse_mode: "HTML",
    }
  );
  ctx.session.step = "DoctorPhone";
};

const postDoctorDays = async (ctx) => {
  await ctx.reply(
    `<b>Excellent. Now Send me Doctor's Working Days.\nEx:Mon-Sat or Mon-Wed-Fri</b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        remove_keyboard: true,
      },
    }
  );
  ctx.session.step = "DoctorDays";
};

const postDoctorHours = async (ctx) => {
  await ctx.reply(
    `<b>Now, Send me Doctor's Working Hours.\nEx:10:00am-8:00pm or 10:00-19:00 </b>`,
    {
      parse_mode: "HTML",
    }
  );
  ctx.session.step = "DoctorHours";
};

const postDoctorService = async (ctx) => {
  const Services = await services.find();
  const keyboard = [];

  for (const element of Services) {
    keyboard.push([{ text: "🛠" + element.name, callback_data: element.id }]);
  }

  await ctx.reply(`<b>Good, now select the doctor's service he works in.</b>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });

  ctx.session.step = "DoctorServise";
};

const postDoctorClinic = async (ctx) => {
  const Clinics = await clinics.find();
  const keyboard = [];

  for (const element of Clinics) {
    keyboard.push([{ text: "🏨" + element.name, callback_data: element.id }]);
  }

  await ctx.reply(
    `<b>Finally, now select the doctor's clinic he works in.</b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: keyboard,
      },
    }
  );

  ctx.session.step = "DoctorClinic";
};

const postDoctorSubmition = async (ctx) => {
  try {
    await ctx.replyWithPhoto(ctx.session.DoctorImage, {
      reply_markup: new InlineKeyboard()
        .text("Yes Confirm✅")
        .text("No Cancel❌"),
      caption: `🏥Name: ${ctx.session.DoctorName}\n✉️Email: ${ctx.session.DoctorEmail}\n🔒Password: ${ctx.session.DoctorPassword}\n📞Phone: ${ctx.session.DoctorPhone}\n📆Working Days: ${ctx.session.DoctorDays}\n🕰Working Hours: ${ctx.session.DoctorHours}\n🛠Service: ${ctx.session.doctorServiceText}\n🏨Clinic: ${ctx.session.doctorClinicText}\n\nIs All Information Correct?`,
    });
    ctx.session.step = "DoctorSubmition";
  } catch (error) {
    console.log(error);
    await ctx.reply("Error while creating clinic. Please try again");
    DoctorService(ctx);
  }
};

// Put
const putClinic = async (ctx) => {
  const allClinics = await clinics.find().skip(0).limit(4);
  const ClinicsCount = await clinics.find();
  await ctx.reply(
    `Hi <a href="tg://user?id=${process.env.AdminID}">Admin</a> 👋, Welcome to AllCare Family Clinics Page. Here is Clinics🏨 Which one do you want to update?`,
    {
      parse_mode: "HTML",
    }
  );
  for (const element of allClinics) {
    await ctx.replyWithPhoto("https://sqwdsfgb.onrender.com/" + element.img, {
      caption: `🏥Name: ${element.name}\n✉️Email: ${element.email}\n🔒Password: ${element.password}\n📞Phone: ${element.phone}\n📍Location: ${element.location}\n📆Working Days: ${element.workingDays}\n🕰Working Hours: ${element.workingHours}`,
      reply_markup: new InlineKeyboard().row().text("Update✏️", element.id),
    });
  }
  ClinicsCount.length > 4
    ? await ctx.reply(`To see more clinics select next button`, {
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard().row().text("Next▶️"),
      })
    : null;
};

const putClinicNext = async (ctx) => {
  if (!ctx.session.nextClinic) {
    ctx.session.nextClinic = 1;
  } else {
    ctx.session.nextClinic += 1;
  }
  const allClinics = await clinics
    .find()
    .skip(ctx.session.nextClinic * 4)
    .limit(4);
  const clinicsAll = await clinics.find();
  for (const element of allClinics) {
    await ctx.replyWithPhoto("https://sqwdsfgb.onrender.com/" + element.img, {
      caption: `🏥Name: ${element.name}\n✉️Email: ${element.email}\n🔒Password: ${element.password}\n📞Phone: ${element.phone}\n📍Location: ${element.location}\n📆Working Days: ${element.workingDays}\n🕰Working Hours: ${element.workingHours}`,
      reply_markup: new InlineKeyboard().row().text("Update✏️", element.id),
    });
  }
  await ctx.reply(
    `To see more clinics select next or previous button`,
    clinicsAll.length > (ctx.session.nextClinic + 1) * 4
      ? {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard()
            .row()
            .text("⏪Previous")
            .text("Next⏩"),
        }
      : {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard().row().text("⏪Previous"),
        }
  );
};

const putClinicPrev = async (ctx) => {
  if (!ctx.session.nextClinic) {
    ctx.session.nextClinic = 1;
  } else {
    ctx.session.nextClinic -= 1;
  }
  const allClinics = await clinics
    .find()
    .skip(ctx.session.nextClinic * 4)
    .limit(4);
  for (const element of allClinics) {
    await ctx.replyWithPhoto("https://sqwdsfgb.onrender.com/" + element.img, {
      caption: `🏥Name: ${element.name}\n✉️Email: ${element.email}\n🔒Password: ${element.password}\n📞Phone: ${element.phone}\n📍Location: ${element.location}\n📆Working Days: ${element.workingDays}\n🕰Working Hours: ${element.workingHours}`,
      reply_markup: new InlineKeyboard().row().text("Update✏️", element.id),
    });
  }
  await ctx.reply(
    `To see more clinics select next or previous button`,
    ctx.session.nextClinic >= 1
      ? {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard()
            .row()
            .text("⏪Previous")
            .text("Next⏩"),
        }
      : {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard().row().text("Next⏩"),
        }
  );
};

const putClinicSingle = async (ctx) => {
  const singleClinic = await clinics.findById(ctx.session.editClinicID);
  await ctx.replyWithPhoto(
    "https://sqwdsfgb.onrender.com/" + singleClinic.img,
    {
      caption: `<b>Ok Now Select which part of clinic that you want to update?✏️\n\n🏥Name: ${singleClinic.name}\n✉️Email: ${singleClinic.email}\n🔒Password: ${singleClinic.password}\n📞Phone: ${singleClinic.phone}\n📍Location: ${singleClinic.location}\n📆Working Days: ${singleClinic.workingDays}\n🕰Working Hours: ${singleClinic.workingHours}</b>`,
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard()
        .row()
        .text("🖼Picture of Clinic")
        .text("🏥Name of Clinic")
        .row()
        .text("✉️Email of Clinic")
        .text("🔒Password of Clinic")
        .row()
        .text("📞Phone of Clinic")
        .text("📍Location of Clinic")
        .row()
        .text("📆Working Days of Clinic")
        .text("🕰Working Hours of Clinic"),
    }
  );
};

const putClinicImg = async (ctx) => {
  await ctx.reply(
    `<b>To Change Clinic's Image Please send me Image. You can send Url or From your Device</b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        remove_keyboard: true,
      },
    }
  );
  ctx.session.step = "PutClinicImg";
};

const putClinicName = async (ctx) => {
  await ctx.reply(`<b>To Change Clinic's name Send me new Name</b>`, {
    parse_mode: "HTML",
    reply_markup: {
      remove_keyboard: true,
    },
  });
  ctx.session.step = "PutClinicName";
};

const putClinicEmail = async (ctx) => {
  await ctx.reply(
    `<b>To Change Clinic's Email Please send me new email(Clinics login through this email)</b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        remove_keyboard: true,
      },
    }
  );
  ctx.session.step = "PutClinicEmail";
};

const putClinicPassword = async (ctx) => {
  await ctx.reply(
    `<b>To change Clinic's Password Please send me new password(Clinics login through this password)</b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        remove_keyboard: true,
      },
    }
  );
  ctx.session.step = "PutClinicPassword";
};

const putClinicPhone = async (ctx) => {
  await ctx.reply(
    `<b>To change Clinic's phone Please click "Send Contact" button or type it</b>`,
    {
      reply_markup: new Keyboard()
        .row()
        .requestContact("Send Contact")
        .resized(),
      parse_mode: "HTML",
    }
  );
  ctx.session.step = "PutClinicPhone";
};

const putClinicLocation = async (ctx) => {
  await ctx.reply(
    `<b>To change Clinic's Location Please click "Send Location" button or type it</b>`,
    {
      reply_markup: new Keyboard()
        .row()
        .requestLocation("Send Location")
        .resized(),
      parse_mode: "HTML",
    }
  );
  ctx.session.step = "PutClinicLocation";
};

const putClinicDays = async (ctx) => {
  await ctx.reply(
    `<b>To change Clinic's Working Days Please send me new working days.\nEx:Mon-Sat or Mon-Wed-Fri</b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        remove_keyboard: true,
      },
    }
  );
  ctx.session.step = "PutClinicDays";
};

const putClinicHours = async (ctx) => {
  await ctx.reply(
    `<b>To change Clinic's Working Hours please send me new working hours.\nEx:10:00am-8:00pm or 10:00-19:00 </b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        remove_keyboard: true,
      },
    }
  );
  ctx.session.step = "PutClinicHours";
};

// Delete

const deleteClinic = async (ctx) => {
  const allClinics = await clinics.find().skip(0).limit(4);
  const ClinicsCount = await clinics.find();
  await ctx.reply(
    `Hi <a href="tg://user?id=${process.env.AdminID}">Admin</a> 👋, Welcome to AllCare Family Clinics Page. Here is Clinics🏨 Which one do you want to update?`,
    {
      parse_mode: "HTML",
    }
  );
  for (const element of allClinics) {
    await ctx.replyWithPhoto("https://sqwdsfgb.onrender.com/" + element.img, {
      caption: `🏥Name: ${element.name}\n✉️Email: ${element.email}\n🔒Password: ${element.password}\n📞Phone: ${element.phone}\n📍Location: ${element.location}\n📆Working Days: ${element.workingDays}\n🕰Working Hours: ${element.workingHours}`,
      reply_markup: new InlineKeyboard().row().text("Delete🗑", element.id),
    });
  }
  ClinicsCount.length > 4
    ? await ctx.reply(`To see more clinics select next button`, {
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard().row().text("Next➡️"),
      })
    : null;
};

const deleteClinicNext = async (ctx) => {
  if (!ctx.session.nextClinic) {
    ctx.session.nextClinic = 1;
  } else {
    ctx.session.nextClinic += 1;
  }
  const allClinics = await clinics
    .find()
    .skip(ctx.session.nextClinic * 4)
    .limit(4);
  const clinicsAll = await clinics.find();
  for (const element of allClinics) {
    await ctx.replyWithPhoto("https://sqwdsfgb.onrender.com/" + element.img, {
      caption: `🏥Name: ${element.name}\n✉️Email: ${element.email}\n🔒Password: ${element.password}\n📞Phone: ${element.phone}\n📍Location: ${element.location}\n📆Working Days: ${element.workingDays}\n🕰Working Hours: ${element.workingHours}`,
      reply_markup: new InlineKeyboard().row().text("Delete🗑", element.id),
    });
  }
  await ctx.reply(
    `To see more clinics select next or previous button`,
    clinicsAll.length > (ctx.session.nextClinic + 1) * 4
      ? {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard()
            .row()
            .text("⬅️Previous")
            .text("Next➡️"),
        }
      : {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard().row().text("⬅️Previous"),
        }
  );
};

const deleteClinicPrev = async (ctx) => {
  if (!ctx.session.nextClinic) {
    ctx.session.nextClinic = 1;
  } else {
    ctx.session.nextClinic -= 1;
  }
  const allClinics = await clinics
    .find()
    .skip(ctx.session.nextClinic * 4)
    .limit(4);
  for (const element of allClinics) {
    await ctx.replyWithPhoto("https://sqwdsfgb.onrender.com/" + element.img, {
      caption: `🏥Name: ${element.name}\n✉️Email: ${element.email}\n🔒Password: ${element.password}\n📞Phone: ${element.phone}\n📍Location: ${element.location}\n📆Working Days: ${element.workingDays}\n🕰Working Hours: ${element.workingHours}`,
      reply_markup: new InlineKeyboard().row().text("Delete🗑", element.id),
    });
  }
  await ctx.reply(
    `To see more clinics select next or previous button`,
    ctx.session.nextClinic >= 1
      ? {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard()
            .row()
            .text("⬅️Previous")
            .text("Next➡️"),
        }
      : {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard().row().text("Next➡️"),
        }
  );
};

const deleteClinicSingle = async (ctx) => {
  const singleClinic = await clinics.findByIdAndDelete(
    ctx.session.deleteClinicID
  );
  if (!singleClinic) {
    await ctx.reply("Clinic not found please try again❌", {
      reply_markup: {
        ...menuBtn(adminMenu),
        resize_keyboard: true,
      },
    });
  }
  await ctx.reply("Successfully deleted Clinic ✅", {
    reply_markup: {
      ...menuBtn(adminMenu),
      resize_keyboard: true,
    },
  });
  ClinicService(ctx);
};

module.exports = {
  getDoctor,
  getDoctorNext,
  getDoctorPrev,
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
};
