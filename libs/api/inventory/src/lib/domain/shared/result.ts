export class Result<T> {
  isSuccess: boolean;
  isFailure: boolean;
  error?: string;
  private _value?: T;

  private constructor(isSuccess: boolean, error?: string, value?: T) {
    if (isSuccess && error) {
      throw new Error(
        'InvalidOperation: A result cannot be successful and contain an error'
      );
    }
    if (!isSuccess && !error) {
      throw new Error(
        'InvalidOperation: A failing result needs to contain an error message'
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;
  }

  getValue(): T {
    if (!this.isSuccess) {
      throw new Error(
        "Can't get the value of an error result. Use 'errorValue' instead."
      );
    }

    return this._value as T;
  }

  static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }
}
