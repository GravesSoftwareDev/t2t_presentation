/* =====================================================================
   Generic QR code generator.

   The actual QR encoding (turning text or a URL into that grid of black
   and white squares, with built-in error correction so a smudged or angled
   phone camera can still read it) is handled by the qrcode-generator
   library, loaded from cdnjs in index.html. That library exposes one
   global function, qrcode(), which this file calls.

   Usage:
     renderQR('my-container-id', 'https://example.com');
     renderQR('my-container-id', 'Any text', { errorCorrection:'H', cellSize:6, margin:4 });
   ===================================================================== */

function renderQR(containerId, data, options){
  const container = document.getElementById(containerId);
  if(!container) return;

  const opts = Object.assign({
    // Error correction level (L/M/Q/H, low to high). "M" rebuilds around
    // roughly 15% damage or obstruction, a good default for something
    // scanned off a screen from across a room.
    errorCorrection: 'M',
    // How many pixels wide each little QR square is.
    cellSize: 4,
    // The plain white border (in cells) scanners need to lock on.
    margin: 2
  }, options);

  // Type 0 lets the library pick the smallest QR grid that fits the data.
  const qr = qrcode(0, opts.errorCorrection);
  qr.addData(String(data));
  qr.make();

  container.innerHTML = qr.createSvgTag(opts.cellSize, opts.margin);
}
