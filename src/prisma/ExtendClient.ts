import DbLogger from '../model/DbLogger';
import StatementEvent from '../model/Statement';

/**
 * Create your primsa client with query events enabled like:
 *   const prisma = new PrismaClient({
 *     log: [
 *       {
 *         emit: 'event',
 *         level: 'query',
 *       },
 *     ],
 *   })
 */
const ExtendClient = <T>(prisma: T, logger: DbLogger): T => {
  const primsaAny = prisma as any;

  primsaAny.$on('query' as never, (e: any) => logger.addStatement(e as StatementEvent));

  return primsaAny.$extends({
    query: {
      async $allOperations(e: any) {
        await logger.startOperation(e);
        const result = await e.query(e.args);
        logger.endOperation();

        return result;
      },
    },
  }) as any;
};

export default ExtendClient;