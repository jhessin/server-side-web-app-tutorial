/** @format */

import { Router } from "express";
import fetch from "node-fetch";
import { Verse, Bible, Commentary, Appendix } from "../models";
import { BasePage, BiblePage } from "../components";

let bibleLock: boolean = false;

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
  if (bibleLock) {
    return;
  }
  bibleLock = true;
  console.log("Fetching Bible Verses");
  const verses = await fetch(
    "https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=bible",
  ).then(r => r.json());
  // parse bible into bible structure.
  // invalidate verses
  await Verse.deleteMany({});
  await Commentary.deleteMany({});
  await Appendix.deleteMany({});

  // iterate through verses
  console.log("Iterating through verses");
  verses.REV_Bible.forEach(async (verse: any) => {
    console.log(
      `Verse found parsing ${verse.book} ${verse.chapter}:${verse.verse}`,
    );
    verse.chapter = parseInt(verse.chapter);
    verse.verse = parseInt(verse.verse);
    await Verse.create(verse);
  });

  // iterate through appendices
  console.log("Fetching Appendices");
  const appendices = await fetch(
    "https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=appendices",
  ).then(r => r.json());
  console.log("Iterating through appendices");
  appendices.REV_Appendices.forEach(async (appendix: any) => {
    console.log(`Parsing ${appendix.title}`);
    await Appendix.create(appendix);
  });

  // iterate through Commentary
  console.log("Fetching commentary");
  const commentary = await fetch(
    "https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=commentary",
  ).then(r => r.json());
  console.log("Iterating through Commentary");
  commentary.REV_Commentary.forEach(async (com: any) => {
    console.log(
      `Commentary found: Parsing commentary for ${com.book} ${com.chapter}:${com.verse}`,
    );
    await Commentary.create(com);
  });
  console.log("Completed parsing bible, appendix, and commentary");

  console.log("Creating Bible timestamp");
  await Bible.create({});
  console.log("Finished creating Bible timestamp");
  bibleLock = false;
}

router.get("/bibleRaw", (req, res, next) => {
  fetch(
    "https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=bible",
  )
    .then(r => r.json())
    .then(json => res.json(json))
    .catch(err => next(err));
});

router.get("/", async (req, res, next) => {
  try {
    // First check the database for current info
    let bible = await Bible.findOne().exec();

    // Generate a page to give info
    const page = new BasePage({
      req,
      res,
      next,
      title: "Bible",
      content: "bibleForm",
    });

    // update the bible if necessary
    if (
      bible &&
      Date.now() - bible.timestamp.getTime() > 24 * 60 * 60 * 1000 * 7
    ) {
      bible.delete();
    }

    if (!bible) {
      updateBible();
    }

    if (bibleLock) {
      page.content = "message";
      page.data.message = "Generating Bible please wait a while and try again,";
      page.render();
    } else {
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
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", (req, res, next) => {
  const searchString: string = req.body.search;
  const pattern =
    /(\d*)\s*([a-z]+)\s*(\d+)(?::(\d+))?(\s*-\s*(\d+)(?:\s*([a-z]+)\s*(\d+))?(?::(\d+))?)?/i;

  const split = pattern.exec(searchString);

  // first check for appendix reference
  if (split[2].match(/appendix/i)) {
    Appendix.findOne({
      title: `Appendix ${split[3]}`,
    }).then(data => {
      const page = new BasePage({
        req,
        res,
        next,
        title: `Appendix ${split[3]}`,
        content: "bibleView",
        data: {
          book: "Appendix",
          chapter: split[3],
          bible: [
            {
              versetext: data.appendix,
            },
          ],
        },
      });
      page.render();
    });
  } else {
    // Now try a single verse
    const book = new RegExp(split[1] + " " + split[2], "i");
    const chapter = parseInt(split[3]);
    console.log(`Finding ${book} ${chapter}`);
    Verse.find({
      book,
      chapter,
    }).then(bible => {
      if (bible.length > 0) {
        const book = bible[0].book;
        const page = new BiblePage({
          req,
          res,
          next,
          book,
          chapter,
          bible,
        });
        page.render();
      } else {
        const page = new BasePage({
          req,
          res,
          next,
          title: "Not Found",
          content: "message",
          data: {
            message: `${book} ${chapter} doesn't exist!`,
          },
        });
        page.render();
      }
    });
    //res.json(split);
  }
});

router.get("/forcedUpdate", (req, res, next) => {
  try {
    Bible.deleteMany({}).then(() => res.redirect("/rev"));
  } catch (err) {
    return next(err);
  }
});

router.get("/commentary", async (req, res, next) => {
  try {
    const commentary = await fetch(
      "https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=commentary",
    ).then(r => r.json());
    res.json(commentary);
  } catch (err) {
    return next(err);
  }
});

router.get("/appendices", async (req, res, next) => {
  const appendices = await fetch(
    "https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=appendices",
  ).then(r => r.json());
  res.json(appendices);
});

export { router as bible };
