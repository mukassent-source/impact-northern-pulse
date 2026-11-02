import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TEMPLATES } from './registry'

test('contact notifications always go to the owner inbox, not the visitor', () => {
  assert.equal(TEMPLATES['contact-message']?.to, 'sammyafful@gmail.com')
})