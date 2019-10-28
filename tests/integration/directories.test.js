const { execSync } = require('child_process');
const fs = require('fs');
const rimraf = require('rimraf');
const { expect } = require('chai');

const TEST_DIRECTORY = './integration_test_working_directory';

describe('Directories Integration Tests', () => {
  beforeEach(() => {
    fs.mkdirSync(TEST_DIRECTORY);
  });

  afterEach(() => {
    rimraf.sync(TEST_DIRECTORY);
  });

  const runDirectoriesAndGetResult = (directoriesCommandSuffix) => {
    try {
      // a little dirty, works for now
      const stdOutBuffer = execSync(
        `cd ${TEST_DIRECTORY} && node ../directories.js ${directoriesCommandSuffix}`,
      );
      return {
        stdout: stdOutBuffer.toString(),
        stderr: null,
        exitCode: 0,
      };
    } catch (error) {
      return {
        stdout: (error.stdout || '').toString(),
        stderr: (error.stderr || '').toString(),
        exitCode: error.status,
      };
    }
  };

  describe('move-file', () => {
    describe('when the file does not exist', () => {
      it('should fail with the appropriate message', () => {
        const { stderr, exitCode } = runDirectoriesAndGetResult(
          'move-file -t blerg -d blarg',
        );

        expect(exitCode).to.equal(1);
        expect(stderr).to.contain('Target path does not exist.');
      });
    });

    describe('when everything works', () => {
      beforeEach(() => {
        fs.writeFileSync(`${TEST_DIRECTORY}/blerg`, 'BLERG!');
        fs.mkdirSync(`${TEST_DIRECTORY}/blarg`);
      });

      it('should fail with the appropriate message', () => {
        const { exitCode } = runDirectoriesAndGetResult('move-file -t blerg -d blarg');

        expect(exitCode).to.equal(0);
        expect(fs.readFileSync(`${TEST_DIRECTORY}/blarg/blerg`).toString()).to.equal(
          'BLERG!',
        );
      });
    });
  });
});
