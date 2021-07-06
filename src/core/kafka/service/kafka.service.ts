import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka, Producer, Message } from 'kafkajs';
import { subscriptions } from '../decorator/subscribe.decorator';
import { config } from '../../config';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      brokers: config.kafkaBrokers,
      clientId: config.kafkaClientId,
    });
    this.consumer = this.kafka.consumer({
      groupId: config.kafkaConsumerGroupId,
    });
    this.producer = this.kafka.producer({});
  }

  async onModuleInit(): Promise<void> {
    await this.consumer.connect();
    await this.producer.connect();

    for (const [topic] of subscriptions) {
      await this.subscribe(topic, true);
    }
    await this.run();
  }

  /**
   * Shutdown hook listeners consume system resources, so they are disabled by default. To use shutdown hooks, you must enable listeners by calling enableShutdownHooks()
   * @see https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown
   */
  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
    await this.producer.disconnect();
  }

  public async sendMessage(
    message: Record<string, any>,
    options: Omit<Message, 'value'> = {},
  ): Promise<void> {
    const messageValue = this.serialize(message);

    await this.producer.send({
      topic: message.topic,
      messages: [{ ...options, value: messageValue }],
    });
  }

  private async subscribe(topic: string, fromBeginning = false): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning });
  }

  private async run() {
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const callback = subscriptions.get(topic);
        callback({
          transport: this,
          messageData: this.deserialize(message.value),
        });
      },
    });
  }

  private serialize(value: Record<string, any>): string {
    return JSON.stringify(value);
  }

  private deserialize(value: Buffer): Record<string, any> {
    return JSON.parse(value.toString());
  }
}
