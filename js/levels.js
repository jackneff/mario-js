// Level data
export const levels = [
  // level 1
  {
    platforms: [
      { x: 0, y: 360, width: 400, height: 40, type: "ground" },
      { x: 500, y: 360, width: 300, height: 40, type: "ground" },
      { x: 200, y: 280, width: 60, height: 20, type: "floating" },
      { x: 300, y: 240, width: 60, height: 20, type: "floating" },
      { x: 600, y: 280, width: 80, height: 20, type: "floating" },
    ],
    enemies: [
      { x: 250, y: 344, type: "brown" },
      { x: 550, y: 344, type: "brown" },
    ],
    coins: [
      { x: 220, y: 220 },
      { x: 620, y: 220 },
    ],
    surpriseBlocks: [{ x: 320, y: 120, type: "mushroom" }],
    pipes: [{ x: 750, y: 320 }],
    clouds: [
      { x: 100, y: 80 },
      { x: 300, y: 50 },
      { x: 500, y: 100 },
      { x: 700, y: 60 },
    ],
  },
  // level 2
  {
    platforms: [
      { x: 0, y: 360, width: 200, height: 40, type: "blue" },
      { x: 300, y: 360, width: 200, height: 40, type: "blue" },
      { x: 600, y: 360, width: 200, height: 40, type: "blue" },
      { x: 150, y: 300, width: 40, height: 20, type: "blue" },
      { x: 250, y: 280, width: 40, height: 20, type: "blue" },
      { x: 350, y: 260, width: 40, height: 20, type: "blue" },
      { x: 450, y: 240, width: 40, height: 20, type: "blue" },
      { x: 550, y: 280, width: 60, height: 20, type: "blue" },
    ],
    enemies: [
      { x: 350, y: 344, type: "purple" },
      { x: 650, y: 344, type: "purple" },
      { x: 570, y: 264, type: "purple" },
    ],
    coins: [
      { x: 170, y: 240 },
      { x: 270, y: 220 },
      { x: 370, y: 200 },
      { x: 470, y: 180 },
      { x: 570, y: 220 },
    ],
    surpriseBlocks: [
      { x: 90, y: 200, type: "coin" },
      { x: 400, y: 160, type: "mushroom" },
    ],
    pipes: [{ x: 750, y: 320 }],
    clouds: [
      { x: 80, y: 60 },
      { x: 250, y: 100 },
      { x: 420, y: 70 },
      { x: 600, y: 90 },
    ],
  },
];
