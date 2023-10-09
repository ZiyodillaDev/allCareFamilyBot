const { Router } = require("express");
const fileUpload = require("../middlewares/fileUpload");
const {
  clinicAdd,
  clinicDelete,
  clinicEdit,
  clinicGet,
  clinicGetAll,
  clinicGetOne,
  clinicSearch,
} = require("../controller/clinic.controller");

const router = new Router();

router.post("/clinic", fileUpload, clinicAdd);
router.get("/clinic/:skip/:limit", clinicGetAll);
router.get("/clinicAll", clinicGet);
router.get("/clinic/:id/:skip/:limit", clinicGetOne);
router.put("/clinic/:id", fileUpload, clinicEdit);
router.delete("/clinic/:id", clinicDelete);
router.get("/searchClinic/:search", clinicSearch);

module.exports = router;
