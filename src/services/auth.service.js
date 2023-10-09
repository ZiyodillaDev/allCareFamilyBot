const { loginMenu, registerMenu } = require("../utils/auth-menu");
const { menuBtn } = require("../helpers/menu.helper");

const loginService = async (ctx) => {
  await ctx.reply(
    `<b>Welcome to AllCare Family Login Page. Who do you want to login as?</b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        ...menuBtn(loginMenu),
        resize_keyboard: true,
      },
    }
  );

  ctx.session.step = "login";
};

const registerService = async (ctx) => {
  await ctx.reply(
    `<b>Welcome to AllCare Family Register Page. You can register as a patient. If you want to enter as another role please login or ask from <a href="tg://user?id=${process.env.AdminID}">Admin</a> to create an account for you</b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        ...menuBtn(registerMenu),
        resize_keyboard: true,
      },
    }
  );

  ctx.session.step = "register";
};

module.exports = { loginService, registerService };
