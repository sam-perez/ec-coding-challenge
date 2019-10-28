# Endpoint Closing Challenge

Github link: https://github.com/sam-perez/ec-coding-challenge

Built on node 8.10.0. Holds the code to power the directories command line util.

To run project, make sure yarn is installed, clone the repo and run `yarn` from the root to install dependencies.

The program should be self explanatory:

Run `node directories.js` to enter into the directories cli. CTRL-C to exit.

## Testing

I built out a simple unit testing framework. In order to get it to work, I had to do some
dirty things like listening on console.log and console.error, as well as exposing some internals.

## Improvements

I would make the following improvements if I had more time:

1. Do input verification on each command. For example, make sure that we have the right number
   of input arguments.

2. Handle subtle edge cases. For example, what should happen if a user inputs 'CREATE /' or 'CREATE food///apple' etc...
   How about handling '.' or '..', should creating directories with those name be disallowed etc... How about moving a
   directory to the root using 'MOVE something .' Currently, this is out of spec.

3. Add in more patterns. For example, looks like might be able to do something for 'XYZDirectoryExists'

4. Remove console.log/console.error and replace it with a simple abstraction that we could then listen
   on to make unit tests cleaner.

5. Maybe mess around with using our own replacement for readline-sync? Right now, it is a little buggy
   when you copy paste all of commands in at once.
