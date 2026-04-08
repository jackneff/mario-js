// Level data
export const levels = [
  // level 1
  {
    platforms: [
      { x: 0, y: 360, width: 400, height: 40, type: "floating" },
      { x: 500, y: 360, width: 300, height: 40, type: "floating" },
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
    mountains: [
      { x: -20,  width: 220, height: 160, color: "#8b5e3c", edgeColor: "#4a2810" },
      { x: 140,  width: 300, height: 240, color: "#8b5e3c", edgeColor: "#4a2810" },
      { x: 360,  width: 180, height: 130, color: "#8b5e3c", edgeColor: "#4a2810" },
      { x: 500,  width: 340, height: 270, color: "#8b5e3c", edgeColor: "#4a2810" },
      { x: 720,  width: 200, height: 180, color: "#8b5e3c", edgeColor: "#4a2810" },
    ],
  },
  // level 2
  {
    platforms: [
      { x: 0,   y: 360, width: 160, height: 40, type: "blue" },
      { x: 350, y: 360, width: 120, height: 40, type: "blue" },
      { x: 620, y: 360, width: 180, height: 40, type: "blue" },
      { x: 130, y: 310, width: 40,  height: 20, type: "blue" },
      { x: 240, y: 270, width: 40,  height: 20, type: "blue" },
      { x: 360, y: 230, width: 40,  height: 20, type: "blue" },
      { x: 470, y: 270, width: 40,  height: 20, type: "blue" },
      { x: 560, y: 220, width: 40,  height: 20, type: "blue" },
    ],
    enemies: [
      { x: 350, y: 344, type: "purple" },
      { x: 650, y: 344, type: "purple" },
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
    mountains: [
      { x: -60, width: 360, height: 280, color: "#7a3a0a", edgeColor: "#3d1a02" },
      { x: 220, width: 160, height: 120, color: "#7a3a0a", edgeColor: "#3d1a02" },
      { x: 340, width: 260, height: 200, color: "#7a3a0a", edgeColor: "#3d1a02" },
      { x: 530, width: 180, height: 140, color: "#7a3a0a", edgeColor: "#3d1a02" },
      { x: 650, width: 300, height: 230, color: "#7a3a0a", edgeColor: "#3d1a02" },
    ],
  },
  // level 3 - night scene
  {
    platforms: [
      { x: 0, y: 360, width: 150, height: 40, type: "floating" },
      { x: 250, y: 360, width: 150, height: 40, type: "floating" },
      { x: 500, y: 360, width: 300, height: 40, type: "floating" },
      { x: 100, y: 290, width: 80, height: 20, type: "floating" },
      { x: 280, y: 260, width: 60, height: 20, type: "floating" },
      { x: 420, y: 230, width: 60, height: 20, type: "floating" },
      { x: 560, y: 270, width: 80, height: 20, type: "floating" },
      { x: 680, y: 230, width: 80, height: 20, type: "floating" },
    ],
    enemies: [
      { x: 120, y: 344, type: "brown" },
      { x: 520, y: 344, type: "purple" },
      { x: 650, y: 344, type: "purple" },
      { x: 290, y: 244, type: "brown" },
      { x: 580, y: 254, type: "purple" },
    ],
    coins: [
      { x: 110, y: 230 },
      { x: 290, y: 200 },
      { x: 430, y: 170 },
      { x: 580, y: 210 },
      { x: 700, y: 170 },
      { x: 370, y: 300 },
    ],
    surpriseBlocks: [
      { x: 65, y: 180, type: "coin" },
      { x: 460, y: 150, type: "mushroom" },
      { x: 690, y: 150, type: "coin" },
    ],
    pipes: [{ x: 750, y: 320 }],
    mountains: [
      { x: 0,   width: 160, height: 120, color: "#111118", edgeColor: "#05050a" },
      { x: 100, width: 380, height: 300, color: "#111118", edgeColor: "#05050a" },
      { x: 420, width: 200, height: 150, color: "#111118", edgeColor: "#05050a" },
      { x: 560, width: 320, height: 250, color: "#111118", edgeColor: "#05050a" },
    ],
    stars: [
      { x: 40, y: 20 }, { x: 90, y: 45 }, { x: 150, y: 15 },
      { x: 210, y: 55 }, { x: 270, y: 25 }, { x: 330, y: 50 },
      { x: 390, y: 10 }, { x: 450, y: 40 }, { x: 510, y: 20 },
      { x: 570, y: 55 }, { x: 630, y: 30 }, { x: 690, y: 15 },
      { x: 750, y: 45 }, { x: 70, y: 80 }, { x: 180, y: 90 },
      { x: 310, y: 75 }, { x: 440, y: 95 }, { x: 600, y: 80 },
      { x: 720, y: 70 }, { x: 130, y: 110 }, { x: 480, y: 115 },
    ],
    moon: { x: 620, y: 30 },
  },
];
