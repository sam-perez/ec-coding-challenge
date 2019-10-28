/* eslint-disable no-console */
const R = require('ramda');
const readlineSync = require('readline-sync');

// in memory directories, represented as a dictionary of dictionaries
let ROOT_DIRECTORY = {};

// The available commands
const COMMANDS = {
  CREATE: (pathToCreateStr) => {
    const pathToCreate = pathToCreateStr.split('/');

    const pathThatMustExist = R.init(pathToCreate);

    const parentPathExists = R.pathOr(null, pathThatMustExist, ROOT_DIRECTORY) !== null;

    if (!parentPathExists) {
      console.error(`Failed, no such directory: ${pathThatMustExist.join('/')}`);
      return;
    }

    // add an empty directory, or just associate what already exists
    const directoryToAssoc = R.pathOr({}, pathToCreate, ROOT_DIRECTORY);

    ROOT_DIRECTORY = R.assocPath(pathToCreate, directoryToAssoc, ROOT_DIRECTORY);
  },
  LIST: () => {
    const depthFirstList = (currDir) => {
      R.forEach((childDir) => {
        console.log(childDir);
        depthFirstList(currDir[childDir]);
      }, R.keys(currDir).sort());
    };

    depthFirstList(ROOT_DIRECTORY);
  },
  MOVE: (targetDirectoryStr, destinationDirectoryStr) => {
    const targetDirectoryPath = targetDirectoryStr.split('/');
    const targetDirectoryExists = R.pathOr(null, targetDirectoryPath, ROOT_DIRECTORY) !== null;

    if (!targetDirectoryExists) {
      console.error(`Failed, target directory does not exist: ${targetDirectoryStr}`);
      return;
    }

    const destinationDirectoryPath = destinationDirectoryStr.split('/');
    const destinationDirectoryExists = R.pathOr(null, destinationDirectoryPath, ROOT_DIRECTORY) !== null;

    if (!destinationDirectoryExists) {
      console.error(
        `Failed, destination directory does not exist: ${destinationDirectoryStr}`,
      );
      return;
    }

    const targetDirectoryName = R.last(targetDirectoryPath);

    const targetDirectoryContents = R.path(targetDirectoryPath, ROOT_DIRECTORY);
    ROOT_DIRECTORY = R.dissocPath(targetDirectoryPath, ROOT_DIRECTORY);
    ROOT_DIRECTORY = R.assocPath(
      [...destinationDirectoryPath, targetDirectoryName],
      targetDirectoryContents,
      ROOT_DIRECTORY,
    );
  },
  DELETE: (deleteTargetStr) => {
    const deleteTargetPath = deleteTargetStr.split('/');
    const deleteTargetExists = R.pathOr(null, deleteTargetPath, ROOT_DIRECTORY) !== null;

    if (!deleteTargetExists) {
      console.error(`Cannot delete, path does not exist: ${deleteTargetStr}`);
      return;
    }

    ROOT_DIRECTORY = R.dissocPath(deleteTargetPath, ROOT_DIRECTORY);
  },
};

function receiveUserInput(userInput) {
  const [command, ...commandArgs] = userInput.split(' ');
  const availableCommands = R.keys(COMMANDS);
  if (!R.contains(command, availableCommands)) {
    console.error(
      `Command not recognized. Note that commands are case sensitive and must be one of ${availableCommands}`,
    );

    return;
  }

  COMMANDS[command](...commandArgs);
}

if (process.env.TESTING !== 'true') {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const userInput = readlineSync.question('> ');

    receiveUserInput(userInput);
  }
}

// for testing purposes!
function getRoot() {
  return ROOT_DIRECTORY;
}

function clearRoot() {
  ROOT_DIRECTORY = {};
}

module.exports = { receiveUserInput, TESTING: { getRoot, clearRoot } };
