"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const vscode_1 = require("vscode");
const axios_1 = require("axios");
const openaiApiKey = process.env.OPENAI_API_KEY;
async function getTensorShapeFromGPT(document, position) {
    console.log("Shape requested");
    const code = document.getText();
    const prompt = `Here is some Python code using PyTorch:\n\n\`\`\`python\n${code}\n\`\`\`\n\nPlease provide the expected shape of the PyTorch tensor at line ${position.line + 1} and character ${position.character + 1}.`;
    console.log(prompt);
    try {
        const response = await axios_1.default.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
            prompt: prompt,
            max_tokens: 150,
            n: 1,
            stop: null,
            temperature: 0.5,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`,
            },
        });
        const generated_text = response.data.choices[0].text.trim();
        console.log(generated_text);
        return generated_text;
    }
    catch (error) {
        console.error('Error calling the ChatGPT API:', error);
        return null;
    }
}
class PyTorchTensorHoverProvider {
    async provideHover(document, position, token) {
        console.log("Hover provider created");
        const range = document.getWordRangeAtPosition(position);
        const text = document.getText(range);
        // Request the expected tensor shape from the ChatGPT API.
        const tensorShape = await getTensorShapeFromGPT(document, position);
        if (tensorShape) {
            const message = new vscode_1.MarkdownString(`**Tensor shape:** ${tensorShape}`);
            return new vscode_1.Hover(message, range);
        }
        return null;
    }
}
function activate(context) {
    context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'python' }, new PyTorchTensorHoverProvider()));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map