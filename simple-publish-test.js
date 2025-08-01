const http = require('http');
const fs = require('fs');
const path = require('path');

const http = require('http');
const fs = require('fs');
const path = require('path');

async function simplePublishTest() {
    console.log('🔍 Testing package publishing readiness...');
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log(`📦 Package: ${packageJson.name}@${packageJson.version}`);
    
    // Load environment variables
    require('dotenv').config();
    
    const nexusServer = process.env.NEXUS_SERVER || 'http://your-nexus-server.com:8081';
    const nexusRepo = process.env.NEXUS_REPOSITORY || 'npm-public';
    const nexusUsername = process.env.NEXUS_USERNAME || 'your-username';
    const nexusPassword = process.env.NEXUS_PASSWORD || 'your-password';
    
    if (!process.env.NEXUS_SERVER) {
        console.log('⚠️  No Nexus configuration found in .env file');
        console.log('📝 Please copy .env.example to .env and configure your Nexus settings');
        return null;
    }
    
    // Parse Nexus URL
    const nexusUrl = new URL(nexusServer);
    
    // Test if package already exists
    const options = {
        hostname: nexusUrl.hostname,
        port: nexusUrl.port || 8081,
        path: `/repository/${nexusRepo}/${packageJson.name}`,
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${nexusUsername}:${nexusPassword}`).toString('base64'),
            'Accept': 'application/json'
        }
    };
    
    return new Promise((resolve) => {
        const request = http.request(options, (response) => {
            console.log(`📊 Package lookup status: ${response.statusCode}`);
            
            if (response.statusCode === 404) {
                console.log('✅ Package not found - ready for first publish');
            } else if (response.statusCode === 200) {
                console.log('✅ Package exists - can be updated');
            } else if (response.statusCode === 401) {
                console.log('❌ Authentication failed');
            } else {
                console.log(`ℹ️  Status: ${response.statusCode}`);
            }
            
            resolve(response.statusCode);
        });
        
        request.on('error', (error) => {
            console.log('❌ Request failed:', error.message);
            resolve(null);
        });
        
        request.end();
    });
}

// Try to use PowerShell with different execution approach
async function tryAlternativeNpmApproach() {
    console.log('\n🔧 Trying alternative npm approach...');
    
    try {
        // Try using cmd instead of PowerShell
        const { spawn } = require('child_process');
        
        return new Promise((resolve) => {
            const registryUrl = `${nexusServer}/repository/${nexusRepo}/`;
            const child = spawn('cmd', ['/c', 'npm', 'ping', '--registry', registryUrl], {
                cwd: process.cwd(),
                stdio: 'pipe'
            });
            
            let output = '';
            let errorOutput = '';
            
            child.stdout.on('data', (data) => {
                output += data.toString();
            });
            
            child.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });
            
            child.on('close', (code) => {
                console.log(`📤 npm ping exit code: ${code}`);
                if (code === 0) {
                    console.log('✅ npm ping successful!');
                    console.log('📋 Output:', output);
                } else {
                    console.log('❌ npm ping failed');
                    if (errorOutput) console.log('📋 Error:', errorOutput);
                }
                resolve(code);
            });
            
            setTimeout(() => {
                child.kill();
                console.log('⏰ npm ping timeout');
                resolve(null);
            }, 15000);
        });
    } catch (error) {
        console.log('❌ Alternative approach failed:', error.message);
        return null;
    }
}

async function runTests() {
    await simplePublishTest();
    await tryAlternativeNpmApproach();
    
    console.log('\n🎯 Publishing Options:');
    console.log('1. ✅ Manual upload via Nexus web interface');
    console.log('2. 🔧 Fix PowerShell execution policy (requires admin)');
    console.log('3. 🐳 Use Docker container for npm commands');
    console.log('4. 📦 Create tarball manually and upload');
    
    console.log('\n💡 Nexus Web Interface:');
    console.log(`   ${nexusServer}/#browse/browse:${nexusRepo}`);
    console.log(`   Login: ${nexusUsername} / [your-password]`);
}

runTests();
