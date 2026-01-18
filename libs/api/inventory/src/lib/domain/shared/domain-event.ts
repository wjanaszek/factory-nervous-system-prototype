export abstract class DomainEvent<TPayload = unknown> {
  abstract readonly type: string;
  abstract readonly payload: TPayload;
  date!: Date;
}
