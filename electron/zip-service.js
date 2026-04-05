const JSZip = require("jszip");

/**
 * Generates a ZIP archive from an array of files.
 * @param {Array<{name: string, content: Buffer, folder?: string}>} files 
 * @returns {Promise<Buffer>}
 */
async function generateZip(files) {
  const zip = new JSZip();

  for (const file of files) {
    if (file.folder) {
      zip.folder(file.folder).file(file.name, file.content);
    } else {
      zip.file(file.name, file.content);
    }
  }

  // Generate nodebuffer (returns a Buffer object)
  return await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 }
  });
}

module.exports = { generateZip };
