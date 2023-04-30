# REST API written in SudoLang

An Express and/or Flask backend written in Sudolang

# Build

First run `npm install` to install the dependencies.
Running `npm run build` will transpile the SudoLang code in /src to JavaScript and output it to the /dist directory.

It requires the OpenAI API Key to be specified in the `openai_apikey` environment variable.
At the moment, it works pretty well with `gpt-3.5-turbo`, but works very well with `gpt-4`.

# Features

- [x] Automatically build codebase in JavaScript based on SudoLang
- [x] Import interfaces using the `@interfaces` directive
- [ ] Automatically generate unit tests
- [ ] Use these unit tests for self-refinement to make sure that the generated code works as expected
- [ ] Automatically look up optimizations
- [ ] Automatically rewrite the SudoLang itself to be more deterministic
- [ ] Progressive compilation (only recompile code changes)
- [ ] Automatically produce documentation
