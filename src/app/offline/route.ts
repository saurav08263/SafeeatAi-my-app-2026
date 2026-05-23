import { NextResponse } from 'next/server'

export function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0a1f0e" />
  <title>SafeEat AI - Offline</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a1f0e;
      color: #e8f5e9;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
    }
    .icon { font-size: 64px; margin-bottom: 24px; }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
    p { font-size: 15px; color: #a5d6a7; max-width: 300px; line-height: 1.5; margin-bottom: 24px; }
    button {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: #0a1f0e;
      border: none;
      padding: 12px 32px;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    button:active { opacity: 0.85; transform: scale(0.97); }
  </style>
</head>
<body>
  <div class="icon">📡</div>
  <h1>You're Offline</h1>
  <p>No internet connection. SafeEat AI needs connectivity to analyze food and provide safety reports.</p>
  <button onclick="window.location.reload()">Try Again</button>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
