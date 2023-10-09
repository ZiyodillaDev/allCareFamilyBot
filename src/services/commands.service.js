const { inlinemenuBtn } = require("../helpers/inline-menu.helper");
const mainMenu = require("../utils/main-menu");
const { InlineKeyboard } = require("grammy");

const startService = async (ctx) => {
  await ctx.reply(
    `<b>Good morning <a href="tg://user?id=${ctx.from.id}">${
      ctx.from.first_name
    } ${
      ctx.from.last_name || ""
    }</a>. Welcome to our bot. Login if you have an account. If you don't have an account please register</b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        ...inlinemenuBtn(mainMenu),
        resize_keyboard: true,
      },
    }
  );

  ctx.session.step = "auth";
};

const helpService = async (ctx) => {
  const shareURL = `https://t.me/AllCare_Family_Clinic_Supportbot`;
  const keyboard = new InlineKeyboard().url("Support Bot", shareURL);
  await ctx.reply(
    `Are you struggling or have any questions❓\n \n We have support bot contact with us✅`,
    {
      parse_mode: "HTML",
      reply_markup: keyboard,
    }
  );
};

const shareService = async (ctx) => {
  const shareURL = `https://t.me/share/url?url=https://t.me/AllCare_Family_Clinic_bot`;
  const keyboard = new InlineKeyboard().url("Share Bot", shareURL);
  await ctx.replyWithPhoto(
    "https://telegra.ph/file/b58bf5310e124e462572b.jpg",
    {
      caption: `Dear user, you can care about the health of your loved ones by sending this bot to them. \n \n 🧑‍⚕️Solve the world's toughest medical problems with our bot \n \n 🚀This is a bot that cares about your health while wishing you good health`,
      parse_mode: "HTML",
      reply_markup: keyboard,
    }
  );
};

module.exports = { startService, shareService, helpService };
