// playwright is an optional dep for server-side PDF generation
// This declaration prevents tsc errors when the package isn't installed
declare module "playwright" {
  export const chromium: {
    launch(): Promise<{
      newPage(): Promise<{
        setContent(html: string, opts?: { waitUntil?: string }): Promise<void>;
        pdf(opts?: { format?: string }): Promise<Buffer>;
        close(): Promise<void>;
      }>;
      close(): Promise<void>;
    }>;
  };
}