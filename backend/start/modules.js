require("express-async-errors");
const express = require("express");
const cors = require("cors");
const fileUload = require("express-fileupload");

const routes = require("../router");

const modules = (app) => {
  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use(fileUload());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(`${process.cwd()}/uploads`));
  app.use(routes);

  app.use((error, req, res, next) => {
    res.status(500).json({ message: "Internal Server Error" });
  });
};

module.exports = modules;
