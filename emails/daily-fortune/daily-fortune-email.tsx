/**
 * Daily Fortune Email - 每日运势邮件
 * 
 * Sent daily to subscribed users.
 * Features:
 * - Personalized daily fortune based on user's chart
 * - Today's celestial stem and branch
 * - Five element day analysis
 * - Fortune scores (overall, love, career, wealth, health)
 * - Lucky color/number/direction
 * - Daily wisdom quote
 * - Seasonal theme
 */

import { EmailLayout } from '../layout'
import { seasonThemes, type SeasonTheme, getCurrentSeasonTheme } from '../theme'
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from '../theme'

interface DailyFortuneEmailProps {
  name?: string
  season?: SeasonTheme
  date?: string
  dayStemIndex?: number
  dayBranchIndex?: number
  fiveElementDay?: string
  fiveElementDayCn?: string
  scores?: {
    overall: number
    love: number
    career: number
    wealth: number
    health: number
  }
  lucky?: {
    color: string
    colorCn: string
    number: number
    direction: string
    directionCn: string
  }
  dailyMessage?: string
  dailyMessageCn?: string
  zodiacFortune?: string
  unsubscribeUrl?: string
}

export function DailyFortuneEmail({
  name = 'Seeker of Wisdom',
  season = getCurrentSeasonTheme(),
  date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  dayStemIndex = 0,
  dayBranchIndex = 0,
  fiveElementDay = 'Wood',
  fiveElementDayCn = '木',
  scores = {
    overall: 78,
    love: 82,
    career: 75,
    wealth: 70,
    health: 85,
  },
  lucky = {
    color: 'Jade Green',
    colorCn: '碧玉色',
    number: 3,
    direction: 'East',
    directionCn: '东',
  },
  dailyMessage = 'Today carries the energy of new beginnings. What you plant now will grow in time.',
  dailyMessageCn = '今日带著新生的能量。今日所种，来日必成。',
  zodiacFortune = 'Your zodiac animal enjoys supportive energy today.',
  unsubscribeUrl = 'https://mingdao.space/unsubscribe?token=placeholder',
}: DailyFortuneEmailProps) {
  const theme = seasonThemes[season]
  const dayStem = HEAVENLY_STEMS[dayStemIndex] || '甲'
  const dayBranch = EARTHLY_BRANCHES[dayBranchIndex] || '子'

  return (
    <EmailLayout
      season={season}
      previewText={`Your daily fortune for ${date} — ${fiveElementDayCn} element day awaits.`}
    >
      <table role="presentation" cellPadding="0" cellSpacing="0" border={0} width="100%">
        {/* Date */}
        <tr>
          <td align="center" style={{ paddingBottom: '8px' }}>
            <p style={{
              margin: 0,
              fontFamily: 'Georgia, serif',
              fontSize: '13px',
              color: theme.textMuted,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              {date}
            </p>
          </td>
        </tr>

        {/* Day Stem-Branch */}
        <tr>
          <td align="center" style={{ paddingBottom: '24px' }}>
            <table role="presentation" cellPadding="0" cellSpacing="0" border={0}>
              <tr>
                <td align="center">
                  <div style={{
                    fontSize: '42px',
                    fontFamily: 'Georgia, serif',
                    color: theme.text,
                    fontWeight: '500',
                    letterSpacing: '0.1em',
                  }}>
                    {dayStem}{dayBranch}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontFamily: 'Georgia, serif',
                    color: theme.accent,
                    marginTop: '4px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                  }}>
                    {fiveElementDayCn}日 · {fiveElementDay} Day
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        {/* Decorative divider */}
        <tr>
          <td align="center" style={{ paddingBottom: '24px' }}>
            <div style={{
              width: '48px',
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
            }} />
          </td>
        </tr>

        {/* Greeting */}
        <tr>
          <td style={{ paddingBottom: '20px' }}>
            <p style={{
              margin: 0,
              fontFamily: 'Georgia, serif',
              fontSize: '18px',
              color: theme.text,
              lineHeight: '1.6',
            }}>
              Greetings, {name}
            </p>
          </td>
        </tr>

        {/* Daily Message */}
        <tr>
          <td style={{ paddingBottom: '28px' }}>
            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              style={{
                backgroundColor: `${theme.accent}08`,
                borderRadius: '12px',
                borderLeft: `3px solid ${theme.accent}`,
              }}
            >
              <tr>
                <td style={{ padding: '20px 24px' }}>
                  <p style={{
                    margin: '0 0 8px 0',
                    fontFamily: 'Georgia, serif',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: theme.accent,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    ★ Today's Guidance
                  </p>
                  <p style={{
                    margin: '0 0 10px 0',
                    fontFamily: 'Georgia, serif',
                    fontSize: '15px',
                    lineHeight: '1.7',
                    color: theme.text,
                  }}>
                    {dailyMessage}
                  </p>
                  <p style={{
                    margin: 0,
                    fontFamily: 'Georgia, serif',
                    fontSize: '14px',
                    color: theme.textMuted,
                    fontStyle: 'italic',
                  }}>
                    {dailyMessageCn}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        {/* Fortune Scores */}
        <tr>
          <td align="center" style={{ paddingBottom: '24px' }}>
            <h2 style={{
              margin: '0 0 20px 0',
              fontFamily: 'Georgia, serif',
              fontSize: '18px',
              fontWeight: '600',
              color: theme.text,
            }}>
              Today's Fortune
            </h2>
          </td>
        </tr>

        {/* Score Bars */}
        <tr>
          <td style={{ paddingBottom: '28px' }}>
            <table role="presentation" cellPadding="0" cellSpacing="0" border={0} width="100%">
              {[
                { label: 'Overall', cn: '整体', score: scores.overall },
                { label: 'Love', cn: '感情', score: scores.love },
                { label: 'Career', cn: '事业', score: scores.career },
                { label: 'Wealth', cn: '财运', score: scores.wealth },
                { label: 'Health', cn: '健康', score: scores.health },
              ].map((item, i) => (
                <tr key={i}>
                  <td style={{ paddingBottom: i < 4 ? '12px' : '0' }}>
                    <table role="presentation" cellPadding="0" cellSpacing="0" border={0} width="100%">
                      <tr>
                        <td width="80" style={{ paddingRight: '12px' }}>
                          <span style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: '13px',
                            color: theme.text,
                            fontWeight: '500',
                          }}>
                            {item.cn}
                          </span>
                          <span style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: '11px',
                            color: theme.textMuted,
                            marginLeft: '4px',
                          }}>
                            {item.label}
                          </span>
                        </td>
                        <td>
                          {/* Progress bar background */}
                          <div style={{
                            height: '8px',
                            backgroundColor: `${theme.secondary}20`,
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}>
                            {/* Progress bar fill */}
                            <div style={{
                              height: '100%',
                              width: `${item.score}%`,
                              background: `linear-gradient(90deg, ${theme.accent}, ${theme.primary})`,
                              borderRadius: '4px',
                              transition: 'width 0.3s ease',
                            }} />
                          </div>
                        </td>
                        <td width="40" align="right" style={{ paddingLeft: '12px' }}>
                          <span style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: theme.accent,
                          }}>
                            {item.score}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              ))}
            </table>
          </td>
        </tr>

        {/* Lucky Items */}
        <tr>
          <td style={{ paddingBottom: '28px' }}>
            <table role="presentation" cellPadding="0" cellSpacing="0" border={0} width="100%">
              <tr>
                <td align="center" style={{ paddingBottom: '16px' }}>
                  <h3 style={{
                    margin: 0,
                    fontFamily: 'Georgia, serif',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: theme.text,
                  }}>
                    Lucky Today · 今日吉利
                  </h3>
                </td>
              </tr>
              <tr>
                <td>
                  <table role="presentation" cellPadding="0" cellSpacing="0" border={0} width="100%">
                    <tr>
                      {/* Color */}
                      <td width="33%" style={{ paddingRight: '8px' }}>
                        <div style={{
                          backgroundColor: theme.paper,
                          borderRadius: '10px',
                          border: `1px solid ${theme.secondary}30`,
                          padding: '16px 12px',
                          textAlign: 'center',
                        }}>
                          <div style={{
                            fontSize: '11px',
                            color: theme.textMuted,
                            marginBottom: '8px',
                          }}>
                            幸运色
                          </div>
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: theme.accent,
                              margin: '0 auto 8px auto',
                            }}
                          />
                          <div style={{
                            fontSize: '12px',
                            color: theme.text,
                            fontWeight: '500',
                          }}>
                            {lucky.colorCn}
                          </div>
                          <div style={{
                            fontSize: '10px',
                            color: theme.textMuted,
                          }}>
                            {lucky.color}
                          </div>
                        </div>
                      </td>
                      {/* Number */}
                      <td width="33%" style={{ padding: '0 8px' }}>
                        <div style={{
                          backgroundColor: theme.paper,
                          borderRadius: '10px',
                          border: `1px solid ${theme.secondary}30`,
                          padding: '16px 12px',
                          textAlign: 'center',
                        }}>
                          <div style={{
                            fontSize: '11px',
                            color: theme.textMuted,
                            marginBottom: '8px',
                          }}>
                            幸运数字
                          </div>
                          <div style={{
                            fontSize: '22px',
                            fontFamily: 'Georgia, serif',
                            fontWeight: '600',
                            color: theme.accent,
                            marginBottom: '4px',
                          }}>
                            {lucky.number}
                          </div>
                          <div style={{
                            fontSize: '10px',
                            color: theme.textMuted,
                          }}>
                            Lucky Number
                          </div>
                        </div>
                      </td>
                      {/* Direction */}
                      <td width="33%" style={{ paddingLeft: '8px' }}>
                        <div style={{
                          backgroundColor: theme.paper,
                          borderRadius: '10px',
                          border: `1px solid ${theme.secondary}30`,
                          padding: '16px 12px',
                          textAlign: 'center',
                        }}>
                          <div style={{
                            fontSize: '11px',
                            color: theme.textMuted,
                            marginBottom: '8px',
                          }}>
                            吉利方位
                          </div>
                          <div style={{
                            fontSize: '18px',
                            fontFamily: 'Georgia, serif',
                            marginBottom: '4px',
                            color: theme.text,
                          }}>
                            ↑
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: theme.text,
                            fontWeight: '500',
                          }}>
                            {lucky.directionCn}方
                          </div>
                          <div style={{
                            fontSize: '10px',
                            color: theme.textMuted,
                          }}>
                            {lucky.direction}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        {/* Zodiac Note */}
        <tr>
          <td style={{ paddingBottom: '28px' }}>
            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              style={{
                backgroundColor: theme.paper,
                borderRadius: '10px',
                border: `1px solid ${theme.secondary}30`,
              }}
            >
              <tr>
                <td style={{ padding: '16px 20px' }}>
                  <p style={{
                    margin: '0 0 6px 0',
                    fontFamily: 'Georgia, serif',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: theme.accent,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    ☯ Your Zodiac Today
                  </p>
                  <p style={{
                    margin: 0,
                    fontFamily: 'Georgia, serif',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: theme.text,
                  }}>
                    {zodiacFortune}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        {/* CTA to Full Reading */}
        <tr>
          <td align="center" style={{ paddingBottom: '28px' }}>
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
                    href="https://mingdao.space/bazi"
                    style={{
                      display: 'inline-block',
                      padding: '12px 28px',
                      fontFamily: 'Georgia, serif',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#ffffff',
                      textDecoration: 'none',
                      borderRadius: '8px',
                    }}
                  >
                    Get Your Complete Reading →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        {/* Daily Wisdom */}
        <tr>
          <td align="center" style={{ paddingBottom: '28px' }}>
            <p style={{
              margin: 0,
              fontFamily: 'Georgia, serif',
              fontSize: '14px',
              lineHeight: '1.8',
              color: theme.textMuted,
              fontStyle: 'italic',
            }}>
              "The journey of a thousand miles begins with a single step."
            </p>
            <p style={{
              margin: '8px 0 0 0',
              fontFamily: 'Georgia, serif',
              fontSize: '13px',
              color: theme.textMuted,
            }}>
              千里之行，始于足下。
            </p>
          </td>
        </tr>

        {/* Unsubscribe */}
        <tr>
          <td align="center" style={{ paddingTop: '8px', borderTop: `1px solid ${theme.secondary}20` }}>
            <p style={{
              margin: 0,
              fontFamily: 'Georgia, serif',
              fontSize: '11px',
              color: theme.textMuted,
            }}>
              You are receiving this because you subscribed to Mingdao Daily Fortune.
            </p>
            <p style={{
              margin: '8px 0 0 0',
              fontFamily: 'Georgia, serif',
              fontSize: '11px',
            }}>
              <a
                href={unsubscribeUrl}
                style={{ color: theme.textMuted, textDecoration: 'underline' }}
              >
                Unsubscribe
              </a>
              {' · '}
              <a
                href="https://mingdao.space/settings/subscriptions"
                style={{ color: theme.textMuted, textDecoration: 'underline' }}
              >
                Manage Preferences
              </a>
            </p>
          </td>
        </tr>
      </table>
    </EmailLayout>
  )
}

export default DailyFortuneEmail
