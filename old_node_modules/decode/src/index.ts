import {Option} from 'kung-fu';

export class DecodeError extends Error {
  constructor(message: string) {
    super();
    (Error as any).captureStackTrace(this, 'DecodeError');
    this.name = 'DecodeError';
    this.message = message;
  }
}

export class Decoder<T> {
  constructor(private _run: (data: any) => T) {}

  decodeObject(data: Object): T {
    return this._run(data);
  }

  decodeString(data: string): T {
    return this._run(JSON.parse(data));
  }

  map<U>(f: (t: T) => U): Decoder<U> {
    return new Decoder(data => f(this._run(data)));
  }

  andThen<U>(f: (t: T) => Decoder<U>): Decoder<U> {
    return new Decoder(data => f(this._run(data))._run(data));
  }

  reason(f: (reason: string) => string): Decoder<T> {
    return new Decoder(data => {
      try {
        return this._run(data);
      } catch (err) {
        if (err instanceof DecodeError) {
          throw new DecodeError(f(err.message));
        }
        throw err;
      }
    });
  }

  static fail<T>(message: string): Decoder<T> {
    return new Decoder((data): T => {
      throw new DecodeError(message);
    });
  }

  static succeed<T>(value: T): Decoder<T> {
    return new Decoder(data => value);
  }

  static get string(): Decoder<string> {
    return new Decoder(data => {
      if (data === null) {
        throw new DecodeError('data is null');
      }
      if (typeof data !== 'string') {
        throw new DecodeError('data is not a string');
      }
      return data;
    });
  }

  static get number(): Decoder<number> {
    return new Decoder(data => {
      if (data === null) {
        throw new DecodeError('data is null');
      }
      if (typeof data !== 'number') {
        throw new DecodeError('data is not a number');
      }
      return data;
    });
  }

  static get integer(): Decoder<number> {
    return Decoder.number.map(num => {
      if (!Number.isInteger(num)) {
        throw new DecodeError('data is not an integer');
      }
      return num;
    });
  }

  static get boolean(): Decoder<boolean> {
    return new Decoder(data => {
      if (data === null) {
        throw new DecodeError('data is null');
      }
      if (typeof data !== 'boolean') {
        throw new DecodeError('data is not a boolean');
      }
      return data;
    });
  }

  maybe(): Decoder<Option<T>> {
    return new Decoder(data => {
      if (data === null || typeof data === 'undefined') {
        return Option.none<T>();
      }
      return Option.some(this._run(data));
    });
  }

  array(): Decoder<Array<T>> {
    return new Decoder(data => {
      if (!Array.isArray(data)) {
        throw new DecodeError('data is not an array');
      }
      return data.map((inner: any) => this._run(inner));
    });
  }

  at(path: Array<string>): Decoder<T> {
    return new Decoder<T>(data => {
      const inner = path.reduce((intermediate: any, pathComponent: string) => {
        return intermediate && intermediate[pathComponent];
      }, data);
      return this._run(inner);
    });
  }

  dict(): Decoder<{[key: string]: T}> {
    return new Decoder(data => {
      const map: {[key: string]: T} = {};
      Object.keys(data).forEach(key => {
        map[key] = this._run(data[key]);
      });
      return map;
    });
  }

  static oneOf<T>(decoders: Array<Decoder<T>>): Decoder<T> {
    return new Decoder(data => {
      let lastErr: Error;
      for (let decoder of decoders) {
        try {
          return decoder._run(data);
        } catch (err) {
          lastErr = err;
        }
      }
      throw lastErr;
    });
  }

  static object2<A, B, X>(a: Decoder<A>, b: Decoder<B>, f: (a: A, b: B) => X): Decoder<X> {
    return new Decoder(data => {
      return f(a._run(data), b._run(data));
    });
  }

  static object3<A, B, C, X>(a: Decoder<A>, b: Decoder<B>, c: Decoder<C>, f: (a: A, b: B, c: C) => X): Decoder<X> {
    return new Decoder(data => {
      return f(a._run(data), b._run(data), c._run(data));
    });
  }

  static object4<A, B, C, D, X>(a: Decoder<A>, b: Decoder<B>, c: Decoder<C>, d: Decoder<D>, f: (a: A, b: B, c: C, d: D) => X): Decoder<X> {
    return new Decoder(data => {
      return f(a._run(data), b._run(data), c._run(data), d._run(data));
    });
  }

  static object5<A, B, C, D, E, X>(a: Decoder<A>, b: Decoder<B>, c: Decoder<C>, d: Decoder<D>, e: Decoder<E>, f: (a: A, b: B, c: C, d: D, e: E) => X): Decoder<X> {
    return new Decoder(data => {
      return f(a._run(data), b._run(data), c._run(data), d._run(data), e._run(data));
    });
  }

  static object6<A, B, C, D, E, F, X>(a: Decoder<A>, b: Decoder<B>, c: Decoder<C>, d: Decoder<D>, e: Decoder<E>, f: Decoder<F>, x: (a: A, b: B, c: C, d: D, e: E, f: F) => X): Decoder<X> {
    return new Decoder(data => {
      return x(a._run(data), b._run(data), c._run(data), d._run(data), e._run(data), f._run(data));
    });
  }

  static object7<A, B, C, D, E, F, G, X>(a: Decoder<A>, b: Decoder<B>, c: Decoder<C>, d: Decoder<D>, e: Decoder<E>, f: Decoder<F>, g: Decoder<G>, x: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => X): Decoder<X> {
    return new Decoder(data => {
      return x(a._run(data), b._run(data), c._run(data), d._run(data), e._run(data), f._run(data), g._run(data));
    });
  }

  static object8<A, B, C, D, E, F, G, H, X>(a: Decoder<A>, b: Decoder<B>, c: Decoder<C>, d: Decoder<D>, e: Decoder<E>, f: Decoder<F>, g: Decoder<G>, h: Decoder<H>, x: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => X): Decoder<X> {
    return new Decoder(data => {
      return x(a._run(data), b._run(data), c._run(data), d._run(data), e._run(data), f._run(data), g._run(data), h._run(data));
    });
  }
}
