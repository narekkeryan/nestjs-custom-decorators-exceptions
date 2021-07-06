import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Subscribe } from '../../../core/kafka/decorator/subscribe.decorator';

@Injectable()
export class DemoService {
  @Subscribe('demo.get')
  async get() {
    console.log('Get Demo.');

    throw new HttpException(
      'Internal Server Error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
