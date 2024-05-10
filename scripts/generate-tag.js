import { error, execSync, getLatestTag, info, releaseTypes, rl } from './utils.js';

const getNewSemVerNumber = (semVerNumber, releaseType) => {
  const semVerNumberAsArray = semVerNumber.split('.');
  const idxToUpdate = releaseType;
  semVerNumberAsArray[idxToUpdate] = Number(semVerNumberAsArray[idxToUpdate]) + 1;
  for (let i = idxToUpdate + 1; i < semVerNumberAsArray.length; i += 1) {
    semVerNumberAsArray[i] = 0;
  }
  return semVerNumberAsArray.join('.');
};

const bumpSemVer = (releaseTypeIndex) => {
  const currentVersion = getLatestTag();

  info('Current version is', currentVersion);
  const semVerNumber = currentVersion.split('v')[1];
  const newSemVerNumber = getNewSemVerNumber(semVerNumber, releaseTypeIndex);
  info(
    `Updated semantic version number [type: ${releaseTypes[releaseTypeIndex]}]`,
    newSemVerNumber
  );
  return newSemVerNumber;
};

const cutTagForSemVer = (newSemVerNumber) => {
  const shouldCutTag = rl.keyInYN(`\nNext version to release is ${newSemVerNumber}, okay?`);
  if (!shouldCutTag) {
    info('Got it! Not cutting a new tag, exiting now.');
    process.exit(0);
  }
  info('Cutting new tag...');

  execSync(`git tag -a release/v${newSemVerNumber} -m "v4-web release v${newSemVerNumber}"`);
  execSync(`git push origin release/v${newSemVerNumber}`);
  info('New tag successfully published!');
  process.exit(0);
};

const ask = async () => {
  const releaseTypeIndex = rl.keyInSelect(releaseTypes, '\nWhat kind of release is this?');
  if (releaseTypeIndex === -1) {
    info('Exiting...');
    process.exit(0);
  }
  info('Release type:', releaseTypes[releaseTypeIndex]);
  info('Checking git status cleanliness...');
  const uncommittedChanges = execSync('git status --porcelain');
  info(uncommittedChanges);
  if (uncommittedChanges) {
    error('You have uncommitted changes, please clean up your git status first\n');
    process.exit(1);
  }
  info('Checking out main and pulling latest changes...');
  execSync('git checkout main && git pull origin main && git fetch --all');
  const newSemVerNumber = bumpSemVer(releaseTypeIndex);
  cutTagForSemVer(newSemVerNumber);
};

ask();
