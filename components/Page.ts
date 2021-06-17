/** @format */

import { Request, Response, NextFunction } from "express";

export type map = { [key: string]: string };

export type dataMap = {
  title: string;
  partials?: map;
  [key: string]: any;
};

export class Page {
  // Contruct a page
  constructor(
    req: Request,
    res: Response,
    next: NextFunction,
    data: dataMap = {
      title: "Home Page",
      partials: {
        content: "home",
      },
    },
    view: string = "base",
  ) {
    this._req = req;
    this._res = res;
    this._next = next;
    this._data = data;
    this._view = view;
  }

  // The data that is sent to the page
  private _data: dataMap = {
    title: "Home Page",
    partials: {
      content: "home",
    },
  };

  public get data() {
    return this._data;
  }

  public set data(v: dataMap) {
    this._data = v;
  }

  // The title of the page.
  public set title(v: string) {
    this._data.title = v;
  }

  public get title() {
    return this._data.title;
  }

  // The parent page to load
  private _view = "base";

  public set view(v: string) {
    this._view = v;
  }

  public get view() {
    return this._view;
  }

  // The Request sent to the page
  private _req: Request;

  public get req() {
    return this._req;
  }

  // The Response for rendering the page
  private _res: Response;

  public get res() {
    return this._res;
  }

  // The NextFunction used for errors, etc.
  private _next: NextFunction;

  public get next() {
    return this._next;
  }
  // A map of partials that can be rendered on the page
  public set partials(v: map) {
    this._data.partials = v;
  }

  public get partials(): map {
    return this._data.partials;
  }
  render() {
    this._res.render(this._view, this._data);
  }
}
