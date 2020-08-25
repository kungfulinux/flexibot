import {Option} from './option';

export type EitherPattern<L, R, X> = {
  left: (l: L) => X,
  right: (r: R) => X
}

export class Either<L, R> {
  constructor(public caseOf: <X>(pattern: EitherPattern<L, R, X>) => X) {}

  static left<L, R>(l: L): Either<L, R> {
    return new Either(<X>(pattern: EitherPattern<L, R, X>) => pattern.left(l));
  }

  static right<L, R>(r: R): Either<L, R> {
    return new Either(<X>(pattern: EitherPattern<L, R, X>) => pattern.right(r));
  }

  isLeft(): boolean {
    return this.caseOf({
      left: () => true,
      right: () => false
    });
  }

  isRight(): boolean {
    return this.caseOf({
      left: () => false,
      right: () => true
    });
  }

  getLeft(): L {
    return this.caseOf({
      left: (l) => l,
      right: (): L => {
        throw new TypeError('left is empty');
      }
    });
  }

  getRight(): R {
    return this.caseOf({
      left: (): R => {
        throw new TypeError('right is empty');
      },
      right: (r) => r
    });
  }

  map<X, Y>(mapL: (l: L) => X, mapR: (r: R) => Y): Either<X, Y> {
    return this.caseOf({
      left: (l) => Either.left<X, Y>(mapL(l)),
      right: (r) => Either.right<X, Y>(mapR(r))
    });
  }

  mapLeft<X>(mapL: (l: L) => X): Either<X, R> {
    return this.map(mapL, r => r);
  }

  mapRight<X>(mapR: (l: R) => X): Either<L, X> {
    return this.map(l => l, mapR);
  }

  flatMapRight<X>(f: (val: R) => Either<L, X>): Either<L, X> {
    return this.caseOf({
      left: (lval: L) => {
        return Either.left<L, X>(lval);
      },
      right: (rval: R) => {
        return f(rval);
      }
    })
  }

  flatMapLeft<X>(f: (val: L) => Either<X, R>): Either<X, R> {
    return this.caseOf({
      left: (lval: L) => {
        return f(lval);
      },
      right: (rval: R) => {
        return Either.right<X, R>(rval);
      }
    })
  }

  toOption(): Option<R> {
    return this.caseOf({
      left: () => Option.none<R>(),
      right: (r) => Option.some(r)
    });
  }
}
