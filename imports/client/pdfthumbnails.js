import pdfjs from 'pdfjs-dist';

// "pages": doc.pdfInfo.numPages
// canvas remove
function mock ( ) {
    const viewport = page.getViewport(0.5);

    const canvas = document.createElement('canvas');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const ctx = canvas.getContext('2d');

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
}

export default function ( file , renderContext , page=1) {

  // A Promise
  return pdfjs.getDocument( file )
    .then( doc => doc.getPage(page) )
    .then( page => page.render(renderContext) )

}
