declare module 'html-pdf-node' {
  export interface HtmlToPdfOptions {
    format?: 'A4' | 'Letter' | 'Legal' | 'Tabloid' | 'Ledger';
    margin?: {
      top?: string | number;
      right?: string | number;
      bottom?: string | number;
      left?: string | number;
    };
    printBackground?: boolean;
    path?: string;
  }

  export interface HtmlToPdfFile {
    content: string;
    url?: string;
  }

  export function generatePdf(file: HtmlToPdfFile, options?: HtmlToPdfOptions): Promise<Buffer>;
}
