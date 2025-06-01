const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

const dockerContainer = 'mysql';
const dbName = process.env.MYSQL_DATABASE;
const dbUser = process.env.MYSQL_USER;
const dbPassword = process.env.MYSQL_PASSWORD;
const backupDir = path.join(__dirname, '..', 'backups', 'mysql');

// Obtiene el archivo .sql más reciente
function getLatestSQLFile() {
  const files = fs.readdirSync(backupDir)
    .filter(file => file.endsWith('.sql'))
    .map(file => ({
      name: file,
      time: fs.statSync(path.join(backupDir, file)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);

  return files.length > 0 ? files[0].name : null;
}

const latestSQL = getLatestSQLFile();

if (!latestSQL) {
  console.error('❌ No se encontró ningún archivo .sql en la carpeta backups/mysql');
  process.exit(1);
}

const localPath = path.join('backups', 'mysql', latestSQL);
const containerPath = `/tmp/${latestSQL}`;

const copyCommand = `docker cp ${localPath} ${dockerContainer}:${containerPath}`;
const restoreCommand = `docker exec ${dockerContainer} sh -c "mysql -u ${dbUser} -p${dbPassword} ${dbName} < ${containerPath}"`;

exec(copyCommand, (copyError) => {
  if (copyError) {
    console.error(`❌ Error al copiar el backup: ${copyError.message}`);
    return;
  }
  console.log(`✅ Copiado ${latestSQL} al contenedor`);

  exec(restoreCommand, (restoreError) => {
    if (restoreError) {
      console.error(`❌ Error al restaurar el backup: ${restoreError.message}`);
      return;
    }
    console.log(`✅ Restauración completada con ${latestSQL}`);
  });
});


// Es necesario ir a /etc/my.cnf y agregar:
// log_bin_trust_function_creators=1
// Con esto se tiene superiores permisos.

// Otra manera es entrando desde la consola a docker:
// docker exec -it mysql bash
// mysql -u root -p
// contrasena del root
// set global log_bin_trust_function_creators = 1;