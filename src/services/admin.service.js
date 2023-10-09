const adminMenu = require("../utils/admin-menu");
const { menuBtn } = require("../helpers/menu.helper");
const { inlinemenuBtn } = require("../helpers/inline-menu.helper");
const statisticsMenu = require("../utils/statistics-menu");
const clinics = require("../models/clinic");
const doctors = require("../models/doctor");
const pharmacys = require("../models/pharmacy");
const patients = require("../models/patient");
const orders = require("../models/order");
const pharmacyOrders = require("../models/pharmacyOrder");
const { InlineKeyboard } = require("grammy");

const adminService = async (ctx) => {
  await ctx.reply(
    `<b>Welcome to AllCare Family Admin Page. Please pick one of the given section to continue</b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        ...menuBtn(adminMenu),
        resize_keyboard: true,
      },
    }
  );

  ctx.session.step = "admin";
};

// Statistics

const adminStatisticsService = async (ctx) => {
  const allClinics = await clinics.find();
  const activeClinics = await clinics.find({ status: true });
  const allDoctors = await doctors.find();
  const activeDoctors = await doctors.find({ status: true });
  const allPharmacy = await pharmacys.find();
  const activePharmacy = await pharmacys.find({ status: true });
  const allPatients = await patients.find();
  const activePatients = await patients.find({ status: true });
  const allOrders = await orders.find();
  const allPharmacyOrders = await pharmacyOrders.find();
  await ctx.reply(
    `<b>Hi <a href="tg://user?id=${process.env.AdminID}">Admin</a> 👋, Welcome to AllCare Family Statistics Page 📊 \n \n🏥Clinics Statistics\nAll Clinics - ${allClinics.length}           Active Clinics - ${activeClinics.length}\n \n👨‍⚕️Doctors Statistics\nAll Doctors - ${allDoctors.length}           Active Doctors - ${activeDoctors.length}\n \n🏪Pharmacy Statistics\nAll Pharmacies - ${allPharmacy.length}           Active Pharmacies - ${activePharmacy.length}\n \n🤒Patients Statistics\nAll Patients - ${allPatients.length}           Active Patients - ${activePatients.length}\n \n🚚Orders Statistics\nAll Orders - ${allOrders.length}           Pharmacy Orders - ${allPharmacyOrders.length}</b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        ...inlinemenuBtn(statisticsMenu),
        resize_keyboard: true,
      },
    }
  );
};

// Statistics Daily
const dailyStatistics = async (ctx) => {
  const now = new Date();
  const todayStart = now.setHours(0, 0, 0, 0);
  const todayEnd = now.setHours(23, 59, 59, 999);
  const allClinics = await clinics.find({
    createdAt: { $gte: todayStart, $lt: todayEnd },
  });
  const allDoctors = await doctors.find({
    createdAt: { $gte: todayStart, $lt: todayEnd },
  });
  const allPharmacy = await pharmacys.find({
    createdAt: { $gte: todayStart, $lt: todayEnd },
  });
  const allPatients = await patients.find({
    createdAt: { $gte: todayStart, $lt: todayEnd },
  });
  const allOrders = await orders.find({
    createdAt: { $gte: todayStart, $lt: todayEnd },
  });
  const allPharmacyOrders = await pharmacyOrders.find({
    createdAt: { $gte: todayStart, $lt: todayEnd },
  });
  await ctx.reply(
    `<b>Here is today's statistics📊. You can see another day's statistics by clicking ⏪previous or next⏩ buttons \n \n🏥Clinics Statistics\nClinics joined today - ${allClinics.length}\n \n👨‍⚕️Doctors Statistics\nDoctors joined today - ${allDoctors.length}\n \n🏪Pharmacy Statistics\nPharmacies joined today - ${allPharmacy.length}\n \n🤒Patients Statistics\nPatients joined today - ${allPatients.length}\n \n🚚Orders Statistics\nAll Orders done today - ${allOrders.length}\nPharmacy Orders done today - ${allPharmacyOrders.length}</b>`,
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard().row().text("⏪Previous Day"),
    }
  );
};

