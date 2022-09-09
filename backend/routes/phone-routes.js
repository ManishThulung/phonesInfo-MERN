const express = require("express");
const { body } = require("express-validator");
const phoneControllers = require("../controllers/phone-controllers");
const { auth, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/", phoneControllers.getAllPhone);

router.get("/:pid", phoneControllers.getPhoneById);

router.get(
  "/admin/phones/",
  auth,
  authorizeRoles(["admin", "content_creator"]),
  phoneControllers.getAdminPhone
);

router.post(
  "/admin/phone/new",
  [
    body("company").isLength({ min: 3 }),
    body("name").isLength({ min: 3 }),
    body("RAM").isLength({ min: 3 }),
    body("processor").isLength({ min: 5 }),
    body("display").isLength({ min: 5 }),
    body("storage").isLength({ min: 3 }),
    body("camera").isLength({ min: 5 }),
    body("battery").isLength({ min: 4 }),
    body("os").isLength({ min: 5 }),
    body("sensors").isLength({ min: 5 }),
    body("network").isLength({ min: 5 }),
    body("security").isLength({ min: 5 }),
    body("packagecontains").isLength({ min: 5 }),
    body("price").isNumeric().isLength({ min: 5 }),
  ],
  auth,
  authorizeRoles(["admin", "content_creator"]),
  phoneControllers.createPhone
);

router.put(
  "/admin/phone/:pid",
  [
    body("company").isLength({ min: 3 }),
    body("name").isLength({ min: 3 }),
    body("RAM").isLength({ min: 3 }),
    body("processor").isLength({ min: 5 }),
    body("display").isLength({ min: 5 }),
    body("storage").isLength({ min: 3 }),
    body("camera").isLength({ min: 5 }),
    body("battery").isLength({ min: 4 }),
    body("os").isLength({ min: 5 }),
    body("sensors").isLength({ min: 5 }),
    body("network").isLength({ min: 5 }),
    body("security").isLength({ min: 5 }),
    body("packagecontains").isLength({ min: 5 }),
    body("price").isNumeric().isLength({ min: 5 }),
  ],
  auth,
  authorizeRoles(["admin", "content_creator"]),
  phoneControllers.updatePhone
);

router.delete(
  "/admin/phone/:pid",
  auth,
  authorizeRoles(["admin", "content_creator"]),
  phoneControllers.deletePhone
);

router.get("/compare/phone/:phoneOne/:phoneTwo", phoneControllers.comparePhone);

router.get("/reviews", phoneControllers.getPhoneReviews);

router.put("/review", auth, phoneControllers.createReview);

router.delete("/reviews", auth, phoneControllers.deleteReview);

module.exports = router;
