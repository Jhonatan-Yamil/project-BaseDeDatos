const cron = require('cron');
const { exec } = require('child_process');
require('dotenv').config();

const job = new cron.CronJob(
    '*/1 * * * *', // cada minuto
  function () {
    const dockerContainer = 'mysql';
    const DBUser = process.env.MYSQL_USER;
    const DBPassword = process.env.MYSQL_PASSWORD;
    const database = process.env.MYSQL_DATABASE;
    const folder = '/tmp';
    const currentDate = new Date();
    const fileName = `mysql_backup_${currentDate.toISOString().slice(0, 19).replace(/[:T]/g, '-')}.sql`;

    const backupCommand = `docker exec ${dockerContainer} sh -c "mysqldump -u ${DBUser} -p${DBPassword} ${database} > /tmp/${fileName}"`;
    const copyCommand = `docker cp ${dockerContainer}:/tmp/${fileName} ./backups/mysql/${fileName}`;

    exec(backupCommand, (error) => {
      if (error) {
        console.error(`MySQL backup failed: ${error.message}`);
        return;
      }

      exec(copyCommand, (copyError) => {
        if (copyError) {
          console.error(`Copy failed: ${copyError.message}`);
          return;
        }
        console.log(`✅ MySQL backup saved: backups/mysql/${fileName}`);
      });
    });
  },
  null,
  true
);
job.start();
console.log('🎯 MySQL backup job started');
