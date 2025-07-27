const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const certsDir = path.join(__dirname, '..', 'certs');

// Create certs directory if it doesn't exist
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

// Generate self-signed certificate using PowerShell
const certPath = path.join(certsDir, 'localhost.pem');
const keyPath = path.join(certsDir, 'localhost-key.pem');

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.log('Generating self-signed SSL certificates for development...');
  
  try {
    // PowerShell command to generate self-signed certificate
    const psCommand = `
      $cert = New-SelfSignedCertificate -DnsName "localhost" -CertStoreLocation "cert:\\LocalMachine\\My" -KeyAlgorithm RSA -KeyLength 2048 -NotAfter (Get-Date).AddYears(1)
      $pwd = ConvertTo-SecureString -String "password" -Force -AsPlainText
      Export-PfxCertificate -Cert $cert -FilePath "${certPath.replace(/\\/g, '\\\\')}" -Password $pwd
      Export-Certificate -Cert $cert -FilePath "${certPath.replace(/\\/g, '\\\\')}"
    `;
    
    execSync(`powershell -Command "${psCommand}"`, { stdio: 'inherit' });
    console.log('✅ SSL certificates generated successfully!');
    console.log(`Certificate: ${certPath}`);
    console.log(`Private Key: ${keyPath}`);
  } catch (error) {
    console.error('❌ Failed to generate SSL certificates:', error.message);
    console.log('Please install OpenSSL or generate certificates manually.');
    console.log('Alternative: Use mkcert (https://github.com/FiloSottile/mkcert)');
  }
} else {
  console.log('✅ SSL certificates already exist!');
} 