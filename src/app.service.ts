import { Injectable } from '@nestjs/common';
import { KafkaService } from './core/kafka/service/kafka.service';

@Injectable()
export class AppService {
  constructor(private readonly kafkaService: KafkaService) {}

  async getDemo(): Promise<string> {
    await this.kafkaService.sendMessage({
      topic: 'demo.get',
      data: 'Hello Demo!',
    });

    return 'Hello Demo!';
  }
}
