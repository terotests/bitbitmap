import { expect } from "chai";
import { createBitmap } from "../src/index";

describe("Test simple bitmap", () => {
  it("Simple 1x1 pixel test", () => {
    const bitmap = createBitmap(16, 8);
    bitmap.drawRectangle({
      start: { x: 1, y: 1 },
      end: { x: 1, y: 1 },
    });
    console.log(bitmap.getBitString());

    expect(bitmap.getBitString()).to.deep.equal([
      "0000000000000000",
      "0100000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ]);
  });
  it("Simple 8x8 bitmap test", () => {
    const bitmap = createBitmap(16, 8);
    bitmap.drawRectangle({
      start: { x: 1, y: 1 },
      end: { x: 4, y: 3 },
    });

    bitmap.drawRectangle({
      start: { x: 6, y: 2 },
      end: { x: 7, y: 3 },
    });

    bitmap.drawRectangle({
      start: { x: 9, y: 2 },
      end: { x: 11, y: 6 },
    });

    console.log(bitmap.getBitString());

    expect(bitmap.getBitString()).to.deep.equal([
      "0000000000000000",
      "0111100000000000",
      "0111101101110000",
      "0111101101110000",
      "0000000001110000",
      "0000000001110000",
      "0000000001110000",
      "0000000000000000",
    ]);
  });

  it("Full bitmap test", () => {
    const bitmap = createBitmap(8, 8);
    bitmap.drawRectangle({
      start: { x: 0, y: 0 },
      end: { x: 7, y: 7 },
    });
    console.log(bitmap.getBitString());
    expect(bitmap.getBitString()).to.deep.equal([
      "11111111",
      "11111111",
      "11111111",
      "11111111",
      //
      "11111111",
      "11111111",
      "11111111",
      "11111111",
    ]);
  });

  it("Test overflow", () => {
    const bitmap = createBitmap(8, 8);
    bitmap.drawRectangle({
      start: { x: -110, y: -3330 },
      end: { x: 1117, y: 7222 },
    });
    console.log(bitmap.getBitString());
    expect(bitmap.getBitString()).to.deep.equal([
      "11111111",
      "11111111",
      "11111111",
      "11111111",
      //
      "11111111",
      "11111111",
      "11111111",
      "11111111",
    ]);

    expect(
      bitmap.hasCollision({
        start: { x: 1, y: 1 },
        end: { x: 1, y: 1 },
      })
    ).to.be.true;
  });

  it("Test Drawing outside of the bitmap", () => {
    const bitmap = createBitmap(16, 8);
    bitmap.drawRectangle({
      start: { x: 111, y: 1 },
      end: { x: 3331, y: 1 },
    });

    bitmap.drawRectangle({
      start: { x: 1, y: -2 },
      end: { x: 1, y: -4 },
    });

    bitmap.drawRectangle({
      start: { x: -1, y: 2 },
      end: { x: -1, y: 4 },
    });

    console.log(bitmap.getBitString());

    expect(bitmap.getBitString()).to.deep.equal([
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ]);

    expect(
      bitmap.hasCollision({
        start: { x: 1, y: 1 },
        end: { x: 1, y: 1 },
      })
    ).to.be.false;
  });

  it("Test is block empty", () => {
    const bitmap = createBitmap(16, 8);
    bitmap.drawRectangle({
      start: { x: 1, y: 1 },
      end: { x: 1, y: 1 },
    });

    bitmap.drawRectangle({
      start: { x: 9, y: 5 },
      end: { x: 11, y: 7 },
    });

    /*
    bitmap.drawRectangle({
      start: { x: 9, y: 2 },
      end: { x: 11, y: 6 },
    });
    */

    console.log(bitmap.getBitString());

    expect(bitmap.isCoordinateAtEmptyBlock({ x: 0, y: 0 })).to.be.false;
    expect(bitmap.isCoordinateAtEmptyBlock({ x: 8, y: 0 })).to.be.true;
    expect(bitmap.isCoordinateAtEmptyBlock({ x: 3, y: 5 })).to.be.true;
    expect(bitmap.isCoordinateAtEmptyBlock({ x: 9, y: 5 })).to.be.false;
  });

  it("Test Collisions", () => {
    const bitmap = createBitmap(16, 8);
    bitmap.drawRectangle({
      start: { x: 1, y: 1 },
      end: { x: 1, y: 1 },
    });

    bitmap.drawRectangle({
      start: { x: 9, y: 5 },
      end: { x: 11, y: 7 },
    });

    console.log(bitmap.getBitString());

    expect(
      bitmap.hasCollision({
        start: { x: 1, y: 1 },
        end: { x: 1, y: 1 },
      })
    ).to.be.true;
    expect(
      bitmap.hasCollision({
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
      })
    ).to.be.false;

    expect(
      bitmap.hasCollision({
        start: { x: 0, y: 0 },
        end: { x: 10, y: 10 },
      })
    ).to.be.true;
  });
});
