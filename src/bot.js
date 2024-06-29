require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.Token_Telegram;
const bot = new TelegramBot(token, { polling: true });
const prisma = new PrismaClient();

async function salvarMensagem(texto, createdAt) {
  try {
    const mensagem = await prisma.mensagem.create({
      data: {
        texto: texto,
        createdAt: createdAt,
      },
    });
    console.log('Mensagem salva no banco de dados:', mensagem);
  } catch (error) {
    console.error('Erro ao salvar a mensagem:', error);
  }
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  const date = new Date();

  if (date.getHours() >= 9 && date.getHours() <= 18) {
    bot.sendMessage(chatId, 'https://faesa.br');
  } else {
    console.log(msg.text);
    if (msg.text.includes('@')) {
      await salvarMensagem(msg.text, date);
      bot.sendMessage(chatId, 'Recebemos o seu Email, aguarde e logo entraremos em contato.');
    } else {
      bot.sendMessage(chatId, 'Olá, nosso funcionamento é das 09 às 18 horas. Poderia nos informar o seu e-mail para podermos entrar em contato?');
    }
    
  }
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
