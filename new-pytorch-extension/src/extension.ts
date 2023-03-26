import * as vscode from 'vscode';
import { HoverProvider, TextDocument, Position, CancellationToken, Hover, MarkdownString } from 'vscode';
import axios from 'axios';
const openaiApiKey = process.env.OPENAI_API_KEY;


async function getTensorShapeFromGPT(document: TextDocument, position: Position): Promise<string | null> {
    console.log("Shape requested");
    const code = document.getText();
    const prompt = `Here is some Python code using PyTorch:\n\n\`\`\`python\n${code}\n\`\`\`\n\nPlease provide the expected shape of the PyTorch tensor at line ${position.line + 1} and character ${position.character + 1}.`;
    console.log(prompt);

    try {
        const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
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
    } catch (error) {
        console.error('Error calling the ChatGPT API:', error);
        return null;
    }
}

class PyTorchTensorHoverProvider implements HoverProvider {
    async provideHover(document: TextDocument, position: Position, token: CancellationToken): Promise<Hover | null> {
        console.log("Hover provider created");

        const range = document.getWordRangeAtPosition(position);
        const text = document.getText(range);

        // Request the expected tensor shape from the ChatGPT API.
        const tensorShape = await getTensorShapeFromGPT(document, position);

        if (tensorShape) {
            const message = new MarkdownString(`**Tensor shape:** ${tensorShape}`);
            return new Hover(message, range);
        }

        return null;
    }
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            { scheme: 'file', language: 'python' },
            new PyTorchTensorHoverProvider()
        )
    );
}

export function deactivate() {}