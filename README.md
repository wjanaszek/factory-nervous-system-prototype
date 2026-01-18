## Factory Nervous System Prototype

This is a prototype - missing things:

- [UI] displaying the log of changes for inventory stock
- [API & UI] authorization, roles etc.

### How to run application?

1. Setup NPM version (you have to have NVM manager installed):

```
nvm use
```

2. Make sure to have dependencies installed:
```
npm install
```

3. Initialize postgres database:

```
docker compose up -d
```

4. Run migrations:

```
npm run db:migrate
```

5. Start API:

```
npm run start:api
```

6. Start Web:

```
npm run start:web
```

### How to run unit tests for API?

```
npm run test
```

### How to run e2e test for Web?
TBD

### Taken approach:

- layered architecture (application, domain, infrastructure)
- domain logic separated from framework
- separated log for inventory changes and inventory stock data
- optimistic locking for concurrency requests in inventory stock changes (one of the 2 ongoing requests will fail)
- usage of event-oriented approach to log the changes (creating the inventory stock changelog)

### Main things:
`libs/api/inventory` --> module for handling the inventory tracking & transfer process
`apps/inventory-web` --> Next.js application
