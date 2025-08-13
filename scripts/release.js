const fs = require('fs');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const packageJsonPath = './package.json';
const changelogPath = './CHANGELOG.md';

// Incrementa la versión según el tipo
function incrementVersion(version, type) {
  const [major, minor, patch] = version.split('.').map(Number);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error('Tipo de versión no válido');
  }
}

// Actualiza el archivo package.json y package-lock.json
function updatePackageJson(newVersion) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  if (fs.existsSync('./package-lock.json')) {
    const packageLockJson = JSON.parse(fs.readFileSync('./package-lock.json', 'utf8'));
    packageLockJson.version = newVersion;
    fs.writeFileSync('./package-lock.json', JSON.stringify(packageLockJson, null, 2));
  }
}

// Agrega el último commit al CHANGELOG.md
function updateChangelog(newVersion) {
  const lastCommit = execSync('git log -1 --pretty=%B').toString().trim();
  const commitHash = execSync('git log -1 --pretty=%h').toString().trim();
  const changelogEntry = `\n### ${newVersion} (${new Date().toISOString().split('T')[0]})\n\n* ${lastCommit} ([${commitHash}](https://github.com/juancuello98/comvi/commit/${commitHash}))\n`;
  fs.appendFileSync(changelogPath, changelogEntry);
}

// Menú interactivo
function showMenu() {
  console.log('Seleccione el tipo de versión:');
  console.log('1. Feature (minor)');
  console.log('2. Fix (patch)');
  console.log('3. Refactor (patch)');
  console.log('4. Major (major)');

  rl.question('Ingrese el número correspondiente: ', (answer) => {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const currentVersion = packageJson.version;

    let newVersion;
    switch (answer) {
      case '1':
        newVersion = incrementVersion(currentVersion, 'minor');
        break;
      case '2':
      case '3':
        newVersion = incrementVersion(currentVersion, 'patch');
        break;
      case '4':
        newVersion = incrementVersion(currentVersion, 'major');
        break;
      default:
        console.log('Opción no válida. Saliendo...');
        rl.close();
        return;
    }

    updatePackageJson(newVersion);
    updateChangelog(newVersion);

    console.log(`Versión actualizada a ${newVersion}`);
    console.log('Último commit agregado al CHANGELOG.md');
    rl.close();
  });
}

showMenu();