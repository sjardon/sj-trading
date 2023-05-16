import { Module } from '@nestjs/common';
import { HelperErrorService } from './services/error/helper.error.service';

@Module({
  providers: [HelperErrorService],
  exports: [HelperErrorService],
})
export class HelpersModule {}
