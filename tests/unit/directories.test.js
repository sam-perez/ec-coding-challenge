/* eslint-disable no-console */
const { expect } = require('chai');

const {
  receiveUserInput,
  TESTING: { getRoot, clearRoot },
} = require('../../directories');

describe('Directories Unit Tests', () => {
  // a little dirty but ok for testing for now, get it done fas
  let consoleLogCalls = [];
  let consoleErrorCalls = [];

  // Replace console.log with stub implementation.
  const originalLog = console.log;
  console.log = (...args) => {
    consoleLogCalls.push(args);
    originalLog(...args);
  };

  // Replace console.log with stub implementation.
  const originalErr = console.error;
  console.error = (...args) => {
    consoleErrorCalls.push(args);
    originalErr(...args);
  };

  beforeEach(() => {
    consoleLogCalls = [];
    consoleErrorCalls = [];
    clearRoot();
  });

  describe('create', () => {
    describe('when we create a path that does not yet exist', () => {
      it('should fail with the appropriate message', () => {
        receiveUserInput('CREATE not/yet/exists');

        expect(getRoot()).to.deep.equal({});
        expect(consoleErrorCalls).to.deep.equal([['Failed, no such directory: not/yet']]);
      });
    });

    describe('when we create legal paths', () => {
      it('should work', () => {
        receiveUserInput('CREATE fine');
        receiveUserInput('CREATE fine/still');

        expect(getRoot()).to.deep.equal({ fine: { still: {} } });
        expect(consoleErrorCalls).to.deep.equal([]);
      });
    });
  });

  describe('list', () => {
    describe('when we have an empty root', () => {
      it('should work and list nothing', () => {
        receiveUserInput('LIST');

        expect(getRoot()).to.deep.equal({});
        expect(consoleErrorCalls).to.deep.equal([]);
        expect(consoleLogCalls).to.deep.equal([]);
      });
    });

    describe('when we have some directories in the root', () => {
      it('should list them correctly', () => {
        receiveUserInput('CREATE fruits');
        receiveUserInput('CREATE vegetables');
        receiveUserInput('CREATE grains');
        receiveUserInput('CREATE fruits/apples');
        receiveUserInput('CREATE fruits/apples/fuji');
        receiveUserInput('LIST');

        expect(getRoot()).to.deep.equal({
          fruits: {
            apples: {
              fuji: {},
            },
          },
          grains: {},
          vegetables: {},
        });
        expect(consoleErrorCalls).to.deep.equal([]);
        expect(consoleLogCalls).to.deep.equal([
          ['fruits'],
          ['apples'],
          ['fuji'],
          ['grains'],
          ['vegetables'],
        ]);
      });
    });
  });

  describe('move', () => {
    describe('when we are missing the target', () => {
      it('should fail with the appropriate message', () => {
        receiveUserInput('MOVE grains foods');

        expect(getRoot()).to.deep.equal({});
        expect(consoleErrorCalls).to.deep.equal([
          ['Failed, target directory does not exist: grains'],
        ]);
        expect(consoleLogCalls).to.deep.equal([]);
      });
    });

    describe('when we are missing the destination', () => {
      it('should fail with the appropriate message', () => {
        receiveUserInput('CREATE grains');
        receiveUserInput('MOVE grains foods');

        expect(getRoot()).to.deep.equal({ grains: {} });
        expect(consoleErrorCalls).to.deep.equal([
          ['Failed, destination directory does not exist: foods'],
        ]);
        expect(consoleLogCalls).to.deep.equal([]);
      });
    });

    describe('when we have everything', () => {
      it('should should succeed', () => {
        receiveUserInput('CREATE grains');
        receiveUserInput('CREATE foods');
        receiveUserInput('MOVE grains foods');

        expect(getRoot()).to.deep.equal({ foods: { grains: {} } });
        expect(consoleErrorCalls).to.deep.equal([]);
        expect(consoleLogCalls).to.deep.equal([]);
      });
    });
  });

  describe('delete', () => {
    describe('when we are missing the delete target', () => {
      it('should fail with the appropriate message', () => {
        receiveUserInput('DELETE grains');

        expect(getRoot()).to.deep.equal({});
        expect(consoleErrorCalls).to.deep.equal([
          ['Cannot delete, path does not exist: grains'],
        ]);
        expect(consoleLogCalls).to.deep.equal([]);
      });
    });

    describe('when we have the delete target', () => {
      it('should succeed', () => {
        receiveUserInput('CREATE grains');
        receiveUserInput('CREATE grains/rice');
        receiveUserInput('DELETE grains');

        expect(getRoot()).to.deep.equal({});
        expect(consoleErrorCalls).to.deep.equal([]);
        expect(consoleLogCalls).to.deep.equal([]);
      });
    });
  });

  describe('UNKNOWN COMMAND', () => {
    describe('when we send an unknown command', () => {
      it('should fail with the appropriate message', () => {
        receiveUserInput('WHATISTHIS grains');

        expect(getRoot()).to.deep.equal({});
        expect(consoleErrorCalls).to.deep.equal([
          [
            'Command not recognized. Note that commands are case sensitive and must be one of CREATE,LIST,MOVE,DELETE',
          ],
        ]);
        expect(consoleLogCalls).to.deep.equal([]);
      });
    });
  });

  describe('SPEC TEST', () => {
    // Test the spec by submitting all the commands from the spec and making sure it all works
    describe('when we send the spec commands', () => {
      it('should get the spec results!', () => {
        [
          'CREATE fruits',
          'CREATE vegetables',
          'CREATE grains',
          'CREATE fruits/apples',
          'CREATE fruits/apples/fuji',
          'LIST',
          'CREATE grains/squash',
          'MOVE grains/squash vegetables',
          'CREATE foods',
          'MOVE grains foods',
          'MOVE fruits foods',
          'MOVE vegetables foods',
          'LIST',
          'DELETE fruits/apples',
          'DELETE foods/fruits/apples',
          'LIST',
        ].forEach((command) => receiveUserInput(command));

        expect(getRoot()).to.deep.equal({
          foods: {
            fruits: {},
            grains: {},
            vegetables: {
              squash: {},
            },
          },
        });
        expect(consoleErrorCalls).to.deep.equal([
          ['Cannot delete, path does not exist: fruits/apples'],
        ]);
        expect(consoleLogCalls).to.deep.equal([
          ['fruits'],
          ['apples'],
          ['fuji'],
          ['grains'],
          ['vegetables'],
          ['foods'],
          ['fruits'],
          ['apples'],
          ['fuji'],
          ['grains'],
          ['vegetables'],
          ['squash'],
          ['foods'],
          ['fruits'],
          ['grains'],
          ['vegetables'],
          ['squash'],
        ]);
      });
    });
  });
});
