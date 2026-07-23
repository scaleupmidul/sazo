export const sendTelegramMessage = async ({ botToken, chatId, text }) => {
  if (!botToken || !chatId) {
    return { success: false, error: 'Telegram Bot Token or Chat ID missing.' };
  }

  // Clean bot token if prefix 'bot' was included
  const cleanToken = botToken.trim().replace(/^bot/i, '');
  const cleanChatId = chatId.trim();

  const url = `https://api.telegram.org/bot${cleanToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: cleanChatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        disable_notification: false // Loud ringtone/sound notification on phone
      })
    });

    const data = await response.json();
    if (data.ok) {
      console.log(`[Telegram Bot] Notification sent successfully to Chat ID: ${cleanChatId}`);
      return { success: true, data };
    } else {
      console.error(`[Telegram Bot] Telegram API error response:`, data);
      return { success: false, error: data.description || 'Telegram API Error' };
    }
  } catch (error) {
    console.error(`[Telegram Bot] Connection error:`, error);
    return { success: false, error: error.message };
  }
};

export const sendTelegramOrderNotification = async (order, settings) => {
  if (!settings || settings.telegramEnabled === false) {
    return;
  }

  const botToken = settings.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = settings.telegramChatId || process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('[Telegram Bot] Bot token or Chat ID not configured.');
    return;
  }

  const itemsList = (order.cartItems || []).map((item, idx) => {
    const sizeStr = item.size ? ` (Size: ${item.size})` : '';
    const itemTotal = (item.quantity * item.price).toLocaleString();
    return `${idx + 1}. <b>${item.name}</b>${sizeStr}\n   └ <b>Qty:</b> ${item.quantity} × ৳${item.price.toLocaleString()} = <b>৳${itemTotal}</b>`;
  }).join('\n\n');

  const grandTotal = (order.total || 0).toLocaleString();
  const deliveryCharge = (order.shippingCharge || 0).toLocaleString();
  const discount = order.discountAmount || 0;

  const now = new Date();
  const timeStr = now.toLocaleString('en-US', {
    timeZone: 'Asia/Dhaka',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const message = `🔔 <b>SAZO — NEW ORDER RECEIVED!</b> 🛍️
━━━━━━━━━━━━━━━━━━
🆔 <b>Order ID:</b> #${order.orderId}
⏰ <b>Time:</b> ${timeStr}

👤 <b>Customer Details:</b>
• <b>Name:</b> ${order.firstName} ${order.lastName || ''}
• <b>Phone:</b> <code>${order.phone}</code>
• <b>Address:</b> ${order.address}
• <b>City/District:</b> ${order.city || 'N/A'}
• <b>Payment Method:</b> <b>${order.paymentMethod === 'Online' ? '💳 Online Payment' : '💵 Cash on Delivery (COD)'}</b>
${order.paymentDetails?.transactionId ? `• <b>Txn ID:</b> <code>${order.paymentDetails.transactionId}</code>\n• <b>Sender Number:</b> <code>${order.paymentDetails.paymentNumber}</code>\n` : ''}${order.note ? `• <b>Customer Note:</b> <i>${order.note}</i>\n` : ''}
📦 <b>Ordered Products:</b>
${itemsList}

━━━━━━━━━━━━━━━━━━
📊 <b>Summary:</b>
• <b>Delivery Fee:</b> ৳${deliveryCharge}
${discount > 0 ? `• <b>Discount:</b> -৳${discount.toLocaleString()}\n` : ''}💰 <b>TOTAL BILL: ৳${grandTotal}</b>

⚡ <i>Tap phone to open Admin Panel and process Order #${order.orderId}!</i>`;

  return await sendTelegramMessage({ botToken, chatId, text: message });
};
