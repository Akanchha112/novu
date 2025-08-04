import { ChannelTypeEnum, SmsProviderIdEnum, ICredentials } from '@novu/shared';
import { WebhostSmsProvider } from '@novu/providers';
import { BaseSmsHandler } from './base.handler';

export class WebhostSmsHandler extends BaseSmsHandler {
  constructor() {
    super(SmsProviderIdEnum.WebhostSms, ChannelTypeEnum.SMS);
  }

  buildProvider(credentials: ICredentials) {
  this.provider = new WebhostSmsProvider({
    baseUrl: credentials.baseUrl,
    apiKey: credentials.apiKey,
    from: credentials.from,
    peId: credentials.peid,
  });
}
}
