import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Rasgoal'

interface ClassInvitationProps {
  studentName?: string
  teacherName?: string
  classTitle?: string
  subject?: string
  topic?: string
  classType?: string
  startTimeFormatted?: string
  durationMinutes?: number
  description?: string
  classUrl?: string
}

const ClassInvitationEmail = ({
  studentName,
  teacherName = 'Your teacher',
  classTitle = 'A live class',
  subject,
  topic,
  classType,
  startTimeFormatted = 'Soon',
  durationMinutes,
  description,
  classUrl,
}: ClassInvitationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{teacherName} added you to {classTitle}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {studentName ? `Hi ${studentName},` : 'Hi,'}
        </Heading>
        <Text style={text}>
          <strong>{teacherName}</strong> has added you to a live class on {SITE_NAME}.
        </Text>

        <Section style={card}>
          <Text style={cardTitle}>{classTitle}</Text>
          {subject && <Text style={cardRow}><strong>Subject:</strong> {subject}</Text>}
          {topic && <Text style={cardRow}><strong>Topic:</strong> {topic}</Text>}
          <Text style={cardRow}><strong>When:</strong> {startTimeFormatted}</Text>
          {durationMinutes && (
            <Text style={cardRow}><strong>Duration:</strong> {durationMinutes} minutes</Text>
          )}
          {classType && (
            <Text style={cardRow}>
              <strong>Type:</strong> {classType === 'one_to_one' ? 'One-to-one' : 'Group class'}
            </Text>
          )}
          {description && <Text style={cardRow}>{description}</Text>}
        </Section>

        {classUrl && (
          <Section style={{ textAlign: 'center', margin: '28px 0' }}>
            <Button href={classUrl} style={button}>View class</Button>
          </Section>
        )}

        <Hr style={hr} />
        <Text style={footer}>
          You're receiving this because your teacher added you to a class on {SITE_NAME}.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ClassInvitationEmail,
  subject: (data: Record<string, any>) =>
    `${data.teacherName || 'Your teacher'} added you to ${data.classTitle || 'a live class'}`,
  displayName: 'Class invitation',
  previewData: {
    studentName: 'Mwape',
    teacherName: 'Mrs. Banda',
    classTitle: 'Algebra revision',
    subject: 'Mathematics',
    topic: 'Quadratic equations',
    classType: 'group',
    startTimeFormatted: 'Friday, 23 May 2026 at 3:00 PM',
    durationMinutes: 60,
    description: 'Bring your notebook and questions from chapter 4.',
    classUrl: 'https://rasgoal.com/classes/example',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Nunito, Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 16px', fontFamily: 'Space Grotesk, sans-serif' }
const text = { fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
const card = { backgroundColor: '#f7f5ef', borderRadius: '12px', padding: '18px 20px', margin: '8px 0 8px' }
const cardTitle = { fontSize: '17px', fontWeight: 700, color: '#1f2937', margin: '0 0 10px', fontFamily: 'Space Grotesk, sans-serif' }
const cardRow = { fontSize: '14px', color: '#374151', lineHeight: '1.5', margin: '4px 0' }
const button = { backgroundColor: '#26a37f', color: '#ffffff', padding: '12px 22px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }
const hr = { borderColor: '#e5e7eb', margin: '28px 0 14px' }
const footer = { fontSize: '12px', color: '#6b7280', margin: 0 }
