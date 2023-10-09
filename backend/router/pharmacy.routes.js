const { Router } = require("express");
const fileUpload = require("../middlewares/fileUpload");
const {
  pharmacyAdd,
  pharmacyDelete,
  pharmacyEdit,
  pharmacyGet,
  pharmacyGetAll,
  pharmacyGetOne,
  pharmacySearch,
} = require("../controller/pharmacy.controller");

const router = new Router();

router.post("/pharmacy", fileUpload, pharmacyAdd);
router.get("/pharmacy/:skip/:limit", pharmacyGetAll);
router.get("/pharmacyAll", pharmacyGet);
router.get("/pharmacy/:id", pharmacyGetOne);
router.put("/pharmacy/:id", fileUpload, pharmacyEdit);
router.delete("/pharmacy/:id", pharmacyDelete);
router.get("/searchPharmacy/:search", pharmacySearch);

module.exports = router;
