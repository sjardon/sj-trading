import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TradingSessionsService } from '../services/trading-sessions.service';
import { CreateTradingSessionDto } from '../dto/create-trading-session.dto';
import { UpdateTradingSessionDto } from '../dto/update-trading-session.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('trading-sessions')
export class TradingSessionsController {
  constructor(
    private readonly tradingSessionsService: TradingSessionsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createTradingSessionDto: CreateTradingSessionDto) {
    return await this.tradingSessionsService.create(createTradingSessionDto);
  }

  @Get()
  findAll() {
    return this.tradingSessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tradingSessionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTradingSessionDto: UpdateTradingSessionDto,
  ) {
    return this.tradingSessionsService.update(id, updateTradingSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tradingSessionsService.remove(+id);
  }
}
