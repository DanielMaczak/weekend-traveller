# Weekend Traveller

One-page web application to search for the cheapest flights from any airport to all other connected reports.
Ideal when planning weekend trips or summer vacation abroad when not sure when exactly or where do you want to go.

This project is in development so some parts still require polishing.

![image](https://github.com/DanielMaczak/weekend-traveller/assets/145442574/9ad86165-0c7f-4e9f-ab7c-b9dcab212734)

![image](https://github.com/DanielMaczak/weekend-traveller/assets/145442574/73cf28f6-2749-47ba-96f2-a1cc9b47ef07)

### Server features

1. Follows MVC pattern
2. API data structure separated from front-end logic
3. Cron job for refresh of static resources
4. Centralized error handling

### Client features

1. Fully responsive
2. Beautiful transitions between screens
3. Loaded results are cached to avoid duplicate API calls
4. Unit and integration tests (need revision)

## Getting started

1. Run `npm i` in both `client` and `server` folders.
2. Create the `.env` file in `server` based on the example.
3. Update server address in `client` in constants service (`src/services/const.service.tsx`).
4. Start the database service, and run `npm run dev` script in both `client` and `server` folders to see the app live in your browser.

### Dependencies

The application works with Postgres DB via Sequelize so it should be possible to switch to other DBs if supported by Sequelize.
You can adjust the `server` connection properties in `src/databases/flightData.database.ts`.

## Tech stack

Server: Express, Node-Cron, Sequelize (with Postgres)

Client: React (with Vite), Vitest