const previousDailyStatistics = async (ctx) => {
  if (!ctx.session.dayprev) {
    ctx.session.dayprev = 1;
  } else {
    ctx.session.dayprev += 1;
  }
  const now = new Date();
  const previousDayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - ctx.session.dayprev,
    0,
    0,
    0,
    0
  );
  const previousDayEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - ctx.session.dayprev,
    23,
    59,
    59,
    999
  );

  const allClinics = await clinics.find({
    createdAt: { $gte: previousDayStart, $lt: previousDayEnd },
  });
  const allDoctors = await doctors.find({
    createdAt: { $gte: previousDayStart, $lt: previousDayEnd },
  });
  const allPharmacy = await pharmacys.find({
    createdAt: { $gte: previousDayStart, $lt: previousDayEnd },
  });
  const allPatients = await patients.find({
    createdAt: { $gte: previousDayStart, $lt: previousDayEnd },
  });
  const allOrders = await orders.find({
    createdAt: { $gte: previousDayStart, $lt: previousDayEnd },
  });
  const allPharmacyOrders = await pharmacyOrders.find({
    createdAt: { $gte: previousDayStart, $lt: previousDayEnd },
  });
  await ctx.reply(
    `<b>Here is ${
      ctx.session.dayprev >= 1
        ? (previousDayStart + "").split("00")[0]
        : "Today"
    }'s statistics📊. You can see another day's statistics by clicking ⏪previous or next⏩ buttons \n \n🏥Clinics Statistics\nClinics joined ${
      ctx.session.dayprev >= 1
        ? (previousDayStart + "").split("00")[0]
        : "today"
    } - ${allClinics.length}\n \n👨‍⚕️Doctors Statistics\nDoctors joined ${
      ctx.session.dayprev >= 1
        ? (previousDayStart + "").split("00")[0]
        : "today"
    } - ${allDoctors.length}\n \n🏪Pharmacy Statistics\nPharmacies joined ${
      ctx.session.dayprev >= 1
        ? (previousDayStart + "").split("00")[0]
        : "today"
    } - ${allPharmacy.length}\n \n🤒Patients Statistics\nPatients joined ${
      ctx.session.dayprev >= 1
        ? (previousDayStart + "").split("00")[0]
        : "today"
    } - ${allPatients.length}\n \n🚚Orders Statistics\nAll Orders done ${
      ctx.session.dayprev >= 1
        ? (previousDayStart + "").split("00")[0]
        : "today"
    } - ${allOrders.length}\nPharmacy Orders done ${
      ctx.session.dayprev >= 1
        ? (previousDayStart + "").split("00")[0]
        : "today"
    } - ${allPharmacyOrders.length}</b>`,
    ctx.session.dayprev >= 1
      ? {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard()
            .row()
            .text("⏪Previous Day")
            .text("Next Day⏩"),
        }
      : {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard().row().text("⏪Previous Day"),
        }
  );
};

