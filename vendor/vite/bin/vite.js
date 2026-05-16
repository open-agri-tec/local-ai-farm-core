#!/usr/bin/env node
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, dirname, join, relative, resolve } from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const command = process.argv[2] ?? 'dev';
const dist = resolve(root, 'dist');

const resolveSourceFile = (file) => {
  if (existsSync(file)) return file;
  if (file.endsWith('.js')) {
    const base = file.slice(0, -3);
    for (const candidate of [`${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.jsx`]) {
      if (existsSync(candidate)) return candidate;
    }
  }
  for (const candidate of [`${file}.ts`, `${file}.tsx`, `${file}.js`, `${file}.jsx`, `${file}.css`]) {
    if (existsSync(candidate)) return candidate;
  }
  return file;
};

const walk = (dir) => {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) entries.push(...walk(path));
    else entries.push(path);
  }
  return entries;
};

const rewriteImports = (code) => code
  .replace(/from ['"](\.{1,2}\/[^'"]+?)['"]/g, (match, specifier) => {
    if (specifier.endsWith('.css') || extname(specifier)) return match;
    return match.replace(specifier, `${specifier}.js`);
  })
  .replace(/import ['"](\.\/?[^'"]+?\.css)['"];?/g, '');

const transpile = (source, fileName) => rewriteImports(ts.transpileModule(source, {
  fileName,
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
  },
}).outputText);

const build = () => {
  rmSync(dist, { recursive: true, force: true });
  mkdirSync(join(dist, 'src'), { recursive: true });
  const html = readFileSync(resolve(root, 'index.html'), 'utf8').replace('/src/main.tsx', '/src/main.js');
  writeFileSync(join(dist, 'index.html'), html);

  for (const file of walk(resolve(root, 'src'))) {
    if (file.endsWith('.d.ts')) continue;
    const output = join(dist, relative(root, file)).replace(/\.(tsx?|jsx?)$/, '.js');
    mkdirSync(dirname(output), { recursive: true });
    if (/\.tsx?$/.test(file)) {
      writeFileSync(output, transpile(readFileSync(file, 'utf8'), file));
    } else {
      copyFileSync(file, output);
    }
  }

  const runtimeModules = ['react', 'react-dom'];
  for (const moduleName of runtimeModules) {
    const modulePath = resolve(root, 'node_modules', moduleName);
    if (existsSync(modulePath)) {
      cpSync(modulePath, resolve(dist, 'node_modules', moduleName), { recursive: true });
    }
  }

  if (existsSync(resolve(root, 'public'))) {
    cpSync(resolve(root, 'public'), dist, { recursive: true });
  }

  console.log('vite v0.0.0-local building for production...');
  console.log('✓ built in local minimal mode');
};

const dev = () => {
  const portFlagIndex = process.argv.indexOf('--port');
  const port = portFlagIndex >= 0 ? Number(process.argv[portFlagIndex + 1]) : 5173;
  const server = createServer((request, response) => {
    const url = request.url === '/' ? '/index.html' : request.url ?? '/index.html';
    const file = resolveSourceFile(resolve(root, `.${url.split('?')[0]}`));
    try {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        response.setHeader('Content-Type', 'text/javascript');
        response.end(transpile(readFileSync(file, 'utf8'), file));
        return;
      }
      response.end(readFileSync(file));
    } catch {
      response.statusCode = 404;
      response.end('Not found');
    }
  });
  server.listen(port, '0.0.0.0', () => {
    console.log(`VITE v0.0.0-local ready in minimal mode`);
    console.log(`  ➜  Local:   http://localhost:${port}/`);
  });
};

if (command === 'build') build();
else dev();
