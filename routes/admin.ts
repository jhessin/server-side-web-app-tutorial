/** @format */

import { Router } from "express";
import { BasePage, Page } from "../components";
import { User, Item } from "../models";

const router = Router();

router.get("/", (req, res, next) => {
  const { user } = req;
  if (!user || !user.isAdmin) {
    res.redirect("/");
    return;
  }

  Item.find()
    .then(items => {
      const page = new BasePage({
        req,
        res,
        next,
        title: "Admin Page",
        data: {
          items,
          user,
        },
        content: "admin",
      });
      page.render();
    })
    .catch(err => {
      return next(err);
    });
});

router.post("/additem", (req, res, next) => {
  const { user } = req;
  if (!user || !user.isAdmin) {
    res.redirect("/");
    return;
  }

  Item.create(req.body)
    .then(item => {
      res.redirect("/admin");
    })
    .catch(err => {
      return next(err);
    });
});

router.get("/deleteitem/:itemid", (req, res, next) => {
  const { user } = req;
  if (!user || !user.isAdmin) {
    res.redirect("/");
    return;
  }

  Item.findByIdAndDelete(req.params.itemid)
    .then(() => res.redirect("/admin"))
    .catch(err => next(err));
});

router.post("/purgeusers", (req, res, next) => {
  User.collection
    .drop()
    .then(success => {
      console.log(`purge complete: ${success}`);
      res.redirect("/login");
    })
    .catch(err => {
      res.render("error", {
        title: "Drop Error",
        message: err.message,
        user: req.user,
      });
    });
});

export { router as admin };
