const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

const dockerContainer = 'proyecto-valorant-postgres';
const dbName = process.env.POSTGRES_DB;
const dbUser = process.env.POSTGRES_USER;
const backupDir = path.join(__dirname, '..', 'backups', 'postgres');

// Busca el archivo .dump más reciente
function getLatestDumpFile() {
  const files = fs.readdirSync(backupDir)
    .filter(file => file.endsWith('.dump'))
    .map(file => ({
      name: file,
      time: fs.statSync(path.join(backupDir, file)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time); // Odena por fecha descendente

  return files.length > 0 ? files[0].name : null;
}

const latestDump = getLatestDumpFile();

if (!latestDump) {
  console.error('❌ No se encontró ningún archivo .dump en la carpeta backups/postgres');
  process.exit(1);
}

const localPath = path.join('backups', 'postgres', latestDump);
const containerPath = `/tmp/${latestDump}`;

// Copia y restaura
const copyCommand = `docker cp ${localPath} ${dockerContainer}:${containerPath}`;
const restoreCommand = `docker exec -u postgres ${dockerContainer} pg_restore -U ${dbUser} -d ${dbName} -c ${containerPath}`;

exec(copyCommand, (copyError) => {
  if (copyError) {
    console.error(`❌ Error al copiar el backup: ${copyError.message}`);
    return;
  }
  console.log(`✅ Copiado ${latestDump} al contenedor`);

  exec(restoreCommand, (restoreError) => {
    if (restoreError) {
      console.error(`❌ Error al restaurar el backup: ${restoreError.message}`);
      return;
    }
    console.log(`✅ Restauración completada con ${latestDump}`);
  });
});
