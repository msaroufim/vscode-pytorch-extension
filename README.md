# vscode-pytorch-extension

Automatically infer tensor shapes in your program using ChatGPT

![image](https://user-images.githubusercontent.com/3282513/227808707-450c8522-b289-4c43-9463-1a5865916916.png)


Most of the code is boilerplate, what you wanna take a look at is this https://github.com/msaroufim/vscode-pytorch-extension/blob/main/new-pytorch-extension/src/extension.ts


## Usage

```
export OPENAI_API_KEY="YOUR_KEY_HERE"
npm install -g typescript
npm install
npm run compile
vsce package
```
