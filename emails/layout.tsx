/**
 * Email Layout - 邮件基础布局
 * 
 * Features:
 * - Diagonal dual background (古籍书封风格) - 左上星宿 + 右下四象
 * - Three-layer fallback: solid color → CSS gradient → VML (Outlook)
 * - Seasonal theme support
 * - Responsive design
 * - Header + Footer components
 */

import { seasonThemes, type SeasonTheme, getCurrentSeasonTheme, getDailyMansionForEmail } from './theme'
import { EmailHeader } from './components/email-header'
import { EmailFooter } from './components/email-footer'

interface EmailLayoutProps {
  children: React.ReactNode
  season?: SeasonTheme
  previewText?: string
  showMansionInfo?: boolean
}

export function EmailLayout({
  children,
  season = getCurrentSeasonTheme(),
  previewText = '',
  showMansionInfo = true,
}: EmailLayoutProps) {
  const theme = seasonThemes[season]
  const mansion = getDailyMansionForEmail()

  return (
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>Mingdao - Light Your Path</title>
        
        {/* Outlook VML background setup */}
        {/*[if mso]>
        <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
        </noscript>
        <![endif]*/}

        <style dangerouslySetInnerHTML={{ __html: `
          /* Reset styles */
          body { margin: 0; padding: 0; background-color: ${theme.background}; }
          table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
          img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
          p { margin: 0; }
          
          /* Typography */
          body, table, td, p, a, li, blockquote { 
            -webkit-text-size-adjust: 100%; 
            -ms-text-size-adjust: 100%;
            font-family: Georgia, 'Times New Roman', serif;
          }
          
          /* Outlook specific fixes */
          .ExternalClass { width: 100%; }
          .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font,
          .ExternalClass td, .ExternalClass div {
            line-height: 100%;
          }
          
          /* Responsive */
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .mobile-padding { padding: 20px !important; }
            .mobile-text-center { text-align: center !important; }
            .stack-column { display: block !important; width: 100% !important; }
          }
          
          /* Link styles */
          a { color: ${theme.accent}; text-decoration: underline; }
          a:hover { text-decoration: none; }
        `}} />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: theme.background }}>
        {/* Preview text */}
        <div
          style={{
            display: 'none',
            maxHeight: 0,
            maxWidth: 0,
            opacity: 0,
            overflow: 'hidden, mso-hide: all',
          }}
        >
          {previewText}
          {/* Spacing to prevent preview text from showing body content */}
          {'\u00A0\u200C\u00A0\u200C\u00A0\u200C\u00A0\u200C\u00A0\u200C'.repeat(20)}
        </div>

        {/* 
          OUTER WRAPPER with Diagonal Dual Background
          
          Three-layer fallback:
          1. Solid background color (on body)
          2. CSS gradient with clip-path for diagonal split (modern clients)
          3. VML background for Outlook
        */}
        <table
          role="presentation"
          cellPadding="0"
          cellSpacing="0"
          border={0}
          width="100%"
          style={{ backgroundColor: theme.background }}
        >
          <tr>
            <td align="center" valign="top">
              {/*[if mso]>
              <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                <v:fill type="tile" src="" color="${theme.background}"/>
              </v:background>
              <![endif]*/}

              {/* Main content area */}
              <table
                role="presentation"
                cellPadding="0"
                cellSpacing="0"
                border={0}
                width="600"
                className="container"
                style={{ width: '600px', maxWidth: '600px' }}
              >
                {/* Top spacer with constellation pattern */}
                <tr>
                  <td
                    height="60"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
                      opacity: 0.08,
                      clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                    }}
                  >
                    {/* Diagonal top-left triangle (constellation area) */}
                  </td>
                </tr>

                {/* Header */}
                <tr>
                  <td>
                    <EmailHeader season={season} />
                  </td>
                </tr>

                {/* Main content card */}
                <tr>
                  <td
                    className="mobile-padding"
                    style={{
                      padding: '32px 48px',
                      backgroundColor: theme.paper,
                      borderLeft: `1px solid ${theme.secondary}40`,
                      borderRight: `1px solid ${theme.secondary}40`,
                    }}
                  >
                    {/* Daily mansion badge */}
                    {showMansionInfo && (
                      <table role="presentation" cellPadding="0" cellSpacing="0" border={0} width="100%" style={{ marginBottom: '24px' }}>
                        <tr>
                          <td align="center">
                            <span style={{
                              display: 'inline-block',
                              padding: '6px 16px',
                              backgroundColor: `${theme.accent}10`,
                              borderRadius: '9999px',
                              fontSize: '12px',
                              color: theme.accent,
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                            }}>
                              ★ {mansion.name} Mansion · {mansion.meaning}
                            </span>
                          </td>
                        </tr>
                      </table>
                    )}

                    {/* Email body content */}
                    {children}
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td>
                    <EmailFooter season={season} />
                  </td>
                </tr>

                {/* Bottom spacer with symbol pattern */}
                <tr>
                  <td
                    height="60"
                    style={{
                      background: `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.background} 100%)`,
                      opacity: 0.06,
                      clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                    }}
                  >
                    {/* Diagonal bottom-right triangle (symbol area) */}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}
