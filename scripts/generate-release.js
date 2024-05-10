import { execSync, getLatestTag, info, rl } from './utils.js';

const draftRelease = () => {
  const latestVersion = getLatestTag();
  const shouldDraftRelease = rl.keyInYN(`Draft release from latest version: ${latestVersion}?`);
  if (!shouldDraftRelease) {
    info('Exiting...');
    process.exit(0);
  }
  info(`Attempting to generate release based on latest version: ${latestVersion}`);
  execSync(`gh release create ${latestVersion} --generate-notes --draft`);
  process.exit(0);
};

draftRelease();
