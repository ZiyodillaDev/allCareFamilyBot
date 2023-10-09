const { Router } = require("express");
const {
  orderAdd,
  orderDelete,
  orderEdit,
  orderGet,
  orderGetAll,
  orderGetOne,
  orderStatusEdit,
} = require("../controller/order.controller");

const router = new Router();

router.post("/order", orderAdd);
router.get("/order/:skip/:limit", orderGetAll);
router.get("/orderAll", orderGet);
router.get("/order/:id", orderGetOne);
router.put("/order/:id", orderEdit);
router.put("/orderStatus/:id", orderStatusEdit);
router.delete("/order/:id", orderDelete);

module.exports = router;
