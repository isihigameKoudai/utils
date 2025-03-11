#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

/**
 * Find all files with a specific extension recursively
 * @param {string} dir - Directory to start searching from
 * @param {string} ext - File extension to search for (e.g., '.ai.md')
 * @returns {Promise<string[]>} - Array of file paths
 */
async function findFiles(dir, ext) {
  const files = [];
  
  // Read the directory contents
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Skip hidden directories (like .git, node_modules, etc.)
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      // Recursively search subdirectories
      const subFiles = await findFiles(fullPath, ext);
      files.push(...subFiles);
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      // Add files with matching extension
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Extract content from a markdown file
 * @param {string} filePath - Path to the markdown file
 * @returns {Promise<string>} - Content of the file
 */
async function extractContent(filePath) {
  const content = await readFileAsync(filePath, 'utf8');
  return content;
}

/**
 * Main function to generate cursor rules
 */
async function generateCursorRules() {
  try {
    // Find all .ai.md files in the repository
    const rootDir = path.resolve(__dirname, '..');
    console.log(`Searching for .ai.md files in ${rootDir}...`);
    
    const aiMdFiles = await findFiles(rootDir, '.ai.md');
    console.log(`Found ${aiMdFiles.length} .ai.md files.`);
    
    if (aiMdFiles.length === 0) {
      console.log('No .ai.md files found. Exiting.');
      return;
    }
    
    // Extract content from each file
    const contents = [];
    for (const file of aiMdFiles) {
      console.log(`Processing ${file}...`);
      const content = await extractContent(file);
      contents.push(content);
    }
    
    // Combine all contents
    const combinedContent = contents.join('\n\n');
    
    // Create .cursor/rules directory if it doesn't exist
    const rulesDir = path.join(rootDir, '.cursor', 'rules');
    try {
      await mkdirAsync(path.join(rootDir, '.cursor'), { recursive: true });
      await mkdirAsync(rulesDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
    
    // Write combined content to main.mdc
    const outputPath = path.join(rulesDir, 'main.mdc');
    await writeFileAsync(outputPath, combinedContent);
    
    console.log(`Successfully generated ${outputPath}`);
  } catch (error) {
    console.error('Error generating cursor rules:', error);
    process.exit(1);
  }
}

// Run the main function
generateCursorRules();
