/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  content = content.replace(/bg-white\/\[0\.02\]/g, 'bg-surface');
  content = content.replace(/bg-white\/\[0\.03\]/g, 'bg-surface');
  content = content.replace(/bg-white\/\[0\.04\]/g, 'bg-surface-strong');
  content = content.replace(/bg-white\/\[0\.05\]/g, 'bg-surface-strong');
  content = content.replace(/bg-white\/\[0\.06\]/g, 'bg-surface-strong');
  content = content.replace(/bg-white\/\[0\.07\]/g, 'bg-border'); // used as a divider
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
