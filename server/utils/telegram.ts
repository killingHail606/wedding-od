/**
 * Sends a plain-text message to the configured Telegram chat.
 * No-ops silently if the bot token / chat id are not configured.
 */
export async function notifyTelegram(text: string): Promise<void> {
  const config = useRuntimeConfig()
  const token = config.telegramBotToken
  const chatId = config.telegramChatId
  if (!token || !chatId) return

  try {
    await $fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      body: {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      },
    })
  }
  catch (error) {
    // Notifications are best-effort — never block the RSVP on this.
    console.error('[telegram] notification failed:', error)
  }
}
