import { lessThan } from '../utils';

import type { Dinero } from '../types';
import type { Dependencies } from './types';

export type IsNegativeParams<TAmount> = readonly [
  dineroObject: Dinero<TAmount>
];

export type IsNegativeDependencies<TAmount> = Dependencies<TAmount>;

export function isNegative<TAmount>({
  calculator,
}: IsNegativeDependencies<TAmount>) {
  const lessThanFn = lessThan(calculator);

  return function _isNegative(...[dineroObject]: IsNegativeParams<TAmount>) {
    const { amount } = dineroObject.toJSON();

    return lessThanFn(amount, calculator.zero());
  };
}
