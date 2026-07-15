const { Client } = require('pg');
const fs = require('fs');
const dns = require('dns');

async function resolveIPv4(hostname) {
  return new Promise((resolve, reject) => {
    dns.resolve4(hostname, (err, addresses) => {
      if (err) reject(err);
      else resolve(addresses[0]);
    });
  });
}

async function main() {
  let client;
  try {
    const ip = await resolveIPv4('db.oqiwcisjpclimeckjazg.supabase.co');
    console.log(`Resolved IPv4: ${ip}`);

    client = new Client({
      host: ip,
      port: 5432,
      user: 'postgres',
      password: 'ym6c41Z0oSw6esJU',
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    console.log('Connected to Supabase PostgreSQL');

    // 先查看现有表
    const res = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"
    );
    console.log(`现有 ${res.rows.length} 张表:`);
    res.rows.forEach(r => console.log(`  - ${r.tablename}`));

    // 读取并执行建表SQL
    const sql = fs.readFileSync('/tmp/init_schema.sql', 'utf8');
    console.log('\n开始执行建表SQL (长度: ' + sql.length + ' 字符)...');
    
    await client.query(sql);
    console.log('✅ 建表SQL执行完成!');

    // 再次查看表
    const res2 = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"
    );
    console.log(`\n执行后共 ${res2.rows.length} 张表:`);
    res2.rows.forEach(r => console.log(`  - ${r.tablename}`));

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    if (client) await client.end();
  }
}

main();
