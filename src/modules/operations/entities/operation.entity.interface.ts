export interface OperationInterface {
  isOpen(): boolean;

  isClose(): boolean;

  isBoth(): boolean;

  isLong(): boolean;

  isShort(): boolean;
}
