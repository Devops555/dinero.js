import { ChainableDinero, Calculator } from '../types';

function isPositive<TAmountType>(calculator: Calculator<TAmountType>) {
  return (dineroObject: ChainableDinero<TAmountType>) => {
    return calculator.greaterThanOrEqual(
      dineroObject.getAmount(),
      calculator.zero()
    );
  };
}

export default isPositive;