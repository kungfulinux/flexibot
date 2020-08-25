import {Option} from './option';

export class PartialFunction<From, To> {
  constructor(public call: (from: From) => Option<To>) {}

  static empty<From, To>(): PartialFunction<From, To> {
    return new PartialFunction<From, To>((from: From) => Option.none<To>());
  }

  static identity<T>(): PartialFunction<T, T> {
    return new PartialFunction((t: T) => Option.some(t));
  }

  and(other: PartialFunction<From, To>): PartialFunction<From, To> {
    return new PartialFunction((from: From) => this.call(from).caseOf<Option<To>>({
      some: (to) => Option.some(to),
      none: () => other.call(from)
    }));
  }

  compose<Result>(other: PartialFunction<To, Result>): PartialFunction<From, Result> {
    return new PartialFunction((from: From) => this.call(from).flatMap(to => other.call(to)));
  }

  map<Result>(f: (to: To) => Result): PartialFunction<From, Result> {
    return new PartialFunction((from: From) => {
      return this.call(from).map(f);
    });
  }

  static concat<From, To>(
    fs: Array<PartialFunction<From, To>>
  ): PartialFunction<From, To> {
    return fs.reduce((f, g) => f.and(g), PartialFunction.empty<From, To>());
  }

  static asInstanceOf<T>(con: {new(...args: any[]): T}): PartialFunction<Object, T> {
    return new PartialFunction((from: Object) => {
      if (from instanceof con) {
        return Option.some(from);
      }
      return Option.none<T>();
    });
  }
}
