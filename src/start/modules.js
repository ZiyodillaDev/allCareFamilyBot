const { session } = require("grammy");
const commands = require("../utils/commands");
const commandsModule = require("../modules/commands.module");
const authModule = require("../modules/auth.module");
const adminModule = require("../modules/admin.module");
const clinicCrudModule = require("../modules/crud-clinic.module");
const doctorCrudModule = require("../modules/crud-doctor.module");
const all = (bot) => {
  bot.use(session({ initial: () => ({ step: "start" }) }));

  commands(bot);
  bot.use(commandsModule);
  bot.use(authModule);
  bot.use(adminModule);
  bot.use(clinicCrudModule);
  bot.use(doctorCrudModule);
};
module.exports = all;
