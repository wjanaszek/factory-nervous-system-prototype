export class QuantityVO {
  private constructor(private readonly value: number) {}

  static create(amount: number): QuantityVO {
    if (amount < 0) {
      throw new Error('Quantity cannot be negative');
    }
    if (!Number.isInteger(amount)) {
      throw new Error('Quantity must be an integer');
    }
    return new QuantityVO(amount);
  }

  static zero(): QuantityVO {
    return new QuantityVO(0);
  }

  getValue(): number {
    return this.value;
  }

  add(other: QuantityVO): QuantityVO {
    return QuantityVO.create(this.value + other.value);
  }

  subtract(other: QuantityVO): QuantityVO {
    const result = this.value - other.value;

    if (result < 0) {
      throw new Error('Resulting quantity cannot be negative');
    }

    return QuantityVO.create(result);
  }

  isGreaterThanOrEqual(other: QuantityVO): boolean {
    return this.value >= other.value;
  }
}
