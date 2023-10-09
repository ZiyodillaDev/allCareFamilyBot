const { Router } = require("express");
const fileUpload = require("../middlewares/fileUpload");
const {
  patientAdd,
  patientDelete,
  patientEdit,
  patientGet,
  patientGetAll,
  patientGetOne,
  patientSearch,
} = require("../controller/patient.controller");

const router = new Router();

router.post("/patient", fileUpload, patientAdd);
router.get("/patient/:skip/:limit", patientGetAll);
router.get("/patientAll", patientGet);
router.get("/patient/:id", patientGetOne);
router.put("/patient/:id", fileUpload, patientEdit);
router.delete("/patient/:id", patientDelete);
router.get("/searchPatient/:search", patientSearch);

module.exports = router;
