import { equal } from '../utils';

import type { Dinero } from '../types';
import type { Dependencies } from './types';

export type IsZeroParams<TAmount> = readonly [dineroObject: Dinero<TAmount>];

export type IsZeroDependencies<TAmount> = Dependencies<TAmount>;

export function isZero<TAmount>({ calculator }: IsZeroDependencies<TAmount>) {
  const equalFn = equal(calculator);

  return function _isZero(...[dineroObject]: IsZeroParams<TAmount>) {
    const { amount } = dineroObject.toJSON();

    return equalFn(amount, calculator.zero());
  };
}
