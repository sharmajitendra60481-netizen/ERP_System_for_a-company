import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getAppStatus() {
    return {
      status: 'online',
      message: '🚀 OilERP Edible Oil REST API Server is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      webPortalUrl: 'http://localhost:3000',
    };
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
