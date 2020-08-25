export class Pair<A, B> {
  constructor(public first: A, public second: B) {}

  mapFirst<C>(f: (first: A) => C): Pair<C, B> {
    return this.map(f, b => b);
  }

  mapSecond<C>(f: (second: B) => C): Pair<A, C> {
    return this.map(a => a, f);
  }

  map<C, D>(f: (first: A) => C, g: (second: B) => D): Pair<C, D> {
    return new Pair(f(this.first), g(this.second));
  }
}
