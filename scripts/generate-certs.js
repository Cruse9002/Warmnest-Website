const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const certsDir = path.join(__dirname, '..', 'certs');

// Create certs directory if it doesn't exist
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

// Generate self-signed certificate
const certPath = path.join(certsDir, 'localhost.pem');
const keyPath = path.join(certsDir, 'localhost-key.pem');

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.log('Generating self-signed SSL certificates for development...');
  
  const opensslCommand = `openssl req -x509 -out ${certPath} -keyout ${keyPath} -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -extensions EXT -config <(printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")`;
  
  try {
    execSync(opensslCommand, { shell: '/bin/bash' });
    console.log('✅ SSL certificates generated successfully!');
    console.log(`Certificate: ${certPath}`);
    console.log(`Private Key: ${keyPath}`);
  } catch (error) {
    console.error('❌ Failed to generate SSL certificates:', error.message);
    console.log('Please install OpenSSL or generate certificates manually.');
  }
} else {
  console.log('✅ SSL certificates already exist!');
} 