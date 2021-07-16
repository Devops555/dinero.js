import { equal } from '../utils';

import { normalizeScale } from './normalizeScale';

import type { Dinero } from '../types';
import type { Dependencies } from './types';

export type HaveSameAmountParams<TAmount> = readonly [
  dineroObjects: ReadonlyArray<Dinero<TAmount>>
];

export type HaveSameAmountDependencies<TAmount> = Dependencies<TAmount>;

export function haveSameAmount<TAmount>({
  calculator,
}: HaveSameAmountDependencies<TAmount>) {
  const normalizeFn = normalizeScale({ calculator });
  const equalFn = equal(calculator);

  return function _haveSameAmount(
    ...[dineroObjects]: HaveSameAmountParams<TAmount>
  ) {
    const [firstDinero, ...otherDineros] = normalizeFn(dineroObjects);
    const { amount: comparatorAmount } = firstDinero.toJSON();

    return otherDineros.every((d) => {
      const { amount: subjectAmount } = d.toJSON();

      return equalFn(subjectAmount, comparatorAmount);
    });
  };
}
