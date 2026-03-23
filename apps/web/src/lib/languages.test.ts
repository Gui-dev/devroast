import { describe, expect, it } from 'vitest'
import { LANGUAGES, LANGUAGE_OPTIONS } from './languages'

describe('languages', () => {
  describe('LANGUAGES', () => {
    it('should contain javascript language entry', () => {
      expect(LANGUAGES).toHaveProperty('javascript')
      expect(LANGUAGES.javascript).toEqual({
        name: 'JavaScript',
        shikiId: 'javascript',
        hljsId: 'javascript',
        eager: true,
      })
    })

    it('should contain typescript language entry', () => {
      expect(LANGUAGES).toHaveProperty('typescript')
      expect(LANGUAGES.typescript).toEqual({
        name: 'TypeScript',
        shikiId: 'typescript',
        hljsId: 'typescript',
        eager: true,
      })
    })

    it('should have all supported languages', () => {
      const expectedLanguages = [
        'javascript',
        'typescript',
        'jsx',
        'tsx',
        'python',
        'go',
        'rust',
        'java',
        'ruby',
        'php',
        'sql',
        'shellscript',
        'html',
        'css',
        'json',
        'yaml',
        'markdown',
        'c',
        'cpp',
        'csharp',
        'swift',
        'kotlin',
        'dart',
      ]

      for (const lang of expectedLanguages) {
        expect(LANGUAGES).toHaveProperty(lang)
      }
    })

    it('should have correct shikiId for each language', () => {
      for (const entry of Object.values(LANGUAGES)) {
        expect(entry.shikiId).toBeDefined()
        expect(typeof entry.shikiId).toBe('string')
        expect(entry.shikiId.length).toBeGreaterThan(0)
      }
    })

    it('should have correct hljsId for each language', () => {
      for (const entry of Object.values(LANGUAGES)) {
        expect(entry.hljsId).toBeDefined()
        expect(typeof entry.hljsId).toBe('string')
        expect(entry.hljsId.length).toBeGreaterThan(0)
      }
    })
  })

  describe('LANGUAGE_OPTIONS', () => {
    it('should return array of options', () => {
      expect(Array.isArray(LANGUAGE_OPTIONS)).toBe(true)
      expect(LANGUAGE_OPTIONS.length).toBeGreaterThan(0)
    })

    it('should have value and label for each option', () => {
      for (const option of LANGUAGE_OPTIONS) {
        expect(option).toHaveProperty('value')
        expect(option).toHaveProperty('label')
        expect(typeof option.value).toBe('string')
        expect(typeof option.label).toBe('string')
      }
    })

    it('should be sorted alphabetically by label', () => {
      for (let i = 1; i < LANGUAGE_OPTIONS.length; i++) {
        const prev = LANGUAGE_OPTIONS[i - 1].label
        const curr = LANGUAGE_OPTIONS[i].label
        expect(prev.localeCompare(curr)).toBeLessThanOrEqual(0)
      }
    })

    it('should have C# option with correct value', () => {
      const csharpOption = LANGUAGE_OPTIONS.find(opt => opt.value === 'csharp')
      expect(csharpOption).toBeDefined()
      expect(csharpOption?.label).toBe('C#')
    })

    it('should have C++ option with correct value', () => {
      const cppOption = LANGUAGE_OPTIONS.find(opt => opt.value === 'cpp')
      expect(cppOption).toBeDefined()
      expect(cppOption?.label).toBe('C++')
    })

    it('should have JavaScript before TypeScript alphabetically', () => {
      const jsIndex = LANGUAGE_OPTIONS.findIndex(opt => opt.value === 'javascript')
      const tsIndex = LANGUAGE_OPTIONS.findIndex(opt => opt.value === 'typescript')
      expect(jsIndex).toBeLessThan(tsIndex)
    })

    it('should have Python in the list', () => {
      const pythonOption = LANGUAGE_OPTIONS.find(opt => opt.value === 'python')
      expect(pythonOption).toBeDefined()
      expect(pythonOption?.label).toBe('Python')
    })
  })
})
