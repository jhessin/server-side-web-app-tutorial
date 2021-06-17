/** @format */

import { Request, Response, NextFunction } from "express";
import { BasePage } from ".";

type verse = {
  versetext: string;
};

export type BiblePageConfig = {
  book: string;
  req: Request;
  res: Response;
  next: NextFunction;
  chapter: number;
  bible: verse[];
};

export class BiblePage extends BasePage {
  public set book(v: string) {
    this.data.book = v;
  }

  public set chapter(v: number) {
    this.data.chapter = v;
  }

  public set verses(v: verse[]) {
    this.data.bible = v;
  }

  constructor({ req, res, next, book, chapter, bible }: BiblePageConfig) {
    super({
      req,
      res,
      next,
      title: `${book} ${chapter}`,
      content: "bibleView",
      data: {
        book,
        chapter,
        bible,
      },
    });
  }
}
