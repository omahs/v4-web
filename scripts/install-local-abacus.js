import { execSync } from 'child_process';

console.log("Cleaning...")
try {
    execSync('pnpm remove @dydxprotocol/v4-abacus', { stdio: "inherit" });   
    execSync('cd ../v4-abacus && ./gradlew clean', { stdio: "inherit" });   
} catch (error) {
    // Ignore failure - removal fail usually means package wasn't installed anyways.
}

console.log("Building abacus...")
try {
    execSync('cd ../v4-abacus && ./gradlew packJsPackage', { stdio: "inherit" });
} catch (error) {
    console.error('Error building abacus:', error);
    process.exit(1); 
}


console.log("Installing local abacus package...")
try {
    execSync("find ../v4-abacus/build/packages -name '*.tgz' | head -n 1 | xargs pnpm install", { stdio: "inherit" });
} catch (error) {
    console.error('Error installing abacus:', error);
    process.exit(1); 
}
console.log("Successfully installed local abacus package.")

console.log("Generating local-abacus-hash...")
try {
    execSync("find ../v4-abacus/build/packages -name '*.tgz' | head -n 1 | shasum > local-abacus-hash", { stdio: "inherit" });
} catch (error) {
    console.error('Error generating local-abacus-hash:', error);
    console.error('You may need to manually restart pnpm dev.')
    process.exit(1); 
}

console.log("Starting continuous abacus build...")
try {
    execSync("cd ../v4-abacus && ./gradlew v4WebHotSwapTrigger --continuous", { stdio: "inherit" });
} catch (error) {
    console.error('Error from continuous abacus build:', error);
    process.exit(1); 
}