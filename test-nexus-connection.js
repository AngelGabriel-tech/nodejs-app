const https = require('https');
const http = require('http');
const url = require('url');

async function testNexusConnection() {
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
    
    const nexusUrl = `${nexusServer}/repository/${nexusRepo}/`;
    const parsedUrl = new URL(nexusUrl);
    
    console.log('🔍 Testing Nexus connection...');
    console.log('URL:', nexusUrl);
    
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname,
        method: 'GET',
        headers: {
            'User-Agent': 'npm/test-client',
            'Authorization': 'Basic ' + Buffer.from(`${nexusUsername}:${nexusPassword}`).toString('base64')
        }
    };
    
    return new Promise((resolve, reject) => {
        const request = http.request(options, (response) => {
            console.log('✅ Response Status:', response.statusCode);
            console.log('📋 Response Headers:', JSON.stringify(response.headers, null, 2));
            
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                if (response.statusCode === 200) {
                    console.log('🎉 Connection successful!');
                    console.log('📦 Repository is accessible');
                } else if (response.statusCode === 401) {
                    console.log('❌ Authentication failed - check username/password');
                } else if (response.statusCode === 404) {
                    console.log('❌ Repository not found - check URL and repository name');
                } else {
                    console.log('⚠️  Unexpected response:', response.statusCode);
                }
                
                if (data.length < 500) {
                    console.log('📄 Response body:', data);
                }
                
                resolve(response.statusCode);
            });
        });
        
        request.on('error', (error) => {
            console.log('❌ Connection failed:', error.message);
            reject(error);
        });
        
        request.setTimeout(10000, () => {
            console.log('⏰ Request timeout');
            request.destroy();
        });
        
        request.end();
    });
}

// Also test npm registry info
async function testNpmRegistryInfo() {
    console.log('\n🔍 Testing npm registry info...');
    
    // Load environment variables
    const nexusServer = process.env.NEXUS_SERVER || 'http://your-nexus-server.com:8081';
    const nexusRepo = process.env.NEXUS_REPOSITORY || 'npm-public';
    const nexusUsername = process.env.NEXUS_USERNAME || 'your-username';
    const nexusPassword = process.env.NEXUS_PASSWORD || 'your-password';
    
    const parsedUrl = new URL(nexusServer);
    
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 8081,
        path: `/repository/${nexusRepo}/`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(`${nexusUsername}:${nexusPassword}`).toString('base64')
        }
    };
    
    return new Promise((resolve, reject) => {
        const request = http.request(options, (response) => {
            let data = '';
            response.on('data', (chunk) => data += chunk);
            response.on('end', () => {
                console.log('📊 Registry info status:', response.statusCode);
                if (response.statusCode === 200) {
                    try {
                        const jsonData = JSON.parse(data);
                        console.log('✅ Registry is responding correctly');
                    } catch (e) {
                        console.log('✅ Registry is responding (non-JSON response)');
                    }
                }
                resolve(response.statusCode);
            });
        });
        
        request.on('error', (error) => {
            console.log('❌ Registry info test failed:', error.message);
            reject(error);
        });
        
        request.end();
    });
}

async function runTests() {
    try {
        await testNexusConnection();
        await testNpmRegistryInfo();
        console.log('\n🏁 Test completed!');
    } catch (error) {
        console.error('💥 Test failed:', error.message);
    }
}

runTests();
