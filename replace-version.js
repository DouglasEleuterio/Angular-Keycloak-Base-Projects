let replace = require('replace-in-file');

try {
  let envLocation = process.env.npm_config_env_file;
  let buildVersion = process.env.npm_config_build_version;

  console.log('build version: ' + buildVersion);
  console.log('env file: ' + envLocation);

  const options = {
    files: envLocation,
    from: /version: '(.*)'/g,
    to: "version: '" + buildVersion + "'",
    allowEmptyPaths: false
  };

  let changedFiles = replace(options);
  if (changedFiles === 0) {
    throw "Favor verificar se o arquivo '" + options.files + "' contém o campo \"version: ''\" com o valor correto";
  }
} catch (error) {
  console.error('Ocorreu um erro ao realizar o replace da versão:', error);
  throw error;
}
