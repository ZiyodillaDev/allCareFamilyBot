const { Router } = require("express");
const fileUpload = require("../middlewares/fileUpload");
const {
  doctorAdd,
  doctorDelete,
  doctorEdit,
  doctorGet,
  doctorGetAll,
  doctorGetOne,
  doctorSearch,
} = require("../controller/doctor.controller");

const router = new Router();

router.post("/doctor", fileUpload, doctorAdd);
router.get("/doctor/:skip/:limit", doctorGetAll);
router.get("/doctorAll", doctorGet);
router.get("/doctor/:id", doctorGetOne);
router.put("/doctor/:id", fileUpload, doctorEdit);
router.delete("/doctor/:id", doctorDelete);
router.get("/searchDoctor/:search", doctorSearch);

module.exports = router;