const nextDailyStatistics = async (ctx) => {
  if (!ctx.session.dayprev) {
    ctx.session.dayprev = 1;
  } else {
    ctx.session.dayprev -= 1;
  }
  const now = new Date();
  const previousDayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - ctx.session.dayprev,
    0,
    0,
    0,
    0
  );
  const previousDayEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - ctx.session.dayprev,
    23,
    59,
    59,
    999
  );

  const allClinics = await clinics.find({
    createdAt: { $gte: previousDayStart, $lt: previousDayEnd },
  });
  const allDoctors = await doctors.find({
    createdAt: { $gte: previousDayStart, $lt: previousDayEnd },
  });
  const allPharmacy = await pharmacys.find({
    createdAt: { $gte: previousDayStart, $lt: previousDayEnd },
  });
  const allPatients = await patients.find({
    createdAt: { $gte: previousDayStart, $lt: previousDayEnd },
  });
  const allOrders = await orders.find({
    createdAt: { $gte: previousDayStart, $lt: previousDayEnd },
  });
  const allPharmacyOrders = await pharmacyOrders.find({
    createdAt: { $gte: previousDayStart, $lt: previousDayEnd },
  });
  await ctx.reply(
    `<b>Here is ${
      ctx.session.dayprev >= 1
        ? (previousDayStart + "").split("00")[0]
        : "Today"
    }'s statistics📊. You can see another day's statistics by clicking ⏪previous or next⏩ buttons \n \n🏥Clinics Statistics\nClinics joined ${
      ctx.session.dayprev >= 1
        ? (previousDayStart + "").split("00")[0]
        : "today"
    } - ${allClinics.length}\n \n👨‍⚕️Doctors Statistics\nDoctors joined ${
      ctx.session.dayprev >= 1
        ? (previousDayStart + "").split("00")[0]
        : "today"
    } - ${allDoctors.length}\n \n🏪Pharmacy Statistics\nPharmacies joined ${
      ctx.session.dayprev >= 1
        ? (previousDayStart + "").split("00")[0]
        : "today"
    } - ${allPharmacy.length}\n \n🤒Patients Statistics\nPatients joined ${
      ctx.session.dayprev >= 1
        ? (previousDayStart + "").split("00")[0]
        : "today"
    } - ${allPatients.length}\n \n🚚Orders Statistics\nAll Orders done ${
      ctx.session.dayprev >= 1
        ? (previousDayStart + "").split("00")[0]
        : "today"
    } - ${allOrders.length}\nPharmacy Orders done ${
      ctx.session.dayprev >= 1
        ? (previousDayStart + "").split("00")[0]
        : "today"
    } - ${allPharmacyOrders.length}</b>`,
    ctx.session.dayprev >= 1
      ? {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard()
            .row()
            .text("⏪Previous Day")
            .text("Next Day⏩"),
        }
      : {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard().row().text("⏪Previous Day"),
        }
  );
};

// Statistics Monthly

const monthlyStatistics = async (ctx) => {
  const now = new Date();
  const monthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const allClinics = await clinics.find({
    createdAt: { $gte: monthStart, $lt: monthEnd },
  });

  const allDoctors = await doctors.find({
    createdAt: { $gte: monthStart, $lt: monthEnd },
  });
  const allPharmacy = await pharmacys.find({
    createdAt: { $gte: monthStart, $lt: monthEnd },
  });
  const allPatients = await patients.find({
    createdAt: { $gte: monthStart, $lt: monthEnd },
  });
  const allOrders = await orders.find({
    createdAt: { $gte: monthStart, $lt: monthEnd },
  });
  const allPharmacyOrders = await pharmacyOrders.find({
    createdAt: { $gte: monthStart, $lt: monthEnd },
  });
  await ctx.reply(
    `<b>Here is this month's statistics📊. You can see another month's statistics by clicking ⏪previous or next⏩ buttons \n \n🏥Clinics Statistics\nClinics joined this month - ${allClinics.length}\n \n👨‍⚕️Doctors Statistics\nDoctors joined this month - ${allDoctors.length}\n \n🏪Pharmacy Statistics\nPharmacies joined this month - ${allPharmacy.length}\n \n🤒Patients Statistics\nPatients joined this month - ${allPatients.length}\n \n🚚Orders Statistics\nAll Orders done this month - ${allOrders.length}\nPharmacy Orders done this month - ${allPharmacyOrders.length}</b>`,
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard().row().text("⏪Previous Month"),
    }
  );
};

