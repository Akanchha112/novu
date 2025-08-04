import { test, expect } from 'vitest';
import { WebhostSmsProvider } from './webhost-sms.provider';

test('should trigger Webhost SMS provider successfully', async () => {
  const provider = new WebhostSmsProvider({
    baseUrl: 'https://example.com/send',
    apiKey: 'test-api-key',
    from: 'SENDERID',
    peId: 'PE123456',
    templateId: 'TMP123456',
  });

  const response = await provider.sendMessage({
    to: '919000000000',
    content: 'Hello from test!',
  });

  expect(response.id).toBeDefined();
},15000);
