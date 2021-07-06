import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './core/exception/filter/http-exception.filter';
import { ExceptionInterceptor } from './core/exception/interceptor/exception.interceptor';
import { KafkaModule } from './core/kafka/kafka.module';
import { DemoModule } from './module/demo/demo.module';

@Module({
  imports: [DemoModule, KafkaModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