const previousMonthlyStatistics = async (ctx) => {
  if (!ctx.session.monthprev) {
    ctx.session.monthprev = 1;
  } else {
    ctx.session.monthprev += 1;
  }
  const now = new Date();

  // Get the start and end of the previous month.
  const previousMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - ctx.session.monthprev,
    2
  );
  const previousMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth() - ctx.session.monthprev + 1,
    1
  );

  const allClinics = await clinics.find({
    createdAt: { $gte: previousMonthStart, $lt: previousMonthEnd },
  });

  const allDoctors = await doctors.find({
    createdAt: { $gte: previousMonthStart, $lt: previousMonthEnd },
  });
  const allPharmacy = await pharmacys.find({
    createdAt: { $gte: previousMonthStart, $lt: previousMonthEnd },
  });
  const allPatients = await patients.find({
    createdAt: { $gte: previousMonthStart, $lt: previousMonthEnd },
  });
  const allOrders = await orders.find({
    createdAt: { $gte: previousMonthStart, $lt: previousMonthEnd },
  });
  const allPharmacyOrders = await pharmacyOrders.find({
    createdAt: { $gte: previousMonthStart, $lt: previousMonthEnd },
  });
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[previousMonthStart.getMonth()];
  await ctx.reply(
    `<b>Here is ${month}'s statistics📊. You can see another day's statistics by clicking ⏪previous or next⏩ buttons \n \n🏥Clinics Statistics\nClinics joined in ${month} - ${allClinics.length}\n \n👨‍⚕️Doctors Statistics\nDoctors joined in ${month} - ${allDoctors.length}\n \n🏪Pharmacy Statistics\nPharmacies joined in ${month} - ${allPharmacy.length}\n \n🤒Patients Statistics\nPatients joined in ${month} - ${allPatients.length}\n \n🚚Orders Statistics\nAll Orders done in ${month} - ${allOrders.length}\nPharmacy Orders done in ${month} - ${allPharmacyOrders.length}</b>`,
    ctx.session.monthprev >= 1
      ? {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard()
            .row()
            .text("⏪Previous Month")
            .text("Next Month⏩"),
        }
      : {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard().row().text("⏪Previous Month"),
        }
  );
};

const nextMonthlyStatistics = async (ctx) => {
  if (!ctx.session.monthprev) {
    ctx.session.monthprev = 1;
  } else {
    ctx.session.monthprev -= 1;
  }
  const now = new Date();

  // Get the start and end of the previous month.
  const previousMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - ctx.session.monthprev,
    2
  );
  const previousMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth() - ctx.session.monthprev + 1,
    1
  );

  const allClinics = await clinics.find({
    createdAt: { $gte: previousMonthStart, $lt: previousMonthEnd },
  });

  const allDoctors = await doctors.find({
    createdAt: { $gte: previousMonthStart, $lt: previousMonthEnd },
  });
  const allPharmacy = await pharmacys.find({
    createdAt: { $gte: previousMonthStart, $lt: previousMonthEnd },
  });
  const allPatients = await patients.find({
    createdAt: { $gte: previousMonthStart, $lt: previousMonthEnd },
  });
  const allOrders = await orders.find({
    createdAt: { $gte: previousMonthStart, $lt: previousMonthEnd },
  });
  const allPharmacyOrders = await pharmacyOrders.find({
    createdAt: { $gte: previousMonthStart, $lt: previousMonthEnd },
  });
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[previousMonthStart.getMonth()];
  await ctx.reply(
    `<b>Here is ${month}'s statistics📊. You can see another day's statistics by clicking ⏪previous or next⏩ buttons \n \n🏥Clinics Statistics\nClinics joined in ${month} - ${allClinics.length}\n \n👨‍⚕️Doctors Statistics\nDoctors joined in ${month} - ${allDoctors.length}\n \n🏪Pharmacy Statistics\nPharmacies joined in ${month} - ${allPharmacy.length}\n \n🤒Patients Statistics\nPatients joined in ${month} - ${allPatients.length}\n \n🚚Orders Statistics\nAll Orders done in ${month} - ${allOrders.length}\nPharmacy Orders done in ${month} - ${allPharmacyOrders.length}</b>`,
    ctx.session.monthprev >= 1
      ? {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard()
            .row()
            .text("⏪Previous Month")
            .text("Next Month⏩"),
        }
      : {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard().row().text("⏪Previous Month"),
        }
  );
};

