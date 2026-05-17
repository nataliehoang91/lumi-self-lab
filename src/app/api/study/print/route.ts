import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

// On Vercel, chromium downloads a minimal binary at runtime from a CDN.
// Locally it uses the system Chrome.
const CHROMIUM_REMOTE_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const url = searchParams.get("url");
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  // Only allow printing pages on this same origin
  const origin = new URL(req.url).origin;
  if (!url.startsWith(origin)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let browser;
  try {
    const isLocal = process.env.NODE_ENV === "development";

    browser = await puppeteer.launch({
      args: isLocal ? [] : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: isLocal
        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        : await chromium.executablePath(CHROMIUM_REMOTE_URL),
      headless: true,
    });

    const page = await browser.newPage();

    // Forward the session cookie so the page renders as the signed-in user
    const cookie = req.headers.get("cookie") ?? "";
    if (cookie) {
      const parsed = cookie.split(";").map((c) => {
        const [name, ...rest] = c.trim().split("=");
        return { name: name.trim(), value: rest.join("="), url };
      });
      await page.setCookie(...parsed);
    }

    await page.goto(url, { waitUntil: "networkidle0", timeout: 30_000 });

    // Hide navbar, interactive controls for print
    await page.addStyleTag({
      content: `
        nav, [data-hide-print] { display: none !important; }
        body { padding-top: 0 !important; }
      `,
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "16mm", bottom: "20mm", left: "16mm" },
    });

    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="study-list.pdf"`,
      },
    });
  } catch (err) {
    await browser?.close();
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
