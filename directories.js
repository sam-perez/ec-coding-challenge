/* eslint-disable no-console */
const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs'));
const path = require('path');
const program = require('commander');
const R = require('ramda');

const crashProgram = ({ errorMessage = 'Failed for unknown reason.', error = null }) => {
  console.error(errorMessage);
  if (error) {
    console.error(error);
  }
  process.exit(1);
};

const runCommand = ({ handler, requiredArgs = [] }) => (...args) => {
  const commandObj = R.last(args);

  requiredArgs.forEach((requiredArg) => {
    if (R.contains(commandObj[requiredArg], ['', undefined])) {
      crashProgram({ errorMessage: `Missing required arg: ${requiredArg}` });
    }
  });

  handler(commandObj);
};

const crashOnFailedPromiseWithMessage = (errorMessage) => (error) => crashProgram({ errorMessage, error });

const moveFileCommand = async ({ target, destination }) => {
  const fileLstats = await fs
    .lstatAsync(target)
    .catch(crashOnFailedPromiseWithMessage('Target path does not exist.'));

  if (!fileLstats.isFile()) {
    crashProgram({ errorMessage: 'The target is not a file.' });
  }

  const destinationLstats = await fs
    .lstatAsync(destination)
    .catch(crashOnFailedPromiseWithMessage('Destination path does not exist.'));

  if (!destinationLstats.isDirectory()) {
    crashProgram({ errorMessage: 'The destination is not a directory.' });
  }

  const moveTargetPath = path.join(destination, target);

  await fs
    .copyFileAsync(target, moveTargetPath)
    .catch(
      crashOnFailedPromiseWithMessage(`Could not copy file to new path: ${moveTargetPath}`),
    );

  await fs.unlinkAsync(target).catch(crashOnFailedPromiseWithMessage('Could not delete target'));
};

program
  .command('move-file')
  .option('-t, --target <target>', 'The target to move, must be a file. Required.')
  .option(
    '-d, --destination <destination_dir>',
    'The destination directory. Must exist or we will fail. Required.',
  )
  .action(runCommand({ handler: moveFileCommand, requiredArgs: ['target', 'destination'] }));

program.parse(process.argv);
