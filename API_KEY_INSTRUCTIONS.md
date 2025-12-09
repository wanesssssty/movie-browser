# Інструкції щодо API ключа OMDB

## Як отримати API ключ

1. Перейдіть на http://www.omdbapi.com/apikey.aspx
2. Виберіть безкоштовний план (Free - 1,000 daily limit)
3. Введіть вашу email адресу
4. Перевірте пошту та підтвердіть реєстрацію
5. Скопіюйте отриманий API ключ

## Як додати API ключ до проєкту

1. Відкрийте файл `screens/SearchScreen.js`
2. Знайдіть рядок: `const OMDB_API_KEY = 'YOUR_KEY';`
3. Замініть `'YOUR_KEY'` на ваш API ключ: `const OMDB_API_KEY = 'ваш_ключ_тут';`

4. Відкрийте файл `screens/DetailsScreen.js`
5. Знайдіть рядок: `const OMDB_API_KEY = 'YOUR_KEY';`
6. Замініть `'YOUR_KEY'` на ваш API ключ: `const OMDB_API_KEY = 'ваш_ключ_тут';`

## Альтернатива: Використання mockData.js

Якщо ви хочете протестувати додаток без API ключа, ви можете використовувати mockData.js (якщо він існує в проєкті).

