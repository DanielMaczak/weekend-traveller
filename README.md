# Weekend Traveller

One-page web application to search for the cheapest flights from any airport to all other connected reports.
Ideal when planning weekend trips or summer vacation abroad when not sure when exactly or where do you want to go.

![image](https://github.com/DanielMaczak/weekend-traveller/assets/145442574/9ad86165-0c7f-4e9f-ab7c-b9dcab212734)

![image](https://github.com/DanielMaczak/weekend-traveller/assets/145442574/73cf28f6-2749-47ba-96f2-a1cc9b47ef07)

### Server features

1. Follows MVC pattern
2. External REST API data structure separated from front-end logic
3. Cron jobs for refresh of static resources in PostgreSQL database
4. Centralized error handling and guaranteed error catching
5. Test suite in Jest

### Client features

1. Fully responsive
2. Animated transitions between screens
3. Loaded results are cached to avoid duplicate data requests
4. Test suite via Vitest (in Jest)

## Getting started

1. Run `npm i` in both `client` and `server` folders.
2. Create the `.env` file in `server` based on the example.
3. Update server address in `client` in constants service (`src/services/const.service.tsx`).
4. Start the database service, and run `npm run dev` script in both `client` and `server` folders to see the app live in your browser.

### Dependencies

The application works with Postgres DB via Sequelize so it should be possible to switch to other DBs if supported by Sequelize.
You can adjust the `server` connection properties in `src/databases/flightData.database.ts`.

## Tech stack

Server: Express, Node-Cron, Sequelize (with Postgres), Jest

Client: React (with Vite), Jest (with Vitest)
