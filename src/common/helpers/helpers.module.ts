import { Module } from '@nestjs/common';
import { HelperErrorService } from './services/error/helper.error.service';
import { SymbolsService } from './services/symbols/symbols.service';

@Module({
  providers: [HelperErrorService, SymbolsService],
  exports: [HelperErrorService],
})
export class HelpersModule {}
