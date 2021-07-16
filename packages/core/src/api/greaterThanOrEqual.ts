/* eslint-disable functional/no-expression-statement */
import { UNEQUAL_CURRENCIES_MESSAGE } from '../checks';
import { assert } from '../helpers';
import { greaterThanOrEqual as gte } from '../utils';

import { haveSameCurrency } from './haveSameCurrency';
import { normalizeScale } from './normalizeScale';

import type { Dinero } from '../types';
import type { Dependencies } from './types';

export type GreaterThanOrEqualParams<TAmount> = readonly [
  dineroObject: Dinero<TAmount>,
  comparator: Dinero<TAmount>
];

export type UnsafeGreaterThanOrEqualDependencies<TAmount> =
  Dependencies<TAmount>;

export function unsafeGreaterThanOrEqual<TAmount>({
  calculator,
}: UnsafeGreaterThanOrEqualDependencies<TAmount>) {
  const greaterThanOrEqualFn = gte(calculator);

  return function greaterThanOrEqual(
    ...[dineroObject, comparator]: GreaterThanOrEqualParams<TAmount>
  ) {
    const dineroObjects = [dineroObject, comparator];

    const [subjectAmount, comparatorAmount] = dineroObjects.map((d) => {
      const { amount } = d.toJSON();

      return amount;
    });

    return greaterThanOrEqualFn(subjectAmount, comparatorAmount);
  };
}

export type SafeGreaterThanOrEqualDependencies<TAmount> = Dependencies<TAmount>;

export function safeGreaterThanOrEqual<TAmount>({
  calculator,
}: SafeGreaterThanOrEqualDependencies<TAmount>) {
  const normalizeFn = normalizeScale({ calculator });
  const greaterThanOrEqualFn = unsafeGreaterThanOrEqual({
    calculator,
  });

  return function greaterThanOrEqual(
    ...[dineroObject, comparator]: GreaterThanOrEqualParams<TAmount>
  ) {
    const condition = haveSameCurrency([dineroObject, comparator]);
    assert(condition, UNEQUAL_CURRENCIES_MESSAGE);

    const [subjectAmount, comparatorAmount] = normalizeFn([
      dineroObject,
      comparator,
    ]);

    return greaterThanOrEqualFn(subjectAmount, comparatorAmount);
  };
}
