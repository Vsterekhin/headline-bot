# Telegram-бот «Редактор заголовков»

Готовый каркас продакшн-MVP для внутреннего бота пресс-службы.

## Что умеет
- принимает текст пресс-релиза;
- генерирует 10 заголовков: официальные, громкие, для соцсетей;
- делает медиапакет: лид, пост в Telegram, короткую новость, анонс;
- поддерживает inline-кнопки и команды;
- хранит сессии и историю генераций в PostgreSQL;
- умеет работать через webhook или long polling;
- ограничивает доступ по whitelist;
- ограничивает частоту запросов.

## Быстрый запуск
1. Скопируйте `.env.example` в `.env` и заполните переменные.
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Сгенерируйте Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Поднимите PostgreSQL и Redis:
   ```bash
   docker compose up -d postgres redis
   ```
5. Выполните миграцию Prisma:
   ```bash
   npx prisma migrate dev --name init
   ```
6. Запустите бота:
   ```bash
   npm run dev
   ```

## Режимы
- `BOT_MODE=polling` — для локальной разработки.
- `BOT_MODE=webhook` — для продакшна.

## Команды
- `/start`
- `/help`
- `/reset`
- `/more`
- `/official`
- `/loud`
- `/social`
- `/short`
- `/mediapack`

## Важно
- Реальный API-ключ LLM нужно добавить вручную.
- Для webhook укажите публичный HTTPS URL в `TELEGRAM_WEBHOOK_URL`.
- Для закрытого режима заполните `ALLOWED_USER_IDS`.
