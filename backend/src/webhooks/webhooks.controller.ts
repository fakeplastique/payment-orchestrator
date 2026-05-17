import { Controller, Post, Param, Body, Headers } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Public()
  @Post(':integrationId')
  handle(
    @Param('integrationId') integrationId: string,
    @Headers('x-webhook-signature') signature: string | undefined,
    @Body() payload: Record<string, any>,
  ) {
    return this.webhooksService.handleWebhook(integrationId, signature, payload);
  }
}
