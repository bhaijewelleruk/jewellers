const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function runMigration() {
  console.log('Connecting to Supabase PostgreSQL (aws-0-eu-west-1.pooler.supabase.com:5432)...');

  const client = new Client({
    host: 'aws-0-eu-west-1.pooler.supabase.com',
    port: 5432,
    user: 'postgres.dapncwwiscmjgnxyhnzf',
    password: 'ratebhai912',
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log('CONNECTED to Supabase PostgreSQL!');

    const sqlPath = path.join(__dirname, '..', 'src', 'lib', 'schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('Applying schema.sql to Supabase database...');
    await client.query(sqlContent);
    console.log('SUCCESS: schema.sql executed successfully!');

    // Verify all created tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\nCreated Tables:');
    res.rows.forEach((r, idx) => {
      console.log(`  ${idx + 1}. ${r.table_name}`);
    });

    // Check count of seeded products
    const prodCount = await client.query('SELECT count(*) FROM products;');
    const catCount = await client.query('SELECT count(*) FROM categories;');
    console.log(`\nSeeded Data Status:`);
    console.log(`  - Products: ${prodCount.rows[0].count}`);
    console.log(`  - Categories: ${catCount.rows[0].count}`);

    await client.end();
  } catch (err) {
    console.error('Migration error:', err);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
}

runMigration();
