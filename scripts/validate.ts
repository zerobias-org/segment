
import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import { UUID, URL } from '@auditmation/types-core-js';
import { VspStatusEnum } from '@auditmation/module-auditmation-auditmation-portal';

function isKnownFileType(filename: string): boolean {
  return (filename.toLowerCase().endsWith('.yml') || filename.toLowerCase().endsWith('.json'));
}

async function readAndParseFile(file: string, fullPathFile: string): Promise<any> {
  if (isKnownFileType(file)) {
    const fileData = (await fs.readFile(fullPathFile)).toString();

    // eslint-disable-next-line no-await-in-loop
    let name = file;

    if (name.indexOf('/') !== -1) {
      name = name.substring(name.lastIndexOf('/') + 1);
    }

    name = name.substring(0, name.lastIndexOf('.'));

    let document = null;

    if (file.endsWith('.yml')) {
      // YAML parser
      document = yaml.parse(fileData);
    } else if (file.endsWith('.json')) {
      // Native JSON parser
      document = JSON.parse(fileData);
    }

    return document;
  }

  throw new Error(`File type not supported: ${file}`);
}

async function processIndexYml(indexFile: Record<string, any>): Promise<string> {
  const code = indexFile.code !== undefined && indexFile.code !== null && indexFile.code !== '{code}' ? indexFile.code
    : new Error('code not found in index.yml');
  if (typeof code !== 'string') {
    throw new Error('code in index.yml needs replacement from {code}');
  }

  let check: any;
  check = indexFile.id !== undefined && indexFile.id !== null && indexFile.id !== '{id}' ? new UUID(indexFile.id)
    : new Error('id not found in index.yml');
  check = indexFile.name !== undefined && indexFile.name !== null && indexFile.name !== '{name}' ? indexFile.name
    : new Error('id not found in index.yml');
  if (typeof check !== 'string') {
    throw new Error('name in index.yml needs replacement from {name}');
  }

  check = indexFile.description !== undefined && indexFile.description !== null && indexFile.description !== '{description}'
    ? indexFile.description : new Error('description not found in index.yml');
  if (typeof check !== 'string') {
    throw new Error('description in index.yml needs replacement from {description}');
  }

  check = indexFile.segmentType !== undefined && indexFile.segmentType !== null && indexFile.segmentType !== '{segmentType}'
    ? indexFile.segmentType : new Error('segmentType not found in index.yml');
  if (typeof check !== 'string') {
    throw new Error('segmentType in index.yml needs replacement from {segmentType}');
  }

  check = indexFile.imageUrl !== undefined && indexFile.imageUrl !== null && indexFile.imageUrl !== '{imageUrl}'
    ? new URL(indexFile.imageUrl) : true;
  check = indexFile.externalId !== undefined && indexFile.externalId !== null && indexFile.externalId !== '{externalId}'
    ? indexFile.externalId : new Error('externalId not found in index.yml');
  if (typeof check !== 'string') {
    throw new Error('externalId in index.yml needs replacement from {externalId}');
  }

  return code;
}
// id: d1091a01-ea04-4f7f-887a-610357ef830a
// name: {name}
// description: {description}
// segmentType: {segmentType}
// imageUrl: https://cdn.auditmation.io/logos/zerobias-d_test-segment.svg
// code: d_test
// externalId: {externalId}
// status: active
// parents: []
// tags: []
// aliases: []

async function processPackageJson(packageFile: Record<string, any>, code: string): Promise<void> {

}

async function processArtifact(directory: string) {
  const checkDir = await fs.lstat(directory)
    .catch(() => undefined);

  if (!checkDir || !checkDir.isDirectory()) {
    throw new Error(`Path given is not found or not a directory: ${directory}`);
  }

  const checkIndexYml = await fs.lstat(path.join(directory, 'index.yml'))
    .catch(() => undefined);

  if (!checkIndexYml || !checkIndexYml.isFile()) {
    throw new Error(`index.yml file not found or not file in directory: ${directory}`);
  }

  const indexYml = await readAndParseFile('index.yml', path.join(directory, 'index.yml'));
  if (!indexYml) {
    throw new Error('Unable to parse index.yml');
  }

  const code = await processIndexYml(indexYml);
  const checkPackageJson = await fs.lstat(path.join(directory, 'package.json'))
    .catch(() => undefined);

  if (!checkPackageJson || !checkPackageJson.isFile()) {
    throw new Error(`package.json file not found or is not file in directory: ${directory}`);
  }

  const packageJson = await readAndParseFile('package.json', path.join(directory, 'package.json'));
  if (!packageJson) {
    throw new Error('Unable to parse package.json');
  }

  await processPackageJson(packageJson, code);
  const checkNpmrc = await fs.lstat(path.join(directory, '.npmrc'))
    .catch(() => undefined);

  if (!checkNpmrc || !checkNpmrc.isFile()) {
    throw new Error(`.npmrc file not found or is not file in directory: ${directory}`);
  }
}

(async () => {
  try {
    const directory = __dirname;
    await processArtifact(directory);
    console.log('Validation of artifact completed successfully.');
    process.exit(0);
  } catch (error: any) {
    console.error(`Validation failed ${error.message} - ${JSON.stringify(error.stack)}`);
    process.exit(1);
  }
});
