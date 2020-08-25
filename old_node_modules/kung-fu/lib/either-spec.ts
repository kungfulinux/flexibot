import * as chai from 'chai';

import {Either} from './either';

describe('Either', () => {

  function fixtureErrOk(blowup: boolean): Either<Error, string> {
    if (blowup) {
      return Either.left<Error, string>(new Error('err'));
    } else {
      return Either.right<Error, string>('ok');
    }
  }

  it('creates an either with a valid left and an empty right', () => {
    const e = Either.left<string, void>('hello world');
    chai.expect(e.isLeft()).to.be.true;
    chai.expect(e.getLeft()).to.be.equal('hello world');
    chai.expect(e.isRight()).to.be.false;
    chai.expect(() => e.getRight()).to.throw(TypeError);
  });

  it('creates an either with an empty left and a valid right', () => {
    const e = Either.right<void, string>('hello world');
    chai.expect(e.isLeft()).to.be.false;
    chai.expect(() => e.getLeft()).to.throw(TypeError);
    chai.expect(e.isRight()).to.be.true;
    chai.expect(e.getRight()).to.be.equal('hello world');
  });

  it('pattern matches on the left value of an either', () => {
    const e = fixtureErrOk(true);
    e.caseOf({
      left: (lval) => {
        chai.expect(lval).to.be.deep.equal(new Error('err'));
      },
      right: (rval) => {
        throw new Error('should not have reached the right branch');
      }
    });
  });

  it('pattern matches on the right value of an either', () => {
    const e = fixtureErrOk(false);
    e.caseOf({
      left: (lval) => {
        throw new Error('should not have reached the left branch');
      },
      right: (rval) => {
        chai.expect(rval).to.be.equal('ok');
      }
    });
  });

  it('#mapRight maps the value on the right of an either', () => {
    const rightOnlyEither = Either.right<void, string>('ok');
    const e = rightOnlyEither.mapRight((val) => val.length);
    e.caseOf({
      left: (lval) => {
        throw new Error('should not have reached the left branch');
      },
      right: (rval) => {
        chai.expect(rval).to.be.equal('ok'.length);
      }
    });
  });

  it('#flatMapRight maps and flattens the value on the right into another either', () => {
    const rightOnlyEither = Either.right<void, string>('hello');
    const e = rightOnlyEither.flatMapRight((val) => Either.right<void, string>(`${val} world`));
    e.caseOf({
      left: (lval) => {
        throw new Error('should not have reached left branch');
      },
      right: (rval) => {
        chai.expect(rval).to.be.equal('hello world');
      }
    })
  });

  it('#flatMapLeft maps and flattens the value on the left into another either', () => {
    const leftOnlyEither = Either.left<string, void>('hello');
    const e = leftOnlyEither.flatMapLeft((val) => Either.left<string, void>(`${val} world`));
    e.caseOf({
      left: (lval) => {
        chai.expect(lval).to.be.equal('hello world');
      },
      right: (rval) => {
        throw new Error('should not have reached right branch');
      }
    })
  });

});
