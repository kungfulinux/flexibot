import {Either} from './either';

export type OptionPattern<T, X> = {
  none: () => X,
  some: (t: T) => X
}

export class Option<T> {
  constructor(public caseOf: <X>(pattern: OptionPattern<T, X>) => X) {}

  static some<T>(t: T): Option<T> {
    return new Option<T>(<X>(pattern: OptionPattern<T, X>) => pattern.some(t));
  }

  static empty: Option<any> =
    Option.none<any>();

  static none<T>(): Option<T> {
    return new Option(<X>(pattern: OptionPattern<T, X>) => pattern.none());
  }

  static option<T>(f: () => T): Option<T> {
    const val = f();
    return val ? Option.some(val) : Option.empty;
  }

  isDefined(): boolean {
    return this.caseOf({
      none: () => false,
      some: () => true
    });
  }

  isEmpty(): boolean {
    return this.caseOf({
      none: () => true,
      some: () => false
    });
  }

  getOr(def: T): T {
    return this.caseOf({
      none: ()  => def,
      some: (t) => t
    });
  }

  getOrLazy(def: () => T): T {
    return this.caseOf({
      none: ()  => def(),
      some: (t) => t
    });
  }

  get(): T {
    return this.caseOf({
      none: (): T => {
        throw new TypeError('option is empty');
      },
      some: (t)   => t
    });
  }

  map<U>(f: (t: T) => U): Option<U> {
    return this.caseOf({
      none: ()  => Option.empty,
      some: (t) => Option.some(f(t))
    });
  }

  map2<U, X>(other: Option<U>, f: (t: T, u: U) => X): Option<X> {
    return this.caseOf({
      none: ()  => Option.empty,
      some: (t) => other.caseOf({
        none: ()  => Option.empty,
        some: (u) => Option.some(f(t, u))
      })
    });
  }

  flatMap<U>(f: (t: T) => Option<U>): Option<U> {
    return this.caseOf({
      none: ()  => Option.empty,
      some: (t) => f(t)
    });
  }

  filter(pred: (t: T) => boolean): Option<T> {
    return this.caseOf({
      none: ()  => Option.empty,
      some: (t) => pred(t) ? this : Option.empty
    });
  }

  truthy(): Option<T> {
    return this.filter(v => !!v);
  }

  reduce<U>(f: (u: U, t: T) => U, init: U): U {
    return this.caseOf({
      none: ()  => init,
      some: (t) => f(init, t)
    });
  }

  orElse<U extends T>(other: Option<U>): Option<T> {
    return this.caseOf<Option<T>>({
      none: () => other,
      some: () => this
    });
  }

  orElseLazy<U extends T>(other: () => Option<U>): Option<T> {
    return this.caseOf<Option<T>>({
      none: () => other(),
      some: () => this
    });
  }

  forEach(f: (t: T) => void): void {
    this.caseOf({
      none: ()  => {},
      some: (t) => f(t)
    });
  }

  cata<U>(f: (t: T) => U, def: U): U {
    return this.caseOf({
      none: ()  => def,
      some: (t) => f(t)
    });
  }

  cataLazy<U>(f: (t: T) => U, def: () => U): U {
    return this.caseOf({
      none: ()  => def(),
      some: (t) => f(t)
    });
  }

  toEither<L>(l: L): Either<L, T> {
    return this.caseOf({
      none: ()  => Either.left<L, T>(l),
      some: (t) => Either.right<L, T>(t)
    });
  }

  toArray(): Array<T> {
    return this.caseOf({
      none: ()  => [],
      some: (t) => [t]
    });
  }
}
