// Security configuration for the application
export const securityConfig = {
  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-eval'", // Required for Next.js
      "'unsafe-inline'", // Required for Next.js
      'https://fonts.googleapis.com',
      'https://www.googletagmanager.com',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind CSS
      'https://fonts.googleapis.com',
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'data:',
    ],
    'img-src': [
      "'self'",
      'data:',
      'https:',
      'blob:',
    ],
    'connect-src': [
      "'self'",
      'https:',
      'wss:',
      'ws:',
    ],
    'media-src': [
      "'self'",
      'https:',
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  },

  // HSTS configuration
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },

  // Cross-Origin policies
  crossOrigin: {
    openerPolicy: 'same-origin',
    embedderPolicy: 'require-corp',
    resourcePolicy: 'same-origin',
  },

  // Permissions Policy
  permissionsPolicy: {
    camera: '()',
    microphone: '()',
    geolocation: '()',
    payment: '()',
    usb: '()',
    magnetometer: '()',
    gyroscope: '()',
    accelerometer: '()',
  },
};

// Generate CSP string
export function generateCSP(): string {
  const directives = Object.entries(securityConfig.csp)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');

  return directives;
}

// Generate HSTS string
export function generateHSTS(): string {
  const { maxAge, includeSubDomains, preload } = securityConfig.hsts;
  let hsts = `max-age=${maxAge}`;
  
  if (includeSubDomains) {
    hsts += '; includeSubDomains';
  }
  
  if (preload) {
    hsts += '; preload';
  }
  
  return hsts;
}

// Generate Permissions Policy string
export function generatePermissionsPolicy(): string {
  return Object.entries(securityConfig.permissionsPolicy)
    .map(([feature, value]) => `${feature}=${value}`)
    .join(', ');
}

// Security headers configuration
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': generatePermissionsPolicy(),
  'Cross-Origin-Opener-Policy': securityConfig.crossOrigin.openerPolicy,
  'Cross-Origin-Embedder-Policy': securityConfig.crossOrigin.embedderPolicy,
  'Cross-Origin-Resource-Policy': securityConfig.crossOrigin.resourcePolicy,
};

// HTTPS redirect middleware
export function createHTTPSRedirect() {
  return (request: Request) => {
    const url = new URL(request.url);
    
    // Only redirect if not already HTTPS and not localhost
    if (url.protocol === 'http:' && !url.hostname.includes('localhost')) {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    
    return null;
  };
} 