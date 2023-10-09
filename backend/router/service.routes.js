const { Router } = require("express");
const fileUpload = require("../middlewares/fileUpload");
const {
  serviceAdd,
  serviceDelete,
  serviceEdit,
  serviceGet,
  serviceGetAll,
  serviceGetOne,
} = require("../controller/service.controller");

const router = new Router();

router.post("/service", fileUpload, serviceAdd);
router.get("/service/:skip/:limit", serviceGetAll);
router.get("/serviceAll", serviceGet);
router.get("/service/:id", serviceGetOne);
router.put("/service/:id", fileUpload, serviceEdit);
router.delete("/service/:id", serviceDelete);

module.exports = router;
