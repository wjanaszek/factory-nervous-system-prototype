import { QuantityVO } from './quantity.value-object';

describe(QuantityVO.name, () => {
  describe('create', () => {
    it('should create quantity for valid integer amount', () => {
      const quantity = QuantityVO.create(10);

      expect(quantity).toBeInstanceOf(QuantityVO);
      expect(quantity.getValue()).toBe(10);
    });

    it('should allow zero', () => {
      const quantity = QuantityVO.create(0);

      expect(quantity.getValue()).toBe(0);
    });

    it('should throw if amount is negative', () => {
      expect(() => QuantityVO.create(-1)).toThrow(
        'Quantity cannot be negative'
      );
    });

    it('should throw if amount is not an integer', () => {
      expect(() => QuantityVO.create(1.5)).toThrow(
        'Quantity must be an integer'
      );
    });
  });

  describe('zero', () => {
    it('should return zero quantity', () => {
      const zero = QuantityVO.zero();

      expect(zero.getValue()).toBe(0);
    });
  });

  describe('add', () => {
    it('should add two quantities', () => {
      const q1 = QuantityVO.create(5);
      const q2 = QuantityVO.create(3);

      const result = q1.add(q2);

      expect(result.getValue()).toBe(8);
    });

    it('should return a new instance (immutability)', () => {
      const q1 = QuantityVO.create(5);
      const q2 = QuantityVO.create(3);

      const result = q1.add(q2);

      expect(result).not.toBe(q1);
      expect(result).not.toBe(q2);
    });
  });

  describe('subtract', () => {
    it('should subtract quantities', () => {
      const q1 = QuantityVO.create(10);
      const q2 = QuantityVO.create(4);

      const result = q1.subtract(q2);

      expect(result.getValue()).toBe(6);
    });

    it('should throw if subtraction results in negative value', () => {
      const q1 = QuantityVO.create(3);
      const q2 = QuantityVO.create(5);

      expect(() => q1.subtract(q2)).toThrow(
        'Resulting quantity cannot be negative'
      );
    });
  });

  describe('isGreaterThanOrEqual', () => {
    it('should return true when quantity is greater', () => {
      const q1 = QuantityVO.create(10);
      const q2 = QuantityVO.create(5);

      expect(q1.isGreaterThanOrEqual(q2)).toBe(true);
    });

    it('should return true when quantities are equal', () => {
      const q1 = QuantityVO.create(5);
      const q2 = QuantityVO.create(5);

      expect(q1.isGreaterThanOrEqual(q2)).toBe(true);
    });

    it('should return false when quantity is smaller', () => {
      const q1 = QuantityVO.create(3);
      const q2 = QuantityVO.create(5);

      expect(q1.isGreaterThanOrEqual(q2)).toBe(false);
    });
  });
});
