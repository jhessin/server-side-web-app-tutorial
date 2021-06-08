/** @format */

import { Router } from "express";
import { authenticate } from "passport";

const router = Router();

router.post(
  "/",
  authenticate("localRegister", {
    successRedirect: "/account",
  }),
);

export { router as register };
