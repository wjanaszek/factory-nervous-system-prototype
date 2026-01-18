import { ItemSkuVO } from './item-sku.value-object';

describe(ItemSkuVO.name, () => {
  describe('create', () => {
    it('should create value object for valid SKU', () => {
      const sku = ItemSkuVO.create('abc-123');

      expect(sku).toBeInstanceOf(ItemSkuVO);
      expect(sku.getValue()).toBe('ABC-123');
    });

    it('should trim whitespace and uppercase the SKU', () => {
      const sku = ItemSkuVO.create('  abc-123  ');

      expect(sku.getValue()).toBe('ABC-123');
    });

    it('should throw if SKU is empty', () => {
      expect(() => ItemSkuVO.create('')).toThrow('SKU cannot be empty');
    });

    it('should throw if SKU is only whitespace', () => {
      expect(() => ItemSkuVO.create('   ')).toThrow('SKU cannot be empty');
    });

    it('should throw if SKU exceeds 30 characters', () => {
      const longSku = 'a'.repeat(31);

      expect(() => ItemSkuVO.create(longSku)).toThrow(
        'SKU cannot exceed 30 characters'
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal SKUs', () => {
      const sku1 = ItemSkuVO.create('abc-123');
      const sku2 = ItemSkuVO.create('ABC-123');

      expect(sku1.equals(sku2)).toBe(true);
    });

    it('should return false for different SKUs', () => {
      const sku1 = ItemSkuVO.create('abc-123');
      const sku2 = ItemSkuVO.create('xyz-999');

      expect(sku1.equals(sku2)).toBe(false);
    });
  });

  describe('getValue', () => {
    it('should return the normalized SKU value', () => {
      const sku = ItemSkuVO.create('sku-001');

      expect(sku.getValue()).toBe('SKU-001');
    });
  });
});
