const { Router } = require("express");
const fileUpload = require("../middlewares/fileUpload");
const {
  pillAdd,
  pillDelete,
  pillEdit,
  pillGet,
  pillGetAll,
  pillGetOne,
  pillSearch,
} = require("../controller/pill.controller");

const router = new Router();

router.post("/pill", fileUpload, pillAdd);
router.get("/pill/:skip/:limit", pillGetAll);
router.get("/pillAll", pillGet);
router.get("/pill/:id", pillGetOne);
router.put("/pill/:id", fileUpload, pillEdit);
router.delete("/pill/:id", pillDelete);
router.get("/searchPill/:search", pillSearch);

module.exports = router;
