#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

// コマンドライン引数を解析
const args = process.argv.slice(2);
const defaultFilePattern = '**/*.ai.md';
const defaultOutputPath = '.cursor/rules/main.mdc';

// ヘルプメッセージを表示する関数
function showHelp() {
  console.log([
    '',
    'Usage: generate-cursor-rules [filePattern] [outputPath]',
    '',
    'Arguments:',
    `  filePattern  検索するファイルのパターン (例: "**/*.ai.md")`,
    `               デフォルト: "${defaultFilePattern}"`,
    `  outputPath   出力先ファイルのパス (例: ".cursor/rules/custom.mdc")`,
    `               デフォルト: "${defaultOutputPath}"`,
    '',
    'Example:',
    '  generate-cursor-rules "**/*.docs.md" ".cursor/rules/docs.mdc"',
    ''
  ].join('\n'));
  process.exit(0);
}

// ヘルプが要求された場合
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
}

// コマンドライン引数から値を取得するか、デフォルト値を使用
const filePattern = args[0] || defaultFilePattern;
const outputPath = args[1] || defaultOutputPath;

/**
 * Find files that match the pattern recursively in directory
 * @param {string} dir - Directory to start searching from
 * @param {string} pattern - File pattern to search for (e.g. "*.ai.md")
 * @returns {Promise<string[]>} - Array of file paths
 */
async function findFiles(dir, pattern) {
  const files = [];
  
  // Get extension from pattern
  const patternParts = pattern.split('.');
  const extension = patternParts.length > 1 ? `.${patternParts[patternParts.length - 1]}` : '';
  
  // パターンから特定の拡張子プレフィックスを抽出する
  // 例: "*.ai.md" → "ai.md", "*.docs.md" → "docs.md"
  let specificExtension = '';
  if (pattern.includes('*') && pattern.includes('.')) {
    const match = pattern.match(/\*\.([a-zA-Z0-9_.]+)/);
    if (match && match[1]) {
      specificExtension = match[1];
    }
  }
  
  // Read directory contents
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Skip hidden directories and node_modules
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      // Recursively search subdirectories
      const subFiles = await findFiles(fullPath, pattern);
      files.push(...subFiles);
    } else if (entry.isFile()) {
      // Simple pattern matching
      if (pattern.includes('**') && extension && entry.name.endsWith(extension)) {
        // 特定の拡張子パターンが指定されている場合（例: *.ai.md, *.docs.md）
        // 指定された特定の拡張子以外の同じタイプのファイルを除外する
        if (specificExtension && specificExtension.includes('.') && entry.name.endsWith(extension)) {
          // ファイル名がパターンのプレフィックス部分を含まない場合は除外
          // 例: *.ai.md の場合、.md で終わるが .ai.md で終わらないファイルは除外
          if (!entry.name.endsWith(`.${specificExtension}`)) {
            continue;
          }
        }
        files.push(fullPath);
      }
      // For patterns like "*.ai.md" in current directory
      else if (pattern.startsWith('*') && !pattern.includes('/') && extension && entry.name.endsWith(extension)) {
        // 特定の拡張子パターンが指定されている場合
        if (specificExtension && specificExtension.includes('.') && entry.name.endsWith(extension)) {
          // ファイル名がパターンのプレフィックス部分を含まない場合は除外
          if (!entry.name.endsWith(`.${specificExtension}`)) {
            continue;
          }
        }
        files.push(fullPath);
      }
      // Exact match
      else if (entry.name === pattern) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

/**
 * Extract content from a file
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} - Content of the file
 */
async function extractContent(filePath) {
  const content = await readFileAsync(filePath, 'utf8');
  return content;
}

/**
 * Extract frontmatter from content if it exists
 * @param {string} content - Content of the file
 * @returns {Object} - Object containing frontmatter and content without frontmatter
 */
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    return {
      frontmatter: match[0],
      contentWithoutFrontmatter: content.replace(frontmatterRegex, '')
    };
  }
  
  return {
    frontmatter: '',
    contentWithoutFrontmatter: content
  };
}

/**
 * Main function to generate cursor rules
 * @param {string} filePattern - File pattern to search for
 * @param {string} outputFilePath - Path to output file
 */
async function generateCursorRules(filePattern, outputFilePath) {
  try {
    // Search for files matching the pattern in the repository
    const rootDir = path.resolve(__dirname, '..');
    console.log(`検索パターン「${filePattern}」に一致するファイルを ${rootDir} で検索中...`);
    
    const matchedFiles = await findFiles(rootDir, filePattern);
    console.log(`${matchedFiles.length} 個のファイルが見つかりました。`);
    
    if (matchedFiles.length === 0) {
      console.log('ファイルが見つかりませんでした。終了します。');
      return;
    }
    
    // Extract content from each file
    const contents = [];
    for (const file of matchedFiles) {
      console.log(`処理中: ${file}...`);
      const content = await extractContent(file);
      contents.push(content);
    }
    
    // Combine all contents
    const combinedContent = contents.join('\n\n');
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(path.join(rootDir, outputFilePath));
    try {
      await mkdirAsync(outputDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
    
    // Check if output file already exists and extract its frontmatter
    const fullOutputPath = path.join(rootDir, outputFilePath);
    let existingFrontmatter = '';
    
    try {
      if (fs.existsSync(fullOutputPath)) {
        const existingContent = await readFileAsync(fullOutputPath, 'utf8');
        const { frontmatter } = extractFrontmatter(existingContent);
        existingFrontmatter = frontmatter;
      }
    } catch (err) {
      console.log(`既存の出力ファイルが見つからないか、読み取りエラーが発生しました: ${err.message}`);
    }
    
    // Write combined content to output file with existing frontmatter
    const finalContent = existingFrontmatter + combinedContent;
    await writeFileAsync(fullOutputPath, finalContent);
    
    console.log(`成功: ${fullOutputPath} にルールを生成しました`);
  } catch (error) {
    console.error('Cursorルールの生成中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// Run the main function
generateCursorRules(filePattern, outputPath);
