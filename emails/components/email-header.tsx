/**
 * Email Header - 邮件头部
 * 
 * Features:
 * - Brand logo (seal style)
 * - Seasonal theme colors
 * - Decorative gold line accent
 */

import { seasonThemes, type SeasonTheme } from '../theme'

interface EmailHeaderProps {
  season?: SeasonTheme
}

export function EmailHeader({ season = 'winter' }: EmailHeaderProps) {
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
      }}
    >
      <tr>
        <td align="center" style={{ padding: '32px 48px 16px' }}>
          {/* Logo */}
          <table role="presentation" cellPadding="0" cellSpacing="0" border={0} align="center">
            <tr>
              <td align="center">
                {/* Seal-style logo */}
                <table role="presentation" cellPadding="0" cellSpacing="0" border={0} align="center" style={{ marginBottom: '12px' }}>
                  <tr>
                    <td
                      width="56"
                      height="56"
                      align="center"
                      valign="middle"
                      style={{
                        backgroundColor: '#cc3624',
                        borderRadius: '10px',
                        msoBorderRadius: '10px',
                      }}
                    >
                      <span style={{
                        color: '#ffffff',
                        fontSize: '22px',
                        fontFamily: 'Georgia, serif',
                        fontWeight: 'bold',
                        letterSpacing: '0.05em',
                      }}>
                        明
                      </span>
                    </td>
                  </tr>
                </table>
                
                {/* Brand name */}
                <p style={{
                  margin: 0,
                  fontFamily: 'Georgia, serif',
                  fontSize: '24px',
                  fontWeight: '600',
                  color: theme.text,
                  letterSpacing: '0.05em',
                }}>
                  Mingdao
                </p>
                
                {/* Tagline */}
                <p style={{
                  margin: '4px 0 0 0',
                  fontFamily: 'Georgia, serif',
                  fontSize: '11px',
                  color: theme.textMuted,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}>
                  Light Your Path
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      {/* Gold accent line */}
      <tr>
        <td style={{ padding: '0 48px 24px' }}>
          <table role="presentation" cellPadding="0" cellSpacing="0" border={0} width="100%">
            <tr>
              <td width="40%" align="right">
                <div style={{ height: '1px', backgroundColor: `${theme.accent}40` }} />
              </td>
              <td width="20%" align="center" style={{ padding: '0 12px' }}>
                <span style={{ color: theme.accent, fontSize: '14px' }}>◆</span>
              </td>
              <td width="40%" align="left">
                <div style={{ height: '1px', backgroundColor: `${theme.accent}40` }} />
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  )
}
