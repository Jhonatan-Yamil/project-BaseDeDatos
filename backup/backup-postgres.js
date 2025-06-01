const cron = require('cron');
const { exec } = require('child_process');
require('dotenv').config();

const job = new cron.CronJob(
    '*/1 * * * *', // cada minuto
  function () {
    const dockerUser = 'postgres';
    const dockerContainer = 'proyecto-valorant-postgres';
    const DBUser = process.env.POSTGRES_USER;
    const database = process.env.POSTGRES_DB;
    const folder = '/tmp';
    const currentDate = new Date();
    const fileName = `pg_backup_${currentDate.toISOString().slice(0, 19).replace(/[:T]/g, '-')}.dump`;

    const backupCommand = `docker exec -u ${dockerUser} ${dockerContainer} pg_dump -U ${DBUser} -F c -d ${database} -f ${folder}/${fileName}`;
    const copyCommand = `docker cp ${dockerContainer}:${folder}/${fileName} ./backups/postgres/${fileName}`;

    exec(backupCommand, (error) => {
      if (error) {
        console.error(`Postgres backup failed: ${error.message}`);
        return;
      }

      exec(copyCommand, (copyError) => {
        if (copyError) {
          console.error(`Copy failed: ${copyError.message}`);
          return;
        }
        console.log(`✅ PostgreSQL backup saved: backups/postgres/${fileName}`);
      });
    });
  },
  null, 
  true
);
job.start(); 
console.log('🎯 PostgreSQL backup job started');
