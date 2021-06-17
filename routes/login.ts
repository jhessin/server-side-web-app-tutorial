/** @format */

import { Router } from "express";
import passport from "passport";
import Mailgun from "mailgun-js";
import { hashSync } from "bcrypt";
import { BasePage, Page } from "../components";
import { User } from "../models";

const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const router = Router();
const mailgun = Mailgun({
  apiKey,
  domain,
});

router.post(
  "/",
  passport.authenticate("localLogin", {
    successRedirect: "/",
  }),
);

router.get("/", (req, res, next) => {
  if (req.user) {
    res.redirect("/");
    return;
  }
  const page = new BasePage({
    req,
    res,
    next,
    title: "Login Page",
    content: "login",
  });
  page.render();
});

router.post("/resetpassword", (req, res, next) => {
  User.findOne({
    email: req.body.email,
  })
    .catch(err => next(err))
    .then(user => {
      if (!user) {
        return next(new Error("User not found!"));
      }

      user.nonce = randomString(8);
      user.passwordResetTime = new Date();
      user.save();

      mailgun
        .messages()
        .send({
          from: "Grillbrick Studios <jhessin@gmail.com>",
          to: user.email,
          sender: "Sample Store",
          subject: "Password Reset Request",
          html: `
Please click <a href="http://127.0.0.1:8080/login/password-reset?nonce=${user.nonce}&id=${user._id}" style="color: red">HERE</a> to reset your password.
This link is valid for 24 hours.
`,
        })
        .catch(err => next(err))
        .then(body => {
          const page = new BasePage({
            req,
            res,
            next,
            title: "Message Sent",
            content: "message",
            data: {
              message: "Email successfully sent. Check your inbox",
            },
          });
        });
    });
});

router.get("/password-reset", (req, res, next) => {
  const { nonce, id } = req.query;

  if (!nonce || !id) {
    return next(new Error("Invalid Request"));
  }

  User.findById(id)
    .catch(err => next(err))
    .then(user => {
      if (!user) return next(new Error("Invalid Request"));
      if (!user.passwordResetTime || !user.nonce)
        return next(new Error("Invalid Request"));
      if (nonce !== user.nonce) return next(new Error("Invalid Request"));

      const now = new Date();
      const diff = now.getTime() - user.passwordResetTime.getTime(); // time in milliseconds
      const seconds = diff / 1000;

      if (seconds > 24 * 60 * 60) return next(new Error("Invalid Request"));

      // render the page where users can reset password
      const data = {
        nonce: user.nonce,
        id: user._id,
      };
      const page = new BasePage({
        req,
        res,
        next,
        title: "Reset Password",
        content: "passwordReset",
        data,
      });
      page.render();
    });
});

router.post("/newpassword", (req, res, next) => {
  const { id, nonce, password, confirmPassword } = req.body;

  if (!id || !nonce || !password || !confirmPassword)
    return next(new Error("Invalid Request"));

  if (password !== confirmPassword) {
    const page = new BasePage({
      req,
      res,
      next,
      title: "Reset Password",
      content: "passwordReset",
      data: {
        id,
        nonce,
        message: "Passwords do not match - try again!",
      },
    });
    return page.render();
  }

  User.findById(id)
    .catch(err => next(err))
    .then(user => {
      if (!user) return next(new Error("User Not Found"));
      if (!user.nonce) return next(new Error("user has no nonce"));
      if (user.nonce !== nonce)
        return next(new Error("user nonce does not match id"));
      if (!user.passwordResetTime)
        return next(new Error("user has no passwordReset Time"));
      if (Date.now() - user.passwordResetTime.getTime() > 24 * 60 * 60 * 1000)
        return next(new Error("Password Reset time expired"));

      user.password = hashSync(password, 10);
      user.nonce = null;
      user.passwordResetTime = null;
      user.save();

      const page = new BasePage({
        req,
        res,
        next,
        title: "Success",
        content: "message",
        data: {
          message: "Successfully reset password please login",
        },
      });

      return page.render();
    });
});

export { router as login };

function randomString(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
