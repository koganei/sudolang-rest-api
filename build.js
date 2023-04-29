const fs = require('fs');
const path = require('path');
const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
    apiKey: process.env['openai_apikey'],
});
const openai = new OpenAIApi(configuration);

async function fetchFromOpenAI(system, prompt, previousMessages = []) {
    let result = '';
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
                {role: 'system', content: system},
                ...previousMessages.map(({author, message}) => ({role: author, content: message})),
                {role: 'user', content: prompt},
            ],
            max_tokens: 600,
            temperature: 0.1,
        });

        result = response.data.choices[0].message.content.trim();
        return result;
    } catch(e) {
        console.log('Could not connect to OpenAI', e.message);
    }
    console.log('got result', {result});
    return result;
}

async function transpileFile(sourceCode, sourcePath, destinationPath, targetExtension) {
    console.log("Transpiling", sourceCode)
    const transpiledCode = await fetchFromOpenAI(
        `You are a JavaScript code generator. You will take pseucode and transform it into JavaScript which will run on NodeJS. Please only output valid JavaScript code and nothing else.`,
        // TODO: Replace with SudoLang
        `You are a JavaScript code generator. You will take pseucode and transform it into JavaScript.
        Please only output valid JavaScript code and nothing else. Refrain from adding comments, instructions or explanations.

        ${sourceCode}
        
        Please generate the JavaScript code for the pseudocode above. Please only output valid JavaScript code and nothing else. Refrain from adding comments, instructions or explanations.`
    );

    const destinationFile = path.join(destinationPath, path.basename(sourcePath, '.su') + targetExtension);
    fs.writeFileSync(destinationFile, transpiledCode);
}

function extractInterfaces(sourcePath, destinationPath) {
    const sourceCode = fs.readFileSync(sourcePath, 'utf-8');
    const interfaceRegex = /@interfaces\s+([\w\s,]+)\s+from\s+["'](.+?)["']/;
    const match = interfaceRegex.exec(sourceCode);

    if (match) {
        const interfaces = match[1].split(',').map(x => x.trim());
        const interfaceFilePath = path.join(path.dirname(sourcePath), match[2]);
        const interfaceFileContent = fs.readFileSync(interfaceFilePath, 'utf-8');
        const replacedCode = sourceCode.replace(match[0], interfaces.map(interfaceName => {
            const interfaceBlockRegex = new RegExp(`interface ${interfaceName} {([\\s\\w,]+)}`);
            const interfaceMatch = interfaceBlockRegex.exec(interfaceFileContent);
            return interfaceMatch ? interfaceMatch[0] : '';
        }).join('\n'));

        return replacedCode;
    }

    return sourceCode;
}

function buildSystem(sourceDir, destinationDir, targetLanguage) {
    const targetExtension = targetLanguage === 'JavaScript' ? '.js' : '.py';

    fs.readdirSync(sourceDir).forEach(file => {
        if (path.extname(file) === '.su') {
            const sourcePath = path.join(sourceDir, file);
            const destinationPath = path.join(destinationDir, file);

            const sourceCode = extractInterfaces(sourcePath, destinationPath);
            transpileFile(sourceCode,sourcePath,  destinationDir, targetExtension);
        }
    });
}

const sourceDir = './src';
const destinationDir = './dist';
const targetLanguage = 'JavaScript';
buildSystem(sourceDir, destinationDir, targetLanguage);