// import { Model } from "./model.class";

export class Collection {
  static getMax<T>(key: keyof T, collection: T[]): T {
    return collection.reduce(function (prev, current) {
      return prev[key] > current[key] ? prev : current;
    });
  }

  static getMin<T>(key: keyof T, collection: T[]): T {
    return collection.reduce(function (prev, current) {
      return prev[key] < current[key] ? prev : current;
    });
  }

  static getValuesOf<T>(key: keyof T, collection: T[]): T[keyof T][] {
    return collection.map((element) => element[key]);
  }
}
