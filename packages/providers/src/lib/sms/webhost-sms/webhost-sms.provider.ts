import { ChannelTypeEnum, ISendMessageSuccessResponse, ISmsOptions, ISmsProvider } from '@novu/stateless';
import axios, { AxiosInstance } from 'axios';
import { BaseProvider, CasingEnum } from '../../../base.provider';
import { WithPassthrough } from '../../../utils/types';

// Optional: if not part of shared enums
const WEBHOST_SMS_PROVIDER_ID = 'webhost-sms';

interface IWebhostSmsConfig {
  baseUrl: string;
  apiKey: string;
  from: string;
  templateId?: string;
  peId: string;
}

export class WebhostSmsProvider extends BaseProvider implements ISmsProvider {
  id = WEBHOST_SMS_PROVIDER_ID;
  channelType = ChannelTypeEnum.SMS as ChannelTypeEnum.SMS;
  protected casing = CasingEnum.CAMEL_CASE;

  private axiosInstance: AxiosInstance;
  private config: IWebhostSmsConfig;

  constructor(config: IWebhostSmsConfig) {
    super();
    this.config = config;
    this.axiosInstance = axios.create({
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async sendMessage(
    options: ISmsOptions,
    bridgeProviderData: WithPassthrough<Record<string, unknown>> = {}
  ): Promise<ISendMessageSuccessResponse> {
    const apiKey = this.config.apiKey;
    const sender = options.from || this.config.from;
    const mobile = options.to;
    const message = options.content;
    const templateId = this.config.templateId || '';
    const peId = this.config.peId;

    const url = `${this.config.baseUrl}?apikey=${apiKey}&type=TEXT&sender=${sender}&mobile=${mobile}&tempId=${templateId}&peId=${peId}&message=${encodeURIComponent(message)}`;

    try {
      const response = await this.axiosInstance.get(url, {
        params: bridgeProviderData.body,
        ...(typeof bridgeProviderData.config === 'object' && bridgeProviderData.config !== null
          ? bridgeProviderData.config
          : {}),
      });

      const responseData = response.data;

      return {
        id: responseData?.messageId || `webhost-sms-${Date.now()}-${mobile}`,
        date: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('Error sending SMS via Webhost:', error);
      throw new Error(`Failed to send SMS via Webhost: ${error?.message || String(error)}`);
    }
  }
}
