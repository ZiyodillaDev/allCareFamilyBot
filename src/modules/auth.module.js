const { Router } = require("@grammyjs/router");
const { loginService, registerService } = require("../services/auth.service");
const router = new Router((ctx) => ctx.session.step);
const authStep = router.route("auth");

authStep.on("callback_query:data", async (ctx) => {
  if ("🔒 Login" == ctx.callbackQuery.data) {
    loginService(ctx);
  } else if ("🔐 Register" == ctx.callbackQuery.data) {
    registerService(ctx);
  }
});

module.exports = router;
