import React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  email?: string
  phone?: string
  organization?: string
  message?: string
}

const Email = ({ name, email, phone, organization, message }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New partnership application{organization ? ` from ${organization}` : ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>SAMUEL ATO AFFUL · PORTFOLIO</Text>
        <Heading style={h1}>New partnership application</Heading>
        <Section style={card}>
          <Text style={row}><strong>Name:</strong> {name || '—'}</Text>
          <Text style={row}><strong>Email:</strong> {email || '—'}</Text>
          <Text style={row}><strong>Organization:</strong> {organization || '—'}</Text>
          <Text style={row}><strong>Phone:</strong> {phone || '—'}</Text>
        </Section>
        <Hr style={hr} />
        <Text style={body}>{message || 'No details provided.'}</Text>
        <Text style={foot}>You can also review this application in your admin dashboard.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `New partnership application${d['organization'] ? ` — ${d['organization']}` : ''}`,
  displayName: 'Partnership application (to owner)',
  to: 'sammyafful@gmail.com',
  previewData: { name: 'Jane Doe', email: 'jane@example.org', phone: '', organization: 'Example Foundation', message: 'Partnership type: Youth development\n\nGoals:\nTrain young journalists.' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const eyebrow = { color: '#b08d3c', fontSize: '11px', letterSpacing: '2px', margin: '0 0 8px' }
const h1 = { color: '#111111', fontSize: '24px', margin: '0 0 20px' }
const card = { borderLeft: '3px solid #b08d3c', padding: '4px 16px' }
const row = { color: '#222222', fontSize: '14px', margin: '6px 0' }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const body = { color: '#333333', fontSize: '14px', lineHeight: '24px', whiteSpace: 'pre-line' as const }
const foot = { color: '#888888', fontSize: '12px', marginTop: '24px' }
