![Rosy](http://ff0000.github.com/rosy/rosy.png)
##### An inheritable AMD Framework.

### Notes

See https://github.com/ff0000/red-boilerplate to see Rosy JS included in an example site.

### Tests

Rosy comes bundled with the [OxBlood](http://en.wiktionary.org/wiki/oxblood) framework. It allows you to run unit tests, both in the browser and through the command line.

##### Requirements

- [PhantomJS](http://phantomjs.org): `brew install phantomjs`
- A server running from the root Rosy directory. We recommend [http-server](https://github.com/nodeapps/http-server): `npm install http-server -g`
- The `devDependencies` listed in `package.json`: `npm install`

##### From your browser

- Spool up your server: `cd path/to/rosy && http-server`
- Navigate to `http://localhost:8080/test/runner.html`

##### From your command line

- Spool up your server: `cd path/to/rosy && http-server`
- `phantomjs test/lib/mocha/run-mocha.js http://localhost:8080/test/runner.html`

### License

See LICENSE.
