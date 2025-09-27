// Password hashing utilities using Web Crypto API
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  
  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16))
  
  // Import the password as a key
  const key = await crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )
  
  // Derive the hash
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256
  )
  
  // Combine salt and hash
  const combined = new Uint8Array(salt.length + hashBuffer.byteLength)
  combined.set(salt)
  combined.set(new Uint8Array(hashBuffer), salt.length)
  
  // Convert to base64
  return btoa(String.fromCharCode(...combined))
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    
    // Decode the stored hash
    const combined = new Uint8Array(
      atob(hashedPassword)
        .split('')
        .map(char => char.charCodeAt(0))
    )
    
    // Extract salt and hash
    const salt = combined.slice(0, 16)
    const storedHash = combined.slice(16)
    
    // Import the password as a key
    const key = await crypto.subtle.importKey(
      'raw',
      data,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    )
    
    // Derive the hash with the same salt
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      key,
      256
    )
    
    const newHash = new Uint8Array(hashBuffer)
    
    // Compare hashes
    if (newHash.length !== storedHash.length) return false
    
    let result = 0
    for (let i = 0; i < newHash.length; i++) {
      result |= newHash[i] ^ storedHash[i]
    }
    
    return result === 0
  } catch (error) {
    return false
  }
}

// JWT utilities using Web Crypto API
const base64UrlEncode = (data: Uint8Array): string => {
  const base64 = btoa(String.fromCharCode(...data))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

const base64UrlDecode = (str: string): Uint8Array => {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const decoded = atob(base64 + padding)
  return new Uint8Array(decoded.split('').map(char => char.charCodeAt(0)))
}

export const generateJWT = async (userId: string, jwtSecret: string, type: 'access' | 'refresh' = 'access'): Promise<string> => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }
  
  const now = Math.floor(Date.now() / 1000)
  const expiresIn = type === 'access' ? 24 * 60 * 60 : 7 * 24 * 60 * 60 // 24h or 7d
  
  const payload = {
    userId,
    type,
    iat: now,
    exp: now + expiresIn
  }
  
  const encoder = new TextEncoder()
  const headerEncoded = base64UrlEncode(encoder.encode(JSON.stringify(header)))
  const payloadEncoded = base64UrlEncode(encoder.encode(JSON.stringify(payload)))
  
  const message = `${headerEncoded}.${payloadEncoded}`
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(jwtSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  const signatureEncoded = base64UrlEncode(new Uint8Array(signature))
  
  return `${message}.${signatureEncoded}`
}

export const generateRefreshToken = async (userId: string, jwtSecret: string): Promise<string> => {
  return generateJWT(userId, jwtSecret, 'refresh')
}

export const verifyJWT = async (token: string, jwtSecret: string): Promise<{ userId: string; type: string }> => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid token format')
    }
    
    const [headerEncoded, payloadEncoded, signatureEncoded] = parts
    
    // Verify signature
    const encoder = new TextEncoder()
    const message = `${headerEncoded}.${payloadEncoded}`
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(jwtSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    
    const signature = base64UrlDecode(signatureEncoded)
    const isValid = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(message))
    
    if (!isValid) {
      throw new Error('Invalid signature')
    }
    
    // Decode payload
    const payloadData = base64UrlDecode(payloadEncoded)
    const payload = JSON.parse(new TextDecoder().decode(payloadData))
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      throw new Error('Token expired')
    }
    
    return { userId: payload.userId, type: payload.type }
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

// Extract JWT from Authorization header
export const extractTokenFromHeader = (authHeader: string | undefined): string => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header')
  }
  return authHeader.substring(7) // Remove "Bearer " prefix
}
