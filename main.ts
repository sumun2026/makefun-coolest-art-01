// coolest-art-01 entry (Node 22, standard library only).
//
// The piece is "Breach", the entry.png beside this file: a colossal shark of black volcanic rock
// laced with magma, breaching out of black water. This program ships those exact bytes to
// $MAKEFUN_OUTPUT_DIR/entry.png (default /output) so the judge sees the image unchanged.
//
// No resizing, no re-encoding, no colour conversion: the file is copied byte for byte, so two runs
// write identical bytes and the sha256 of the output equals the sha256 of the art in the repo.
//
// Local run (MAKEFUN_OUTPUT_DIR stands in for /output outside the grader's container):
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1024 * 1024;
const SOURCE = fileURLToPath(new URL('./entry.png', import.meta.url));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const DESTINATION = join(OUTPUT_DIR, 'entry.png');

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(SOURCE, DESTINATION);

const bytes = statSync(DESTINATION).size;
if (bytes > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes} bytes, over the ${MAX_BYTES} byte gate`);
}

const magic = readFileSync(DESTINATION).subarray(0, 3);
const isPng = magic[0] === 0x89 && magic[1] === 0x50 && magic[2] === 0x4e;
const isJpeg = magic[0] === 0xff && magic[1] === 0xd8 && magic[2] === 0xff;
if (!isPng && !isJpeg) {
  throw new Error('entry.png is neither a PNG nor a JPEG by its first bytes');
}
