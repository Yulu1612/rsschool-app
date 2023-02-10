import config from '../../config.ts';
import { Exception } from '../../utils/exception.ts';

const { token, channelId, adminChannelId } = config.telegram;

const baseUrl = `https://api.telegram.org/bot${token}`;

/**
 * https://core.telegram.org/bots/api#making-requests
 */
// deno-lint-ignore no-explicit-any
const request = async (methodName: string, body: any) => {
  try {
    const response = await fetch(`${baseUrl}/${methodName}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    if (json.ok === false) {
      throw new Exception('Telegram Api', json.description, json.error_code);
    }

    return json;
  } catch (error) {
    throw error instanceof Exception
      ? error
      : new Exception('Telegram Api', error.message ?? 'Unknown error', 500);
  }
}

export const sendMessage = (text: string) => request('sendMessage', {
  chat_id: channelId,
  text,
});

export const notifyAdmin = (text: string) => request('sendMessage', {
  chat_id: adminChannelId,
  text,
});

export const editMessageText = (id: number, text: string) => request('editMessageText', {
  chat_id: channelId,
  message_id: id,
  text,
});

export const deleteMessage = (id: number) => request('deleteMessage', {
  chat_id: channelId,
  message_id: id,
});
