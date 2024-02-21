# Prisma Debug Logs
Prisma Debug Logs is an NPM package designed to aid in the debugging of applications using Prisma by providing enhanced logging capabilities.
This package can be easily integrated into your Node.js projects as a development dependency to facilitate the capture and analysis of Prisma-generated SQL queries.

### Features
 - Logs all prisma operations along with their generated SQL queries
 - Logs execution duration and PostgreSQL query plans to catch suboptimal queries
 - Easy integration: Seamlessly fits into your existing Prisma projects with minimal configuration.

### Limitations
 - `StatementExplainer` interface currently only has an implementation for Postgres, but you can make a PR for other RDBMS
 - Code is untested and shouldn't be used on production db
 - The prisma extension forces operations to run synchronously, so will be a lot slower

### Installation
Install prisma-debug-logs as a development dependency in your Node.js project using npm:

```bash
npm install --save-dev prisma-debug-logs
```

### Usage
After installation, you can configure Prisma Debug Logs in your project to start capturing Prisma logs. Here's a simple example to get you started:

```typescript
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

import {
  DbLogger,
  ExplainingConsolePrinter,
  ExtendClient,
  PgStatementExplainer,
} from 'prisma-debug'

function getDebugDbLogger(dbUrl: string) {
  const pool = new Pool({
    connectionString: dbUrl,
  });

  const pgStatementExplainer = new PgStatementExplainer(pool);
  const explainingConsolePrinter = new ExplainingConsolePrinter(pgStatementExplainer);

  return new DbLogger(explainingConsolePrinter);
}

function getDebugPrismaClient(dbUrl: string) {
  return ExtendClient(
    new PrismaClient({
      datasources: { db: { url: dbUrl } },
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    }),
    getDebugDbLogger(dbUrl),
  );
}

const client = getDebugPrismaClient('postgres://YourUserName:YourPassword@localhost:5432/YourDatabase')

const result = await client.orders.findMany({
  where: {
    order_id: 123,
  },
  include: {
    products: true,
  },
})
```

### Contributing
Contributions are welcome! If you have ideas on how to improve Prisma Debug Logs or have encountered issues, feel free to open an issue or submit a pull request.

### License
This project is licensed under the MIT License.
