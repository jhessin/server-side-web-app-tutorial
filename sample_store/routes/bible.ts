/** @format */

import { Router } from "express";
import fetch from "node-fetch";
import { Verse, Bible, Commentary, Appendix } from "../models";
import { BasePage } from "../components";

const NAMES = {
  BOOKS: [
    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    // TODO: Finish this...
  ],
};

const router = Router();

async function updateBible() {
  //https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=[bible || commentary || appendices].
  const verses = await fetch(
    "https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=bible",
  ).then(r => r.json());
  //const commentary = await fetch(
  //"https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=commentary",
  //).then(r => r.json());
  const appendices = await fetch(
    "https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=appendices",
  ).then(r => r.json());
  // parse bible into bible structure.
  // invalidate verses
  await Verse.deleteMany({});
  await Commentary.deleteMany({});
  await Appendix.deleteMany({});

  // iterate through verses
  console.log("Iterating through verses");
  verses.REV_Bible.forEach(async (verse: any) => {
    if (verse.book && verse.chapter && verse.verse && verse.versetext) {
      console.log(
        `Verse found parsing ${verse.book} ${verse.chapter}:${verse.verse}`,
      );
      verse.chapter = parseInt(verse.chapter);
      verse.verse = parseInt(verse.verse);
      await Verse.create(verse);
    }
  });

  // iterate through appendices
  console.log("Iterating through appendices");
  appendices.REV_Appendices.forEach(async (appendix: any) => {
    if (appendix.title && appendix.appendix) {
      console.log(`Parsing ${appendix.title}`);
      await Appendix.create(appendix);
    }
  });

  // iterate through Commentary
  //console.log("Iterating through Commentary");
  //commentary.REV_Commentary.forEach(async (com: any) => {
  //if (com.book && com.commentary) {
  //console.log(
  //`Commentary found: Parsing commentary for ${com.book} ${com.chapter}:${com.verse}`,
  //);
  //await Commentary.create(com);
  //}
  //});
  console.log("Completed parsing bible, appendix, and commentary");

  console.log("Creating Bible timestamp");
  await Bible.create({});
  console.log("Finished creating Bible timestamp");
}

router.get("/", async (req, res, next) => {
  // First check the database for current info
  let bible = await Bible.findOne().exec();

  const page = new BasePage({
    req,
    res,
    next,
    title: "Bible",
    content: "bible",
  });

  if (bible && Date.now() - bible.timestamp.getTime() > 24 * 60 * 60 * 1000) {
    bible.delete();
  }

  try {
    if (!bible) {
      await updateBible();
    }

    const book = NAMES.BOOKS[0];
    const chapter = 1;
    console.log("Finding verses from database");
    const bk = await Verse.find(
      {
        book,
        chapter,
      },
      null,
      {
        sort: "verse",
      },
    ).exec();
    console.log("Finished finding verses from database");
    //console.log(gen);
    page.data.bible = bk;
    page.data.book = book;
    page.data.chapter = chapter;
    console.log("Rendering page...");
    page.render();
    //res.json(gen);
  } catch (err) {
    next(err);
  }
});

router.get("/commentary", async (req, res, next) => {
  const commentary = await fetch(
    "https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=commentary",
  ).then(r => r.json());
  res.json(commentary);
});

router.get("/appendices", async (req, res, next) => {
  const appendices = await fetch(
    "https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=appendices",
  ).then(r => r.json());
  res.json(appendices);
});

export { router as bible };
