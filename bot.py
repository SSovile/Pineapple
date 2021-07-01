from atexit import register
from sqlite3 import connect
import telebot
from telebot import types
from config import API_TOKEN
from Classbot import *
from time import sleep

bot = telebot.TeleBot(API_TOKEN)


@bot.message_handler(commands=['start'])
def start_message(message):
    bot.send_message(message.chat.id, 'Привіт😊,давайте зареєструємось!'
                                      'Використайте команду /registration для вашої реєстрації ')


@bot.message_handler(commands=['registration'])
def registration(message):
    bot.send_message(message.chat.id, "Введіть ваше ім'я:")
    first_name = input()
    bot.send_message(message.chat.id, "Введіть ваше прізвище:")
    last_name = input()
    bot.send_message("Ваше ім'я:" + str(first_name) + "та прізвище:" + str(last_name))


'''
    if message.text == 'Підтвердити':
        bot.send_message(message.chat.id, "Введіт ім'я на яке буде здійснено замовлення")

    keyreg = telebot.types.InlineKeyboardMarkup()
    keyreg.add(telebot.types.InlineKeyboardButton('Підтвердити 🗹',
                                                    reply_markup=registration(message)))
    keyreg.add(telebot.types.InlineKeyboardButton('Скасувати ❌ ',
                                                    reply_markup=unregistrarion(message)))
 
def registration(message):
    bot.send_message(message.chat.id, "Введіт ім'я на яке буде здійснено замовлення")

def unregistration(message):
    bot.send_message(message.chat.id, "Бувай ")
'''


@bot.message_handler(commands=['info'])
def info_message(message):
    keyboard = telebot.types.InlineKeyboardMarkup()
    keyboard.add(telebot.types.InlineKeyboardButton('Instagram臾',
                                                    url='https://instagram.com/samsmak.lviv?igshid=12ivq4e31wyfm'))
    keyboard.add(telebot.types.InlineKeyboardButton('Facebook 💆📚',
                                                    url='https://www.facebook.com/pekarnya.SamSMAK/'))
    keyboard.add(telebot.types.InlineKeyboardButton('Геолокація',
                                                    url='https://www.google.com/maps/@49.8545457,24.032645,3a,75y,'
                                                        '55.77h,'
                                                        '86.18t/data=!3m8!1e1!3m6!1sAF1QipM_Va12E2A4BafGy'
                                                        '-2BDMEtR9uUVno0N7xy1dSk!2e10!3e11!6shttps:%2F%2Flh5'
                                                        '.googleusercontent.com%2Fp%2FAF1QipM_Va12E2A4BafGy'
                                                        '-2BDMEtR9uUVno0N7xy1dSk%3Dw203-h100-k-no-pi-0-ya103.18154-ro'
                                                        '-0-fo100!7i8000!8i4000'))
    bot.send_message(message.chat.id, text='Choose', reply_markup=keyboard)


@bot.message_handler(commands=['settings'])
def sett_message(message):
    bot.send_message(message.chat.id, "Ваща кред. карта:", )
    markup_inline = types.InlineKeyboardMarkup()
    item_no = types.InlineKeyboardButton(text='Скасувати ❌', callback_data='no')
    item_yes = types.InlineKeyboardButton(text='Підтвердити 🗹', callback_data='yes')


@bot.message_handler(commands=['helps'])
def help_message(message):
    bot.send_message(message.chat.id, "Number: 093 934 8860")


@bot.callback_query_handler(func=lambda call: True)
def answer(call, message):
    if call.data == 'yes':
        bot.send_message(message.chat.id, "Введіть ім'я користувача:")
    elif call.data == 'no':
        bot.send_message(message.chat.id, "До зустрічі")


'''
@bot.message_handler(content_types='text')
def txt(message):
    if message.text == "Привіт":
        bot.send_message(message.chat.id, 'Привіт привіт👋!')
    elif message.text == "Доброго дня":
        bot.send_message(message.chat.id, 'Привіт привіт👋!')
    elif message.text == "Пака":
        bot.send_message(message.chat.id, 'До зустрічі✊!')
    elif message.text == "Бувай":
        bot.send_message(message.chat.id, 'До зустрічі✊!')
    else:
        bot.send_message(message.chat.id, "Моя не панімать")
'''

bot.polling(none_stop=True)
