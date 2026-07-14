/**
 * Email Footer - 邮件底部
 * 
 * Features:
 * - Navigation links
 * - Social media icons
 * - Copyright
 * - Unsubscribe link
 * - Seasonal theme colors
 */

import { seasonThemes, type SeasonTheme } from '../theme'

interface EmailFooterProps {
  season?: SeasonTheme
  unsubscribeUrl?: string
}

export function EmailFooter({ season = 'winter', unsubscribeUrl = '#' }: EmailFooterProps) {
  const theme = seasonThemes[season]

  return (
    <table
      role="presentation"
      cellPadding="0"
      cellSpacing="0"
      border={0}
      width="100%"
      style={{
        backgroundColor: theme.paper,
        borderLeft: `1px solid ${theme.secondary}40`,
        borderRight: `1px solid ${theme.secondary}40`,
        borderBottom: `1px solid ${theme.secondary}40`,
      }}
    >
      {/* Top border accent */}
      <tr>
        <td style={{ padding: '0 48px' }}>
          <table role="presentation" cellPadding="0" cellSpacing="0" border={0} width="100%">
            <tr>
              <td width="40%" align="right">
                <div style={{ height: '1px', backgroundColor: `${theme.accent}30` }} />
              </td>
              <td width="20%" align="center" style={{ padding: '0 12px' }}>
                <span style={{ color: theme.accent, fontSize: '12px' }}>✦</span>
              </td>
              <td width="40%" align="left">
                <div style={{ height: '1px', backgroundColor: `${theme.accent}30` }} />
              </td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Footer content */}
      <tr>
        <td style={{ padding: '24px 48px 32px' }}>
          <table role="presentation" cellPadding="0" cellSpacing="0" border={0} width="100%">
            {/* Navigation links */}
            <tr>
              <td align="center" style={{ paddingBottom: '20px' }}>
                <table role="presentation" cellPadding="0" cellSpacing="0" border={0} align="center">
                  <tr>
                    <td style={{ padding: '0 12px' }}>
                      <a
                        href="https://mingdao.space/services"
                        style={{
                          color: theme.textMuted,
                          fontFamily: 'Georgia, serif',
                          fontSize: '12px',
                          textDecoration: 'none',
                        }}
                      >
                        Services
                      </a>
                    </td>
                    <td style={{ color: theme.secondary, fontSize: '10px' }}>·</td>
                    <td style={{ padding: '0 12px' }}>
                      <a
                        href="https://mingdao.space/about"
                        style={{
                          color: theme.textMuted,
                          fontFamily: 'Georgia, serif',
                          fontSize: '12px',
                          textDecoration: 'none',
                        }}
                      >
                        About
                      </a>
                    </td>
                    <td style={{ color: theme.secondary, fontSize: '10px' }}>·</td>
                    <td style={{ padding: '0 12px' }}>
                      <a
                        href="https://mingdao.space/blog"
                        style={{
                          color: theme.textMuted,
                          fontFamily: 'Georgia, serif',
                          fontSize: '12px',
                          textDecoration: 'none',
                        }}
                      >
                        Journal
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            {/* Social icons */}
            <tr>
              <td align="center" style={{ paddingBottom: '20px' }}>
                <table role="presentation" cellPadding="0" cellSpacing="0" border={0} align="center">
                  <tr>
                    <td width="36" align="center">
                      <a href="#" style={{ textDecoration: 'none' }}>
                        <span style={{ color: theme.textMuted, fontSize: '16px' }}>◎</span>
                      </a>
                    </td>
                    <td width="36" align="center">
                      <a href="#" style={{ textDecoration: 'none' }}>
                        <span style={{ color: theme.textMuted, fontSize: '16px' }}>◇</span>
                      </a>
                    </td>
                    <td width="36" align="center">
                      <a href="#" style={{ textDecoration: 'none' }}>
                        <span style={{ color: theme.textMuted, fontSize: '16px' }}>△</span>
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            {/* Copyright */}
            <tr>
              <td align="center">
                <p style={{
                  margin: 0,
                  color: theme.textMuted,
                  fontFamily: 'Georgia, serif',
                  fontSize: '11px',
                  lineHeight: '1.6',
                }}>
                  © {new Date().getFullYear()} Mingdao. All rights reserved.
                </p>
                <p style={{
                  margin: '6px 0 0 0',
                  color: theme.textMuted,
                  fontFamily: 'Georgia, serif',
                  fontSize: '10px',
                  fontStyle: 'italic',
                  opacity: 0.7,
                }}>
                  "The journey of a thousand miles begins with a single step."
                </p>
              </td>
            </tr>

            {/* Unsubscribe */}
            <tr>
              <td align="center" style={{ paddingTop: '16px' }}>
                <a
                  href={unsubscribeUrl}
                  style={{
                    color: theme.textMuted,
                    fontFamily: 'Georgia, serif',
                    fontSize: '10px',
                    textDecoration: 'underline',
                    opacity: 0.6,
                  }}
                >
                  Unsubscribe
                </a>
                {' · '}
                <a
                  href="https://mingdao.space/privacy"
                  style={{
                    color: theme.textMuted,
                    fontFamily: 'Georgia, serif',
                    fontSize: '10px',
                    textDecoration: 'underline',
                    opacity: 0.6,
                  }}
                >
                  Privacy Policy
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  )
}
