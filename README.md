# bliphunt
> Issue and feature tracking for any app.

## Running Locally
### Downloading
You can clone this repository and install any needed dependencies by using:
```
git clone https://github.com/hparcells/bliphunt.git
npm i
```

### Required `.env` Variables
- `DATABASE_USERNAME`
  - Database access username.
- `DATABASE_PASSWORD`
  - Database access password.
- `DATABASE_PRODUCTION_HOST`
  - The host IP pointing the develop production database. `localhost` if running locally.
- `DATABASE_DEVELOPMENT_HOST`
  - The host IP pointing to the development database. `localhost` if running locally.
- `DATABASE_PORT`
  - The port of the MongoDB instance, `27017` is default.
- `DATABASE_NAME`
  - The name of the database to use inside of MongoDB. This will be used for the production database, and `DATABASE_NAME.dev` will be used for the development database.

### Running and Building
Given that the MongoDB database is running, you can start the website in a development by running:
```
npm run dev
```

Building the app is run using:
```
npm run build
```
This will run all the Jest tests along with building the server and client. The server will be output into the `/dist` directory and will need `/dist/server/server.js` to be run for everything to start.

## Tech Stack
- **M**ongoDB w/ Mongoose
- **E**xpress
- **R**eact w/ Next.js
- **N**ode.js
- TypeScript
- SASS/SCSS
- Jest

## Contributing
- All changes should be made on your fork.
- (optional) If any new business logic is created or any functions utility functions exist, tests should be made in the `/tests/` directory.
  - I'll probably write some if you don't.
- A pull request should be opened with your changes attempting to merge into this repository's `develop` branch.
- Tests should automatically be run before each of your commits, but regardless, all tests must pass within the pull request.
- Changes may be requested within your pull request.

## Sponsors
None! Be the first!
