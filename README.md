# REST API written in SudoLang

A NodeJS and/or Flask backend written in Sudolang

# Build

First run `npm install` to install the dependencies.
Running `npm run build` will transpile the SudoLang code in /src to JavaScript and output it to the /dist directory.

It requires the OpenAI API Key to be specified in the `openai_apikey` environment variable.
At the moment, it works pretty well with `gpt-3.5-turbo`, but works very well with `gpt-4`.
