// Bot
const { Bot } = require("grammy");
const dotenv = require("dotenv/config");

const start = require("./start/run");
const all = require("./start/modules");

const token = process.env.BotToken;
const bot = new Bot(token);
all(bot);
start(bot);

// Backend
const express = require("express");
const app = express();

require("../backend/start/modules")(app);
require("../backend/start/run")(app);
