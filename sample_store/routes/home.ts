/** @format */

import { Router } from "express";
import { Item } from "../models";
import { BasePage } from "../components";

const router = Router();

router.get("/", async (req, res, next) => {
  const { user } = req;

  try {
    const items = await Item.find();
    const interested = user ? await Item.find({ interested: user._id }) : [];

    const page = new BasePage({
      req,
      res,
      next,
      title: "Home Page",
      content: "home",
      data: {
        items,
        interested,
        user,
      },
    });
    page.render();
  } catch (err) {
    res.render("error", {
      message: err.message,
      user,
    });
  }
});

router.get("/additem/:itemid", (req, res, next) => {
  const { user } = req;
  if (!user) {
    res.redirect("/");
    return;
  }

  Item.findById(req.params.itemid)
    .catch(err => {
      return next(err);
    })
    .then(item => {
      if (item) {
        if (item.interested.indexOf(user._id) == -1) {
          item.interested.push(user._id);
          item.save();
        }
        res.redirect("/");
      } else {
        res.render("error", {
          message: "Item not found!",
          user,
        });
      }
    });
});

router.get("/removeitem/:itemid", (req, res, next) => {
  const { user } = req;
  if (!user) {
    res.redirect("/");
    return;
  }

  Item.findById(req.params.itemid)
    .catch(err => {
      return next(err);
    })
    .then(item => {
      if (item) {
        const index = item.interested.indexOf(user._id);
        if (index > -1) {
          item.interested.splice(index, 1);
          item.save();
        }
      }
      res.redirect("/");
    });
});

export { router as home };
