import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HelperErrorService {
  private readonly logger = new Logger(HelperErrorService.name);

  handle(error: Error) {
    this.logger.log(error.message);
    throw error;
  }
}
