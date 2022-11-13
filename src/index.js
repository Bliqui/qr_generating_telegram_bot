import TelegramBot from "node-telegram-bot-api";
import ImageDataURI from "image-data-uri";
import { config } from "dotenv";
import { generateQR } from "./helpers/qrGeneration.js";
import { urlPattern } from "./helpers/patterns.js";
import { QR_PATH } from "./common/commonPaths.js";
import { MESSAGES } from "./common/messages.js";
import { COMMANDS } from "./common/commands.js";

const BOT_KEY = config().parsed?.BOT_KEY;

if (!BOT_KEY) {
  console.error(
    "Seems like you forgot to pass Telegram Bot Token. I can not proceed..."
  );
  process.exit(1);
}

const bot = new TelegramBot(BOT_KEY, {
  polling: true,
});

bot.on("message", async (msg) => {
  const {
    chat: { id },
    text,
  } = msg;

  if (text === COMMANDS.START) {
    return bot.sendMessage(id, MESSAGES.GREET);
  } else if (!text || !text.match(urlPattern)) {
    return bot.sendMessage(id, MESSAGES.INVALID_FORMAT);
  } else {
    const imgPath = await ImageDataURI.outputFile(
      await generateQR(text),
      QR_PATH
    );

    return bot.sendPhoto(id, imgPath);
  }
});
