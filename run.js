const fs = require('fs');

function getJsonStructure(obj) {
  function getType(val) {
    if (Array.isArray(val)) {
      if (val.length > 0) {
        const innerType = getType(val[0]);
        return `array[${innerType}]`;
      }
      return 'array';
    }
    return typeof val === 'number' ? 'numeric' : typeof val === 'boolean' ? 'boolean' : typeof val === 'string' ? 'string' : 'object';
  }

  function traverse(obj) {
    const summary = {};

    for (const key in obj) {
      const value = obj[key];
      const type = getType(value);

      if (type === 'array[object]') {
        summary[key] = traverse(value[0]);
      } else if (type === 'object') {
        summary[key] = traverse(value);
      } else {
        summary[key] = type;
      }
    }

    return summary;
  }

  return traverse(obj);
}

// Lê o conteúdo do arquivo de input
function readInputFile(fileName) {
  const content = fs.readFileSync(fileName, 'utf-8');
  return JSON.parse(content);
}

// Escreve o resultado em um arquivo de output
function writeOutputFile(fileName, data) {
  fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf-8');
}

// Lista todos os arquivos de input na pasta "input" e processa cada um deles
const inputFiles = fs.readdirSync('./input');
inputFiles.forEach((fileName) => {
  const inputFile = `./input/${fileName}`;
  const inputData = readInputFile(inputFile);
  const summary = getJsonStructure(inputData);
  const outputFile = `./output/${fileName.replace('.json', '.txt')}`;
  writeOutputFile(outputFile, summary);
});
