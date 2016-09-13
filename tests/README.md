## Front End: Karma + Mocha + webpack

#### Goals

- Test user events
- Test the response to those events
- Make sure the right things render at the right time
- Run tests in many browsers
- Re-run tests on file changes
- Work with continuous integration systems like Travis

#### Notes

- Only works if you package the application with Babel :-(   ... ES6/ES7 support is rough!! Lets wait on this, it will take signiicant effort to inject our Babelified front-end Webpack configuration in. -E Brake

#### Debug
1. run command: `npm run test-client-debug`
2. click debug
3. open developer tools, click source.
4. open webpack to the source file and set breakpoint
5. reload debug.html.

## Back End: Mocha

VERY useful for unit tests on APIs, etc!
