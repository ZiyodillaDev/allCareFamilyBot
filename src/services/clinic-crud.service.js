const clinics = require("../models/clinic");
const { menuBtn } = require("../helpers/menu.helper");
const { inlinemenuBtn } = require("../helpers/inline-menu.helper");
const { InlineKeyboard, Keyboard } = require("grammy");
const { ClinicService } = require("./admin.service");
const adminMenu = require("../utils/admin-menu");

// get
const getClinic = async (ctx) => {
  const allClinics = await clinics.find().skip(0).limit(4);
  const ClinicsCount = await clinics.find();
  await ctx.reply(
    `Hi <a href="tg://user?id=${process.env.AdminID}">Admin</a> 👋, Welcome to AllCare Family Clinics Page. Here is Clinics🏨`,
    {
      parse_mode: "HTML",
    }
  );
  for (const element of allClinics) {
    await ctx.replyWithPhoto("https://sqwdsfgb.onrender.com/" + element.img, {
      caption: `🏥Name: ${element.name}\n✉️Email: ${element.email}\n🔒Password: ${element.password}\n📞Phone: ${element.phone}\n📍Location: ${element.location}\n📆Working Days: ${element.workingDays}\n🕰Working Hours: ${element.workingHours}`,
    });
  }

  ClinicsCount.length > 4
    ? await ctx.reply(`To see more clinics select next button`, {
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard().row().text("Next⏩"),
      })
    : null;
};

const getClinicNext = async (ctx) => {
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

const getClinicPrev = async (ctx) => {
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

// post

const postClinicName = async (ctx) => {
  await ctx.reply(
    `<b>Hi <a href="tg://user?id=${process.env.AdminID}">Admin</a> 👋, Welcome to AllCare Family Clinics Page. To create Clinic first Send me Clinic's name</b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        remove_keyboard: true,
      },
    }
  );
  ctx.session.step = "ClinicName";
};

const postClinicImg = async (ctx) => {
  await ctx.reply(
    `<b>Good. Now  Send me Clinic's Image. You can send Url or From your Device</b>`,
    {
      parse_mode: "HTML",
    }
  );
  ctx.session.step = "ClinicImage";
};

const postClinicEmail = async (ctx) => {
  await ctx.reply(
    `<b>Well Done. Now  Send me Clinic's Email.(Clinics login through this email)</b>`,
    {
      parse_mode: "HTML",
    }
  );
  ctx.session.step = "ClinicEmail";
};

const postClinicPassword = async (ctx) => {
  await ctx.reply(
    `<b>Excellent. Now Send me Clinic's Password.(Clinics login through this password)</b>`,
    {
      parse_mode: "HTML",
    }
  );
  ctx.session.step = "ClinicPassword";
};

const postClinicPhone = async (ctx) => {
  await ctx.reply(
    `<b>Good. Now Send me Clinic's Phone Number. You can click "Send Contact" button or type it</b>`,
    {
      reply_markup: new Keyboard()
        .row()
        .requestContact("Send Contact")
        .resized(),
      parse_mode: "HTML",
    }
  );
  ctx.session.step = "ClinicPhone";
};

const postClinicLocation = async (ctx) => {
  await ctx.reply(
    `<b>Almost Done. Now Send me Clinic's Location. You can click "Send Location" button or type it</b>`,
    {
      reply_markup: new Keyboard()
        .row()
        .requestLocation("Send Location")
        .resized(),
      parse_mode: "HTML",
    }
  );
  ctx.session.step = "ClinicLocation";
};

const postClinicDays = async (ctx) => {
  await ctx.reply(
    `<b>Excellent. Now Send me Clinic's Working Days.\nEx:Mon-Sat or Mon-Wed-Fri</b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        remove_keyboard: true,
      },
    }
  );
  ctx.session.step = "ClinicDays";
};

const postClinicHours = async (ctx) => {
  await ctx.reply(
    `<b>Finally, Send me Clinic's Working Hours.\nEx:10:00am-8:00pm or 10:00-19:00 </b>`,
    {
      parse_mode: "HTML",
    }
  );
  ctx.session.step = "ClinicHours";
};

const postClinicSubmition = async (ctx) => {
  try {
    await ctx.replyWithPhoto(ctx.session.ClinicImage, {
      reply_markup: new InlineKeyboard()
        .text("Yes Confirm✅")
        .text("No Cancel❌"),
      caption: `🏥Name: ${ctx.session.ClinicName}\n✉️Email: ${ctx.session.ClinicEmail}\n🔒Password: ${ctx.session.ClinicPassword}\n📞Phone: ${ctx.session.ClinicPhone}\n📍Location: ${ctx.session.ClinicLocation}\n📆Working Days: ${ctx.session.ClinicDays}\n🕰Working Hours: ${ctx.session.ClinicHours}\n\nIs All Information Correct?`,
    });
    ctx.session.step = "ClinicSubmition";
  } catch (error) {
    await ctx.reply("Error while creating clinic. Please try again");
    ClinicService(ctx);
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
  getClinic,
  getClinicNext,
  getClinicPrev,
  postClinicName,
  postClinicImg,
  postClinicEmail,
  postClinicPassword,
  postClinicPhone,
  postClinicLocation,
  postClinicDays,
  postClinicHours,
  postClinicSubmition,
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
