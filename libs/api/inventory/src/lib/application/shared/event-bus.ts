import { Injectable } from '@nestjs/common';
import { DomainEvent } from '../../domain/shared/domain-event';

export interface EventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void>;
}

@Injectable()
export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  register<T extends DomainEvent>(
    eventName: string,
    handler: EventHandler<T>
  ): void {
    const existing = this.handlers.get(eventName) || [];
    this.handlers.set(eventName, [...existing, handler as EventHandler]);
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];

    await Promise.all(
      handlers.map((handler) =>
        handler.handle(event).catch((error) => {
          console.error(`Error handling event ${event.type}:`, error);
        })
      )
    );
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    await Promise.all(events.map((event) => this.publish(event)));
  }
}
