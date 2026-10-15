import { test, expect, type Page } from "@playwright/test";

/**
 * Mobile containment - 320px.
 *
 * Why: chord-weaver had no e2e coverage at all, and its converter page was a
 * static mock-up until recently. A public page that overflows horizontally at
 * 320px silently crops controls (NF-UX: no cropped control, no overflow at
 * 320px). This spec is the guard for the whole surface, not just one page.
 */

const PAGES = ["/", "/editor", "/converter"];

test.describe("Mobile containment at 320px", () => {
  for (const route of PAGES) {
    test(`${route} does not overflow horizontally`, async ({ page }: { page: Page }) => {
      await page.setViewportSize({ width: 320, height: 720 });
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      if (response) expect(response.status(), `${route} should not 5xx`).toBeLessThan(500);
      await page.waitForLoadState("load");

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route} overflows horizontally by ${overflow}px at 320px`).toBeLessThanOrEqual(1);

      const cropped = await page.evaluate(() => {
        const width = window.innerWidth;
        return Array.from(document.querySelectorAll("a, button"))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && (r.left < -1 || r.right > width + 1);
          })
          .length;
      });
      expect(cropped, `${route} crops a control at 320px`).toBe(0);

      // WCAG 2.2 AA "Target Size (Minimum)": 24x24 CSS px, with the standard
      // exception for inline links inside a sentence (excluded here).
      const tooSmall = await page.evaluate(() => {
        const out: string[] = [];
        for (const el of Array.from(document.querySelectorAll("button, a, input, select"))) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          const inline = getComputedStyle(el).display === "inline" && el.tagName === "A";
          if (inline) continue;
          if (r.width < 24 || r.height < 24) {
            out.push(`${el.tagName.toLowerCase()}:${(el.textContent || "").trim().slice(0, 20)} ${Math.round(r.width)}x${Math.round(r.height)}`);
          }
        }
        return out;
      });
      expect(tooSmall, `${route} has controls below 24x24px: ${tooSmall.join(", ")}`).toEqual([]);
    });
  }
});
