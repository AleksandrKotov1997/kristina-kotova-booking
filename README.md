# Kristina Kotova Booking

Персональный сайт Kristina Kotova Lash & Brow Studio с онлайн-записью.
Проект собирается поэтапно по ТЗ: публичный сайт, услуги и работы из базы,
запись и закрытый кабинет мастера.

## Стек

Next.js App Router, React, TypeScript, Ant Design, CSS Modules,
TanStack Query, Axios, React Hook Form и Zod. Для критичной бизнес-логики
предусмотрены Vitest и React Testing Library. База и авторизация — Supabase
на соответствующих этапах разработки.

## Локальный запуск

Нужны Node.js 20.9+ и pnpm.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Сайт открывается на http://localhost:3000. Для текущего публичного Header
переменные окружения не нужны. Настройки Supabase добавляются вместе
с подключением базы; секреты хранятся в `.env.local` и не попадают в Git.

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm start
```

## Архитектура

- `src/app` — маршруты, layout и Route Handlers. Страницы подключают views.
- `src/views` — композиция конкретных экранов.
- `src/components` — общие компоненты и публичный AppLayout.
- `src/features` — логика фич: model, api, hooks.
- `src/shared` — общая инфраструктура, включая Axios-клиент.
- `src/app/globals.css` — дизайн-токены; локальные стили — в CSS Modules.

Такое разделение повторяет принцип архитектурного референса,
а backend остаётся внутри Next.js.

## Текущий этап

Публичный Header для desktop: логотип со ссылкой на главную, бренд,
шесть пунктов навигации, активная страница и кнопка записи. Общая разметка
рендерится на сервере; клиентским остаётся определение активного маршрута.
Шрифты Nunito и DM Serif Display подключены через `next/font`,
стили Ant Design включены в серверный HTML через AntdRegistry.
ESLint запрещает `any` и приведение типов через `as`/угловые скобки.

Ссылки `/works`, `/about` и `/#contacts` закреплены по ТЗ. Их назначения
реализуются после главного экрана; на этом этапе соответствующих страниц
и блока контактов ещё нет. Hero, мобильная адаптация и онлайн-запись
остаются отдельными задачами.
