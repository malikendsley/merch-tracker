const fs = require('fs');
const path = require('path');

const requiredFiles = [
    '../backend/.env',
    '../frontend/.env',
    '../backend/dist/fb-admin-secret.json',
    // add as many files as you want to check for here
];

const requiredDirectories = [
    '../backend/dist/', // moved this here
    // add as many directories as you want to check for here
];

let allFilesExist = true;
let allDirectoriesExist = true;

for (const filePath of requiredFiles) {
    if (!fs.existsSync(path.resolve(__dirname, filePath))) {
        console.log(`Missing file: ${filePath}`);
        allFilesExist = false;
    }
}

for (const directoryPath of requiredDirectories) {
    if (!fs.existsSync(path.resolve(__dirname, directoryPath))) {
        console.log(`Missing directory: ${directoryPath}. Make sure to run 'npm run build:backend'.`);
        allDirectoriesExist = false;
    }
}

if (!allFilesExist || !allDirectoriesExist) {
    console.log('One or more required files or directories are missing. Please check the messages above.');
    process.exit(1);
} else {
    console.log('All required files and directories are present.');
}