// Statistics Yearly
const yearlyStatistics = async (ctx) => {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 2);
  const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
  const allClinics = await clinics.find({
    createdAt: { $gte: yearStart, $lt: yearEnd },
  });
  const allDoctors = await doctors.find({
    createdAt: { $gte: yearStart, $lt: yearEnd },
  });
  const allPharmacy = await pharmacys.find({
    createdAt: { $gte: yearStart, $lt: yearEnd },
  });
  const allPatients = await patients.find({
    createdAt: { $gte: yearStart, $lt: yearEnd },
  });
  const allOrders = await orders.find({
    createdAt: { $gte: yearStart, $lt: yearEnd },
  });
  const allPharmacyOrders = await pharmacyOrders.find({
    createdAt: { $gte: yearStart, $lt: yearEnd },
  });
  await ctx.reply(
    `<b>Here is ${yearStart.getFullYear()}'s statistics📊. You can see another year's statistics by clicking ⏪previous or next⏩ buttons \n \n🏥Clinics Statistics\nClinics joined ${yearStart.getFullYear()} - ${
      allClinics.length
    }\n \n👨‍⚕️Doctors Statistics\nDoctors joined ${yearStart.getFullYear()} - ${
      allDoctors.length
    }\n \n🏪Pharmacy Statistics\nPharmacies joined ${yearStart.getFullYear()} - ${
      allPharmacy.length
    }\n \n🤒Patients Statistics\nPatients joined ${yearStart.getFullYear()} - ${
      allPatients.length
    }\n \n🚚Orders Statistics\nAll Orders done ${yearStart.getFullYear()} - ${
      allOrders.length
    }\nPharmacy Orders done ${yearStart.getFullYear()} - ${
      allPharmacyOrders.length
    }</b>`,
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard().row().text("⏪Previous Year"),
    }
  );
};

const previousYearlyStatistics = async (ctx) => {
  if (!ctx.session.yearprev) {
    ctx.session.yearprev = 1;
  } else {
    ctx.session.yearprev += 1;
  }
  const now = new Date();
  const previousYearStart = new Date(
    now.getFullYear() - ctx.session.yearprev,
    0,
    2
  );
  const previousYearEnd = new Date(
    now.getFullYear() - ctx.session.yearprev + 1,
    0,
    1
  );

  const allClinics = await clinics.find({
    createdAt: { $gte: previousYearStart, $lt: previousYearEnd },
  });

  const allDoctors = await doctors.find({
    createdAt: { $gte: previousYearStart, $lt: previousYearEnd },
  });
  const allPharmacy = await pharmacys.find({
    createdAt: { $gte: previousYearStart, $lt: previousYearEnd },
  });
  const allPatients = await patients.find({
    createdAt: { $gte: previousYearStart, $lt: previousYearEnd },
  });
  const allOrders = await orders.find({
    createdAt: { $gte: previousYearStart, $lt: previousYearEnd },
  });
  const allPharmacyOrders = await pharmacyOrders.find({
    createdAt: { $gte: previousYearStart, $lt: previousYearEnd },
  });

  await ctx.reply(
    `<b>Here is ${previousYearStart.getFullYear()}'s statistics📊. You can see another day's statistics by clicking ⏪previous or next⏩ buttons \n \n🏥Clinics Statistics\nClinics joined in ${previousYearStart.getFullYear()} - ${
      allClinics.length
    }\n \n👨‍⚕️Doctors Statistics\nDoctors joined in ${previousYearStart.getFullYear()} - ${
      allDoctors.length
    }\n \n🏪Pharmacy Statistics\nPharmacies joined in ${previousYearStart.getFullYear()} - ${
      allPharmacy.length
    }\n \n🤒Patients Statistics\nPatients joined in ${previousYearStart.getFullYear()} - ${
      allPatients.length
    }\n \n🚚Orders Statistics\nAll Orders done in ${previousYearStart.getFullYear()} - ${
      allOrders.length
    }\nPharmacy Orders done in ${previousYearStart.getFullYear()} - ${
      allPharmacyOrders.length
    }</b>`,
    ctx.session.yearprev >= 1
      ? {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard()
            .row()
            .text("⏪Previous Year")
            .text("Next Year⏩"),
        }
      : {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard().row().text("⏪Previous Year"),
        }
  );
};

