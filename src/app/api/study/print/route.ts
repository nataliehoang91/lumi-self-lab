import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

const CHROMIUM_REMOTE_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const url = searchParams.get("url");
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  const origin = new URL(req.url).origin;
  if (!url.startsWith(origin)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let browser;
  try {
    const isLocal = process.env.NODE_ENV === "development";

    browser = await puppeteer.launch({
      args: isLocal ? [] : chromium.args,
      executablePath: isLocal
        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        : await chromium.executablePath(CHROMIUM_REMOTE_URL),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 900 });

    const cookie = req.headers.get("cookie") ?? "";
    if (cookie) {
      const parsed = cookie.split(";").flatMap((c) => {
        const [name, ...rest] = c.trim().split("=");
        const n = name?.trim();
        if (!n) return [];
        return [{ name: n, value: rest.join("="), url }];
      });
      if (parsed.length) await page.setCookie(...parsed);
    }

    await page.goto(url, { waitUntil: "networkidle0", timeout: 30_000 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: false,
      margin: { top: "15mm", right: "15mm", bottom: "15mm", left: "15mm" },
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="study-list.pdf"`,
      },
    });
  } catch (err) {
    await browser?.close();
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
