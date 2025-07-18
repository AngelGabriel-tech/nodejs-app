#!/usr/bin/env node

/**
 * Nexus Repository Setup Script
 * This script helps configure npm to work with your Nexus repository
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupNexus() {
  console.log('🔧 Nexus Repository Setup');
  console.log('==========================\n');

  try {
    const nexusUrl = await question('Enter your Nexus server URL (e.g., https://nexus.company.com): ');
    const repoName = await question('Enter repository name (e.g., npm-public): ');
    const authMethod = await question('Authentication method? (1) Auth Token (2) Username/Password: ');
    
    let authConfig = '';
    
    if (authMethod === '1') {
      const token = await question('Enter your auth token: ');
      authConfig = `//${new URL(nexusUrl).host}/repository/${repoName}/:_authToken=${token}`;
    } else {
      const username = await question('Enter username: ');
      const password = await question('Enter password: ');
      const encodedPassword = Buffer.from(password).toString('base64');
      authConfig = `//${new URL(nexusUrl).host}/repository/${repoName}/:username=${username}\n//${new URL(nexusUrl).host}/repository/${repoName}/:_password=${encodedPassword}`;
    }

    const npmrcContent = `# Nexus Repository Configuration
registry=${nexusUrl}/repository/${repoName}/
${authConfig}
always-auth=true
cache-min=10
`;

    fs.writeFileSync('.npmrc', npmrcContent);
    console.log('\n✅ .npmrc file created successfully!');
    
    // Update package.json publish config
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    packageJson.publishConfig = {
      registry: `${nexusUrl}/repository/${repoName}/`
    };
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ package.json updated with publish configuration!');
    
    console.log('\n🎉 Setup complete! You can now:');
    console.log('   npm install    # Install packages from Nexus');
    console.log('   npm publish    # Publish to Nexus');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  setupNexus();
}

module.exports = { setupNexus };
