/**
 * fix-migrations.js
 * 
 * Detects and repairs a stale Prisma migration state where migrations are
 * recorded as "applied" but the actual database tables don't exist.
 * 
 * Safe for repeated runs: if tables already exist, it does nothing.
 * Runs BEFORE `prisma migrate deploy` in the start command.
 */
const { PrismaClient } = require('@prisma/client');

async function fixMigrations() {
  const prisma = new PrismaClient();
  try {
    // Check if a core table from the init migration exists
    await prisma.$queryRawUnsafe('SELECT 1 FROM "Skill" LIMIT 1');
    console.log('[fix-migrations] Tables exist — no repair needed.');
  } catch (tableError) {
    // Tables missing — check if _prisma_migrations has stale records
    console.log('[fix-migrations] Core tables missing. Checking migration history...');
    try {
      const rows = await prisma.$queryRawUnsafe(
        'SELECT "migration_name" FROM "_prisma_migrations"'
      );
      if (rows.length > 0) {
        console.log(`[fix-migrations] Found ${rows.length} stale migration record(s). Clearing...`);
        await prisma.$executeRawUnsafe('DELETE FROM "_prisma_migrations"');
        console.log('[fix-migrations] Migration history cleared — prisma migrate deploy will re-apply all migrations.');
      } else {
        console.log('[fix-migrations] No stale records. Migrations will apply normally.');
      }
    } catch (metaError) {
      // _prisma_migrations table doesn't exist either — fresh DB, nothing to fix
      console.log('[fix-migrations] No migration table found — fresh database, nothing to fix.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

fixMigrations().catch((err) => {
  console.error('[fix-migrations] Unexpected error:', err.message);
  process.exit(0); // Don't block deployment even if fix fails
});
