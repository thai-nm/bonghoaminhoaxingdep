// Test setup file for Vitest
// This file runs before all tests

import { vi } from 'vitest'

// Mock crypto for testing environment
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: Uint8Array) => {
      // Generate deterministic values for testing
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    },
    subtle: {
      importKey: async (format: any, keyData: any, algorithm: any, extractable: boolean, keyUsages: string[]) => {
        return { type: 'secret', algorithm, extractable, usages: keyUsages }
      },
      deriveBits: async (algorithm: any, key: any, length: number) => {
        // Mock PBKDF2 derivation - return deterministic result for testing
        const result = new ArrayBuffer(length / 8)
        const view = new Uint8Array(result)
        for (let i = 0; i < view.length; i++) {
          view[i] = (i + 42) % 256 // Deterministic pattern
        }
        return result
      },
      sign: async (algorithm: string, key: any, data: any) => {
        // Mock HMAC signing - return deterministic result
        const result = new ArrayBuffer(32)
        const view = new Uint8Array(result)
        for (let i = 0; i < view.length; i++) {
          view[i] = (i + 123) % 256 // Deterministic pattern
        }
        return result
      },
      verify: async (algorithm: string, key: any, signature: any, data: any) => {
        // Mock verification - always return true for testing
        return true
      }
    }
  },
  writable: true
})

// Mock btoa and atob for Node.js environment
global.btoa = (str: string) => Buffer.from(str, 'binary').toString('base64')
global.atob = (str: string) => Buffer.from(str, 'base64').toString('binary')

// Mock TextEncoder and TextDecoder
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
