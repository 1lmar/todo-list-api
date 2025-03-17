# Используем официальный образ Node.js
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем только production-зависимости
RUN npm install

# Копируем весь код в контейнер
COPY . .

# Компилируем TypeScript в JavaScript
RUN npm run build

# ---- Production stage ----
FROM node:18-alpine AS runner

WORKDIR /app

# Копируем собранный код и зависимости из builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Определяем переменные окружения
ENV NODE_ENV=production

# Запускаем приложение
CMD ["node", "dist/main"]