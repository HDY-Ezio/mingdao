/**
 * Welcome Email - 欢迎邮件
 * 
 * Sent when a new user creates an account.
 * Features:
 * - Warm greeting
 * - Introduction to Mingdao
 * - Three service highlights
 * - CTA to begin first reading
 * - Seasonal theme
 */

import { EmailLayout } from '../layout'
import { seasonThemes, type SeasonTheme, getCurrentSeasonTheme, getDailyMansionForEmail } from '../theme'

interface WelcomeEmailProps {
  name?: string
  season?: SeasonTheme
}

export function WelcomeEmail({ name = 'Seeker', season = getCurrentSeasonTheme() }: WelcomeEmailProps) {
  const theme = seasonThemes[season]
  const mansion = getDailyMansionForEmail()

  return (
    <EmailLayout
      season={season}
      previewText={`Welcome to Mingdao, ${name}! Begin your journey of self-discovery through ancient Eastern wisdom.`}
    >
      <table role="presentation" cellPadding="0" cellSpacing="0" border={0} width="100%">
        {/* Greeting */}
        <tr>
          <td align="center" style={{ paddingBottom: '28px' }}>
            <h1 style={{
              margin: 0,
              fontFamily: 'Georgia, serif',
              fontSize: '28px',
              fontWeight: '600',
              color: theme.text,
              lineHeight: '1.3',
              letterSpacing: '0.01em',
            }}>
              Welcome, {name}
            </h1>
          </td>
        </tr>

        {/* Decorative divider */}
        <tr>
          <td align="center" style={{ paddingBottom: '28px' }}>
            <div style={{
              width: '48px',
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
            }} />
          </td>
        </tr>

        {/* Intro paragraph */}
        <tr>
          <td style={{ paddingBottom: '24px' }}>
            <p style={{
              margin: 0,
              fontFamily: 'Georgia, serif',
              fontSize: '16px',
              lineHeight: '1.8',
              color: theme.text,
            }}>
              Thank you for joining Mingdao. Your journey of self-discovery begins today.
            </p>
          </td>
        </tr>

        <tr>
          <td style={{ paddingBottom: '24px' }}>
            <p style={{
              margin: 0,
              fontFamily: 'Georgia, serif',
              fontSize: '15px',
              lineHeight: '1.8',
              color: theme.textMuted,
            }}>
              For over three thousand years, seekers of wisdom have turned to the ancient arts
              of Chinese metaphysics to understand themselves and their place in the cosmos.
              Now, this profound knowledge is available to you — wherever you are in the world.
            </p>
          </td>
        </tr>

        {/* Today's mansion note */}
        <tr>
          <td style={{ paddingBottom: '32px' }}>
            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              style={{
                backgroundColor: `${theme.accent}08`,
                borderRadius: '12px',
                border: `1px solid ${theme.accent}20`,
              }}
            >
              <tr>
                <td style={{ padding: '20px 24px' }}>
                  <p style={{
                    margin: '0 0 6px 0',
                    fontFamily: 'Georgia, serif',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: theme.accent,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    ★ Today's Constellation
                  </p>
                  <p style={{
                    margin: 0,
                    fontFamily: 'Georgia, serif',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: theme.text,
                  }}>
                    <strong>{mansion.name} Mansion ({mansion.chinese})</strong> — {mansion.meaning}.
                    A day for inner reflection and aligning with your true path.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        {/* Three paths section */}
        <tr>
          <td align="center" style={{ paddingBottom: '24px' }}>
            <h2 style={{
              margin: 0,
              fontFamily: 'Georgia, serif',
              fontSize: '20px',
              fontWeight: '600',
              color: theme.text,
            }}>
              Three Paths to Explore
            </h2>
          </td>
        </tr>

        {/* Bazi Card */}
        <tr>
          <td style={{ paddingBottom: '16px' }}>
            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              style={{
                backgroundColor: theme.paper,
                borderRadius: '10px',
                border: `1px solid ${theme.secondary}40`,
              }}
            >
              <tr>
                <td style={{ padding: '20px' }}>
                  <table role="presentation" cellPadding="0" cellSpacing="0" border={0} width="100%">
                    <tr>
                      <td width="48" valign="top">
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
                          textAlign: 'center',
                          lineHeight: '40px',
                          color: 'white',
                          fontSize: '18px',
                        }}>
                          八
                        </div>
                      </td>
                      <td style={{ paddingLeft: '16px' }}>
                        <p style={{
                          margin: '0 0 4px 0',
                          fontFamily: 'Georgia, serif',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: theme.text,
                        }}>
                          Bazi Reading
                        </p>
                        <p style={{
                          margin: 0,
                          fontFamily: 'Georgia, serif',
                          fontSize: '13px',
                          lineHeight: '1.6',
                          color: theme.textMuted,
                        }}>
                          The Four Pillars of Destiny — discover your elemental blueprint
                          and life patterns through your birth date and time.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        {/* Purple Star Card */}
        <tr>
          <td style={{ paddingBottom: '16px' }}>
            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              style={{
                backgroundColor: theme.paper,
                borderRadius: '10px',
                border: `1px solid ${theme.secondary}40`,
              }}
            >
              <tr>
                <td style={{ padding: '20px' }}>
                  <table role="presentation" cellPadding="0" cellSpacing="0" border={0} width="100%">
                    <tr>
                      <td width="48" valign="top">
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: `linear-gradient(135deg, #cc3624, #76261d)`,
                          textAlign: 'center',
                          lineHeight: '40px',
                          color: 'white',
                          fontSize: '18px',
                        }}>
                          紫
                        </div>
                      </td>
                      <td style={{ paddingLeft: '16px' }}>
                        <p style={{
                          margin: '0 0 4px 0',
                          fontFamily: 'Georgia, serif',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: theme.text,
                        }}>
                          Purple Star Astrology
                        </p>
                        <p style={{
                          margin: 0,
                          fontFamily: 'Georgia, serif',
                          fontSize: '13px',
                          lineHeight: '1.6',
                          color: theme.textMuted,
                        }}>
                          Zi Wei Dou Shu — the emperor's astrology, mapping your destiny
                          across twelve life palaces.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        {/* I Ching Card */}
        <tr>
          <td style={{ paddingBottom: '32px' }}>
            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              style={{
                backgroundColor: theme.paper,
                borderRadius: '10px',
                border: `1px solid ${theme.secondary}40`,
              }}
            >
              <tr>
                <td style={{ padding: '20px' }}>
                  <table role="presentation" cellPadding="0" cellSpacing="0" border={0} width="100%">
                    <tr>
                      <td width="48" valign="top">
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #316a57, #1f3a32)',
                          textAlign: 'center',
                          lineHeight: '40px',
                          color: 'white',
                          fontSize: '18px',
                        }}>
                          易
                        </div>
                      </td>
                      <td style={{ paddingLeft: '16px' }}>
                        <p style={{
                          margin: '0 0 4px 0',
                          fontFamily: 'Georgia, serif',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: theme.text,
                        }}>
                          I Ching Divination
                        </p>
                        <p style={{
                          margin: 0,
                          fontFamily: 'Georgia, serif',
                          fontSize: '13px',
                          lineHeight: '1.6',
                          color: theme.textMuted,
                        }}>
                          The Book of Changes — consult the ancient oracle for guidance
                          on your most important questions.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        {/* CTA Button */}
        <tr>
          <td align="center" style={{ paddingBottom: '32px' }}>
            <table role="presentation" cellPadding="0" cellSpacing="0" border={0}>
              <tr>
                <td
                  align="center"
                  style={{
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
                  }}
                >
                  <a
                    href="https://mingdao.space/services"
                    style={{
                      display: 'inline-block',
                      padding: '14px 32px',
                      fontFamily: 'Georgia, serif',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#ffffff',
                      textDecoration: 'none',
                      borderRadius: '8px',
                    }}
                  >
                    Begin Your First Reading
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        {/* Closing */}
        <tr>
          <td align="center">
            <p style={{
              margin: 0,
              fontFamily: 'Georgia, serif',
              fontSize: '14px',
              lineHeight: '1.8',
              color: theme.textMuted,
              fontStyle: 'italic',
            }}>
              "When the student is ready, the teacher appears."
            </p>
            <p style={{
              margin: '16px 0 0 0',
              fontFamily: 'Georgia, serif',
              fontSize: '14px',
              color: theme.text,
            }}>
              In light and wisdom,
              <br />
              <strong>The Mingdao Team</strong>
            </p>
          </td>
        </tr>
      </table>
    </EmailLayout>
  )
}

export default WelcomeEmail