const nextYearlyStatistics = async (ctx) => {
  if (!ctx.session.yearprev) {
    ctx.session.yearprev = 1;
  } else {
    ctx.session.yearprev -= 1;
  }
  const now = new Date();
  const previousYearStart = new Date(
    now.getFullYear() - ctx.session.yearprev,
    0,
    2
  );
  const previousYearEnd = new Date(
    now.getFullYear() - ctx.session.yearprev + 1,
    0,
    1
  );

  const allClinics = await clinics.find({
    createdAt: { $gte: previousYearStart, $lt: previousYearEnd },
  });

  const allDoctors = await doctors.find({
    createdAt: { $gte: previousYearStart, $lt: previousYearEnd },
  });
  const allPharmacy = await pharmacys.find({
    createdAt: { $gte: previousYearStart, $lt: previousYearEnd },
  });
  const allPatients = await patients.find({
    createdAt: { $gte: previousYearStart, $lt: previousYearEnd },
  });
  const allOrders = await orders.find({
    createdAt: { $gte: previousYearStart, $lt: previousYearEnd },
  });
  const allPharmacyOrders = await pharmacyOrders.find({
    createdAt: { $gte: previousYearStart, $lt: previousYearEnd },
  });

  await ctx.reply(
    `<b>Here is ${previousYearStart.getFullYear()}'s statistics📊. You can see another day's statistics by clicking ⏪previous or next⏩ buttons \n \n🏥Clinics Statistics\nClinics joined in ${previousYearStart.getFullYear()} - ${
      allClinics.length
    }\n \n👨‍⚕️Doctors Statistics\nDoctors joined in ${previousYearStart.getFullYear()} - ${
      allDoctors.length
    }\n \n🏪Pharmacy Statistics\nPharmacies joined in ${previousYearStart.getFullYear()} - ${
      allPharmacy.length
    }\n \n🤒Patients Statistics\nPatients joined in ${previousYearStart.getFullYear()} - ${
      allPatients.length
    }\n \n🚚Orders Statistics\nAll Orders done in ${previousYearStart.getFullYear()} - ${
      allOrders.length
    }\nPharmacy Orders done in ${previousYearStart.getFullYear()} - ${
      allPharmacyOrders.length
    }</b>`,
    ctx.session.yearprev >= 1
      ? {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard()
            .row()
            .text("⏪Previous Year")
            .text("Next Year⏩"),
        }
      : {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard().row().text("⏪Previous Year"),
        }
  );
};

// Clinics Service
const ClinicService = async (ctx) => {
  await ctx.reply(
    `Hi <a href="tg://user?id=${process.env.AdminID}">Admin</a> 👋, Welcome to AllCare Family Clinics Page 🏨`,
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard()
        .text("🏨 Get All Clinics")
        .text("🪄 Create Clinic")
        .row()
        .text("✏️ Edit Clinic")
        .text("🗑 Delete Clinic"),
    }
  );
  ctx.session.step = "clinicCrud";
};

// Doctor Service
const DoctorService = async (ctx) => {
  await ctx.reply(
    `Hi <a href="tg://user?id=${process.env.AdminID}">Admin</a> 👋, Welcome to AllCare Family Doctors Page 👨‍⚕️`,
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard()
        .text("👨‍⚕️ Get All Doctors")
        .text("🪄 Create Doctor")
        .row()
        .text("✏️ Edit Doctor")
        .text("🗑 Delete Doctor"),
    }
  );
  ctx.session.step = "doctorCrud";
};

// Patient Service
const PatientService = async (ctx) => {
  await ctx.reply(
    `Hi <a href="tg://user?id=${process.env.AdminID}">Admin</a> 👋, Welcome to AllCare Family Patients Page 🤒`,
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard()
        .text("🤒 Get All Patients")
        .text("🚚 Get All Patients Orders"),
    }
  );
  ctx.session.step = "patientCrud";
};

module.exports = {
  adminService,
  adminStatisticsService,
  dailyStatistics,
  previousDailyStatistics,
  nextDailyStatistics,
  monthlyStatistics,
  previousMonthlyStatistics,
  nextMonthlyStatistics,
  yearlyStatistics,
  previousYearlyStatistics,
  nextYearlyStatistics,
  ClinicService,
  DoctorService,
  PatientService
};
