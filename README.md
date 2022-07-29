# Collision Mask

1. Allocate buffer with dimensions `width` x `height`
2. Draw rectangles using `drawRectangle` into buffer
3. Hit test rectangle in the buffer

```
[
  '0000000000000000',
  '0100000000000000',
  '0000000000000000',
  '0000000000000000',
  '0000000000000000',
  '0000000001110000',
  '0000000001110000',
  '0000000001110000'
]
```

```typescript
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
```
