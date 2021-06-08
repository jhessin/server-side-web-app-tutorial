/** @format */

import { Page } from ".";
import { Request, Response, NextFunction } from "express";

export type BasePageConfig = {
  title: string;
  req: Request;
  res: Response;
  next: NextFunction;
  content: string;
  data?: { [key: string]: any };
};

export class BasePage extends Page {
  constructor(config: BasePageConfig) {
    super(config.req, config.res, config.next);
    this.data = {
      title: config.title,
      partials: {
        content: config.content,
      },
      ...config.data,
    };
    this.view = "base";
  }
}
