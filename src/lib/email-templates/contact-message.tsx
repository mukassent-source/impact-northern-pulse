import React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  email?: string
  phone?: string
  organization?: string
  subject?: string
  message?: string
}

const Email = ({ name, email, phone, organization, subject, message }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New contact message from {name || 'a website visitor'}</Preview>
    <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Georgia, Arial, sans-serif' }}>
      <Container style={{ padding: '32px 28px', maxWidth: '560px', color: '#222222' }}>
        <Text style={{ color: '#b08d3c', fontSize: '12px' }}>SAMUEL ATO AFFUL</Text>
        <Heading style={{ fontSize: '24px' }}>New contact message</Heading>
        <Text><strong>Subject:</strong> {subject || 'Website enquiry'}</Text>
        <Text><strong>Name:</strong> {name || '—'}</Text>
        <Text><strong>Email:</strong> {email || '—'}</Text>
        {phone && <Text><strong>Phone:</strong> {phone}</Text>}
        {organization && <Text><strong>Organization:</strong> {organization}</Text>}
        <Text style={{ whiteSpace: 'pre-line', lineHeight: '24px' }}>{message || 'No message provided.'}</Text>
        <Text style={{ fontSize: '12px', color: '#666666' }}>A copy is saved in your admin dashboard. Reply to this email to contact the sender.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, unknown>) => `Website message: ${data['subject'] || 'New enquiry'}`,
  displayName: 'Contact message (to owner)',
  to: 'sammyafful@gmail.com',
  previewData: { name: 'Example Visitor', email: 'visitor@example.org', subject: 'Speaking invitation', message: 'Please contact me about a speaking invitation.' },
} satisfies TemplateEntry