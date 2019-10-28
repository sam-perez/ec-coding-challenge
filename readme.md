# Endpoint Closing Challenge

Built on node 8.10.0. Holds the code to power the directories command line util.

To run project, make sure yarn is installed, clone the repo and run `yarn` from the root to install dependencies.

The program should be self explanatory:

Run `node directories.js --help` for more details on how to run it.

## Testing

I built out a simple integration test suite. It actually the command, which
will actually create files and directories on the local machine. This design is
a bit dirty, but I believe it to be acceptable. The test suite does clean up after
itself, but just in case, the playground directory is in our `.gitignore` file.
