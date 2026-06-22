import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Rasgoal'

interface Props {
  affiliateName?: string
  commissionAmount?: number
  currency?: string
  totalPending?: number
  totalEarned?: number
  dashboardUrl?: string
}

const Email = ({
  affiliateName,
  commissionAmount = 20,
  currency = 'K',
  totalPending,
  totalEarned,
  dashboardUrl = 'https://rasgoal.com/affiliate',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You just earned {currency}{commissionAmount} — a new referral subscribed 🎉</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {affiliateName ? `Great news, ${affiliateName}! 🎉` : 'Great news! 🎉'}
        </Heading>
        <Text style={text}>
          One of your referrals just subscribed to {SITE_NAME} and a commission has been added to your account.
        </Text>

        <Section style={card}>
          <Text style={cardLabel}>You earned</Text>
          <Text style={amount}>{currency}{commissionAmount.toFixed(2)}</Text>
          {typeof totalPending === 'number' && (
            <Text style={cardRow}>
              <strong>Pending balance:</strong> {currency}{totalPending.toFixed(2)}
            </Text>
          )}
          {typeof totalEarned === 'number' && (
            <Text style={cardRow}>
              <strong>Total earned:</strong> {currency}{totalEarned.toFixed(2)}
            </Text>
          )}
        </Section>

        <Section style={{ textAlign: 'center', margin: '28px 0' }}>
          <Button href={dashboardUrl} style={button}>View your dashboard</Button>
        </Section>

        <Text style={text}>
          Keep sharing your referral link to earn more. Thank you for spreading the word about {SITE_NAME}!
        </Text>

        <Hr style={hr} />
        <Text style={footer}>
          You're receiving this because you're a {SITE_NAME} affiliate partner.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `🎉 You earned ${data.currency || 'K'}${Number(data.commissionAmount ?? 20).toFixed(2)} — a new referral subscribed`,
  displayName: 'Affiliate referral subscribed',
  previewData: {
    affiliateName: 'Mwape',
    commissionAmount: 20,
    currency: 'K',
    totalPending: 60,
    totalEarned: 120,
    dashboardUrl: 'https://rasgoal.com/affiliate',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Nunito, Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 16px', fontFamily: 'Space Grotesk, sans-serif' }
const text = { fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
const card = { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px', margin: '8px 0', textAlign: 'center' as const }
const cardLabel = { fontSize: '13px', color: '#15803d', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '0 0 6px', fontWeight: 700 }
const amount = { fontSize: '34px', fontWeight: 800, color: '#15803d', margin: '0 0 14px', fontFamily: 'Space Grotesk, sans-serif' }
const cardRow = { fontSize: '14px', color: '#374151', lineHeight: '1.5', margin: '4px 0', textAlign: 'left' as const }
const button = { backgroundColor: '#26a37f', color: '#ffffff', padding: '12px 22px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }
const hr = { borderColor: '#e5e7eb', margin: '28px 0 14px' }
const footer = { fontSize: '12px', color: '#6b7280', margin: 0 }
