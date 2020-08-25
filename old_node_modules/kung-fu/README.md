# kung-fu
*Functional Standard Library with TypeScript support*

Kung-fu aims to provide a collection of immutable datastructures and functional algorithms that can be used to create robust JavaScript and TypeScript programs.

It is written in TypeScript to ensure a type-safe and idiomatic implementation.

## Installation

Kung-fu is available on npm:

```
npm install kung-fu
```

## Features

### `Option<T>`

Option can be used to represent an optional value, without having to resort to `null` and `undefined`. It can be empty, or contain a value of type T.

```typescript
function zeroAsDefault(maybeNumber: Option<number>) {
  return maybeNumber.caseOf({
    none: () => 0,
    some: (value) => value
  });
}

zeroAsDefault(Option.some(42)) // == 42
zeroAsDefault(Option.none<number>()) // == 0
```

### `Either<L, R>`

Either can be used to represent a result with two different outcomes, e.g. error or success.

```typescript
function doSomethingDangerous(lucky: boolean): Either<Error, String> {
  if (!lucky) {
    return Either.left<Error, String>(new Error('uh oh!'));
  } else {
    return Either.right<Error, String>('wow, it worked. lucky you!');
  }
}

doSomethingDangerous(true) // == Either.right('wow, it worked. lucky you!');
doSomethingDangerous(true).flatMap(msg => doSomethingDangerous(false)) // == Either.left(new Error('uh oh!'))
```

### `Pair<A, B>`

Pair can be used to represent a heterogenous tuple of two values.

```typescript
const twoThings = new Pair('one thing', 42);

twoThings.mapFirst(str => str + '!') // == new Pair('one thing!', 42);
```

### `PartialFunction<From, To>`

A partial function from `From` to `To`.

```typescript
const partial = PartialFunction.asInstanceOf(Number).map(n => n + 1);

partial.call(42).getOr(0);
```
