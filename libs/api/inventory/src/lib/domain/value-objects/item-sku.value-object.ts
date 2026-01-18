export class ItemSkuVO {
  private constructor(private readonly value: string) {}

  static create(sku: string): ItemSkuVO {
    if (!sku || sku.trim().length === 0) {
      throw new Error('SKU cannot be empty');
    }

    if (sku.length > 30) {
      throw new Error('SKU cannot exceed 30 characters');
    }

    return new ItemSkuVO(sku.trim().toUpperCase());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ItemSkuVO): boolean {
    return this.value === other.value;
  }
}
