export interface OperationInterface<T, R> {
  values: T;

  resolve(): R;
}
