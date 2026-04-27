# Campus Connect (Local Setup)

This project uses:

- Vite + React frontend
- PHP endpoints served by XAMPP Apache
- MySQL (XAMPP MariaDB)
- Node.js Socket.IO server
- Node.js upload server

## 1. Place the Project in htdocs

Expected path in this setup:

`c:/xampp/htdocs/Distributed-System---Campus-Connect`

If your folder name is different, update `VITE_PHP_BASE_URL` in `.env`.

## 2. Start XAMPP Services

From XAMPP Control Panel, start:

- Apache
- MySQL

## 3. Configure Credentials

1. In `CC/src/php/config.php`, set DB credentials.
2. In `CC/.env`, set matching DB credentials for Node servers.

You can copy `CC/.env.example` to `CC/.env` and edit values.

## 4. Install Node Dependencies

From `CC/`:

```bash
npm install
```

## 5. Run the App

From `CC/`:

```bash
npm run start:all
```

This starts:

- Vite frontend at `http://localhost:5173`
- Socket server at `http://localhost:3000`
- Upload server at `http://localhost:3090`

## 6. Database Bootstrap

No manual SQL import is required for initial setup.

On first PHP request (`signup.php` / `login.php`), `src/php/database.php` now auto-creates:

- `ccisconnectusers` database
- `users`
- `messages`
- `rooms`
- `uploaded_files`
- `contacts`

## 7. Common Issues

- MySQL auth error:
  Ensure `CC/src/php/config.php` and `CC/.env` use the same `DB_USER` / `DB_PASS`.
- CORS/session issues:
  Use frontend URL `http://localhost:5173`.
- PHP route not found:
  Verify `VITE_PHP_BASE_URL` points to your actual htdocs folder path.
