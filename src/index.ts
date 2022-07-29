/**
 *
 *  One Uint32Array consists of following bits
 *
 *  0000 0000 (y:0, x:0-7)
 *  0000 0000 (y:1, x:0-7)
 *  0000 0000
 *  0000 0000
 */

type Coordinate = {
  x: number;
  y: number;
};

type Line = {
  start: Coordinate;
  end: Coordinate;
};

type Box = {
  start: Coordinate;
  end: Coordinate;
};

export const createBitmap = (width: number, height: number) => {
  const horizontalBlockCount = Math.ceil(width / 8);
  const verticalBlockCount = (height >> 2) + 1;

  const bitBuffer = new Uint32Array(horizontalBlockCount * verticalBlockCount);

  bitBuffer.fill(0);

  const getIndex = (point: Coordinate) =>
    (point.y >> 2) * horizontalBlockCount + (point.x >> 3);

  const obj = {
    getArea: () => bitBuffer,
    clear: () => bitBuffer.fill(0),
    getBitString: () => {
      const lines: string[] = [];
      for (let j = 0; j < height; j++) {
        const offset = 24 - (j & 0b11) * 8;
        const blockOffset = (j >> 2) * horizontalBlockCount;
        let line: string[] = [];
        for (let i = 0; i < horizontalBlockCount; i++) {
          line.push(
            (0xff & (bitBuffer[blockOffset + i] >> offset))
              .toString(2)
              .padStart(8, "0")
          );
        }
        lines.push(line.join(""));
      }
      return lines;
    },

    addPoint: (coord: Coordinate) => {
      obj.drawRectangle({ start: coord, end: coord });
    },

    isCoordinateAtEmptyBlock: (coord: Coordinate) => {
      return bitBuffer[getIndex(coord)] === 0;
    },

    validateBox: (inputLine: Box): Box | undefined => {
      const line = {
        start: { ...inputLine.start },
        end: { ...inputLine.end },
      };

      if (line.end.x < 0) return;
      if (line.end.y < 0) return;

      if (line.start.x >= width) return;
      if (line.start.y >= height) return;

      if (line.start.x < 0) line.start.x = 0;
      if (line.start.y < 0) line.start.y = 0;

      if (line.end.x >= width) line.end.x = width - 1;
      if (line.end.y >= height) line.end.y = height - 1;
      return line;
    },

    hasCollision: (input: Box) => {
      const box = obj.validateBox(input);
      if (!box) return;
      return !!obj.forRectangle(box, (idx, mask) => {
        return (bitBuffer[idx] & mask) !== 0;
      });
    },

    forRectangle: (
      box: Box,
      fn: (index: number, mask: number) => boolean | undefined
    ) => {
      const line = box;
      const y = line.start.y;
      const startIdx = getIndex({ x: line.start.x, y: 0 });
      const endIdx = getIndex({ x: line.end.x, y: 0 });
      for (let xx = startIdx; xx <= endIdx; xx++) {
        let mask = 0b1111_1111;
        if (xx === startIdx) {
          mask &= 0b1111_1111 >> (line.start.x & 0b111);
        }
        if (xx === endIdx) {
          const mask2 = (0b1111_1111_1000_0000 >> (line.end.x & 0b111)) & 0xff;
          mask &= mask2;
        }
        const startYIdx = getIndex({ x: xx << 3, y });
        const endYIdx = getIndex({ x: xx << 3, y: line.end.y });
        let blockMask = mask | (mask << 8) | (mask << 16) | (mask << 24);
        for (let idx = startYIdx; idx <= endYIdx; idx += horizontalBlockCount) {
          let clearMask = 0xffffffff;
          if (idx === startYIdx) {
            const bits = line.start.y & 0b11;
            if (bits === 1) {
              clearMask &= 0x00ffffff;
            }
            if (bits === 2) {
              clearMask &= 0x0000ffff;
            }
            if (bits === 3) {
              clearMask &= 0x000000ff;
            }
          }
          if (idx === endYIdx) {
            const endy = line.end.y & 0b11;
            if (endy === 0) {
              clearMask &= 0xff000000;
            }
            if (endy === 1) {
              clearMask &= 0xffff0000;
            }
            if (endy === 2) {
              clearMask &= 0xffffff00;
            }
            if (endy === 3) {
              clearMask &= 0xffffffff;
            }
          }
          const abort = fn(idx, clearMask & blockMask);
          if (abort) {
            return abort;
          }
        }
      }
    },

    drawRectangle: (inputLine: Box) => {
      const line = obj.validateBox(inputLine);
      if (!line) return;
      obj.forRectangle(line, (idx, mask) => {
        bitBuffer[idx] |= mask;
        return false;
      });
    },
  };
  return obj;
};
