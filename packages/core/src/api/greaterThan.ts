/* eslint-disable functional/no-expression-statement */
import { UNEQUAL_CURRENCIES_MESSAGE } from '../checks';
import { assert } from '../helpers';
import { greaterThan as gt } from '../utils';

import { haveSameCurrency } from './haveSameCurrency';
import { normalizeScale } from './normalizeScale';

import type { Dinero } from '../types';
import type { Dependencies } from './types';

export type GreaterThanParams<TAmount> = readonly [
  dineroObject: Dinero<TAmount>,
  comparator: Dinero<TAmount>
];

export type UnsafeGreaterThanDependencies<TAmount> = Dependencies<TAmount>;

export function unsafeGreaterThan<TAmount>({
  calculator,
}: UnsafeGreaterThanDependencies<TAmount>) {
  const greaterThanFn = gt(calculator);

  return function greaterThan(
    ...[dineroObject, comparator]: GreaterThanParams<TAmount>
  ) {
    const dineroObjects = [dineroObject, comparator];

    const [subjectAmount, comparatorAmount] = dineroObjects.map((d) => {
      const { amount } = d.toJSON();

      return amount;
    });

    return greaterThanFn(subjectAmount, comparatorAmount);
  };
}

export type SafeGreaterThanDependencies<TAmount> = Dependencies<TAmount>;

export function safeGreaterThan<TAmount>({
  calculator,
}: SafeGreaterThanDependencies<TAmount>) {
  const normalizeFn = normalizeScale({ calculator });
  const greaterThanFn = unsafeGreaterThan({ calculator });

  return function greaterThan(
    ...[dineroObject, comparator]: GreaterThanParams<TAmount>
  ) {
    const condition = haveSameCurrency([dineroObject, comparator]);
    assert(condition, UNEQUAL_CURRENCIES_MESSAGE);

    const [subjectAmount, comparatorAmount] = normalizeFn([
      dineroObject,
      comparator,
    ]);

    return greaterThanFn(subjectAmount, comparatorAmount);
  };
}
