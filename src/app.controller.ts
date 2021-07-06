import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getDemo(): Promise<string> {
    // throw new HttpException(
    //   'Internal Server Error',
    //   HttpStatus.INTERNAL_SERVER_ERROR,
    // );

    return this.appService.getDemo();
  }
}
