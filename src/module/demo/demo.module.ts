import { Module } from '@nestjs/common';
import { DemoService } from './service/demo.service';

@Module({
  providers: [DemoService],
})
export class DemoModule {}
