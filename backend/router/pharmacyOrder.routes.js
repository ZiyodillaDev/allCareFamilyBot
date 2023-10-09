const { Router } = require("express");
const {
  pharmacyOrderAdd,
  pharmacyOrderDelete,
  pharmacyOrderEdit,
  pharmacyOrderGet,
  pharmacyOrderGetAll,
  pharmacyOrderGetOne,
} = require("../controller/pharmacyOrder.controller");

const router = new Router();

router.post("/pharmacyOrder", pharmacyOrderAdd);
router.get("/pharmacyOrder/:skip/:limit", pharmacyOrderGetAll);
router.get("/pharmacyOrderAll", pharmacyOrderGet);
router.get("/pharmacyOrder/:id", pharmacyOrderGetOne);
router.put("/pharmacyOrder/:id", pharmacyOrderEdit);
router.delete("/pharmacyOrder/:id", pharmacyOrderDelete);

module.exports = router;
