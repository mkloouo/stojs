#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline');
const clipboardy = require('clipboardy');
const optimist = require('optimist');
const argv = optimist
  .usage('usage: npx stojs [-h|--help] [-e|--example] [-l|--length length]\n\n' +
    'Enter text and finish with Ctrl + D (on Windows) to get your splitted result.')
  .options({
    'h': {
      alias: 'help',
      describe: 'Show this help message',
      type: 'boolean'
    },
    'e': {
      alias: 'example',
      describe: 'Display example usage',
      type: 'boolean'
    },
    'l': {
      alias: 'length',
      default: 80,
      describe: 'Select split length (at least 5)',
      type: 'number'
    },
    'f': {
      alias: 'file',
      describe: 'Select file to read from',
      type: 'string'
    }
  })
  .check((argv) => {
    if (Number(argv.l) < 5) {
      throw new Error('Length should be at least 5');
    }
    if (argv.f && (!fs.existsSync(argv.f) || !fs.statSync(argv.f).isFile())) {
      throw new Error('File does not exists or is not file');
    }
  })
  .argv;

if (argv.h) {
  ``
  displayHelp();
} else if (argv.e) {
  displayExampleUsage();
} else if (argv.f) {
  processFile(argv.f);
} else {
  processInput();
}

function displayHelp() {
  optimist.showHelp();
}

function displayExampleUsage() {
  console.log('example usage: ');
  console.log(`> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non fringilla tellus. Sed malesuada dui in viverra auctor.
> # Ctrl + D pressed
> Result
'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non fringill' +
'a tellus. Sed malesuada dui in viverra auctor.'
> Also copied to clipboard`);
}

function processFile(fileName) {
  const length = Number(argv.l);

  const fileContents = fs.readFileSync(fileName, 'utf-8');
  const processed = split(fileContents, length);

  console.log('Result\n' + processed);
  console.log('> Also copied to clipboard');
  clipboardy.writeSync(processed);
}

function processInput() {
  process.stdin.setEncoding('utf-8');
  const length = Number(argv.l);

  const rl = readline.createInterface({input: process.stdin, output: process.stdout});

  rl.setPrompt('> ');
  rl.prompt();

  let input = '';

  rl.on('line', function (line) {
    const trimmed = line.trim();
    if (trimmed.length !== 0) {
      input += trimmed + ' ';
    }
    rl.prompt();
  });

  rl.on('close', function () {
    const processed = split(input, length);
    console.log('Result\n' + processed);
    console.log('> Also copied to clipboard');
    clipboardy.writeSync(processed);
  });
}

function split(input, length) {
  const splitOn = length - 4;
  let i = 0;

  String.re

  const processed = input
    .trim()
    .replace(/'/g, '\\\'')
    .replace(new RegExp(`(.{1,${splitOn}})`, 'g'), '\'$1\' +\n');

  return processed.substring(0, processed.length - 3);
}
