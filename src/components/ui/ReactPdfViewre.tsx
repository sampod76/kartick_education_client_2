// PDFViewer.tsx
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Fix for PDF.js worker in Next.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ReactPdfViewer = ({ url }: { url: string }) => {
  console.log('🚀 ~ ReactPdfViewer ~ url:', url);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  return (
    <div className="p-4">
      <Document
        file={{
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        }}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.error('PDF load error', error.message)}
        onSourceError={(error) => console.error('PDF source error', error.message)}
      >
        <Page pageNumber={pageNumber} />
      </Document>

      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber <= 1}
        >
          Prev
        </button>
        <span>
          Page {pageNumber} of {numPages}
        </span>
        <button
          onClick={() =>
            setPageNumber((prev) => (numPages ? Math.min(prev + 1, numPages) : prev))
          }
          disabled={numPages !== null && pageNumber >= numPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReactPdfViewer;
