import Phaser from "phaser";
import "./styles.css";

const coverBackgroundUrl = new URL("../pic/cover/cover.png", import.meta.url).href;
const chapterBackgroundUrl = new URL("../pic/cover/chapter_background.png", import.meta.url).href;
const gaokaoBackgroundUrl = new URL("../pic/chapter_campus_life/gaokao.png", import.meta.url).href;
const clockTowerBackgroundUrl = new URL("../pic/chapter_campus_life/Clock_tower.png", import.meta.url).href;
const lostBackgroundUrl = new URL("../pic/chapter_lost/background.png", import.meta.url).href;
const lostCharacterUrl = new URL("../pic/chapter_lost/character.png", import.meta.url).href;
const lostBookUrl = new URL("../pic/chapter_lost/book.png", import.meta.url).href;
const lostGameControlUrl = new URL("../pic/chapter_lost/game_control.png", import.meta.url).href;
const lostPhoneUrl = new URL("../pic/chapter_lost/phone.png", import.meta.url).href;
const lostSleepyAirUrl = new URL("../pic/chapter_lost/sleepy_air.png", import.meta.url).href;
const lostTakeoutUrl = new URL("../pic/chapter_lost/takeout.png", import.meta.url).href;
const lostWalletUrl = new URL("../pic/chapter_lost/wallet.png", import.meta.url).href;
const herChattingUrl = new URL("../pic/chapter_her/chatting.png", import.meta.url).href;
const herLiveRoomUrl = new URL("../pic/chapter_her/live_room.png", import.meta.url).href;
const herMorningChatUrl = new URL("../pic/chapter_her/morning_chat.png", import.meta.url).href;
const herWalkingChatUrl = new URL("../pic/chapter_her/walkingchat.png", import.meta.url).href;
const herEatingChatUrl = new URL("../pic/chapter_her/eatting_chat.png", import.meta.url).href;
const herLaborChatUrl = new URL("../pic/chapter_her/labor_chat.png", import.meta.url).href;
const herBusChatUrl = new URL("../pic/chapter_her/bus_chat.png", import.meta.url).href;
const herSleepChatUrl = new URL("../pic/chapter_her/sleep chat.png", import.meta.url).href;
const herFirstMeetUrl = new URL("../pic/chapter_her/first_meet.png", import.meta.url).href;
const herUmbrellaUrl = new URL("../pic/chapter_her/umbrella.png", import.meta.url).href;
const herMuseumUrl = new URL("../pic/chapter_her/museum.png", import.meta.url).href;
const herSubwayUrl = new URL("../pic/chapter_her/subway.png", import.meta.url).href;
const herMealUrl = new URL("../pic/chapter_her/meal.png", import.meta.url).href;
const herBoatUrl = new URL("../pic/chapter_her/boat.png", import.meta.url).href;
const herLyingBedUrl = new URL("../pic/chapter_her/lying bed.png", import.meta.url).href;
const herFetchPicUrl = new URL("../pic/chapter_her/fetch_pic.png", import.meta.url).href;
const herFinalPicUrl = new URL("../pic/chapter_her/final_pic.png", import.meta.url).href;
const backgroundTrackPath = "audio/a-town-with-an-ocean-view.mp3";
const clockBellTrackPath = "audio/Church%20Bell%20Ringing%20%5B-6qZ9A6GFik%5D.mp3";
const GAME_WIDTH = 844;
const GAME_HEIGHT = 390;
const PLAYER_SPEED = 165;
let backgroundMusic;

const gaokaoSceneAssets = [
  { key: "gaokao-background", url: gaokaoBackgroundUrl },
  { key: "clock-tower-background", url: clockTowerBackgroundUrl },
];

const lostSceneAssets = [
  { key: "lost-background", url: lostBackgroundUrl },
  { key: "lost-character", url: lostCharacterUrl },
  { key: "lost-book", url: lostBookUrl },
  { key: "lost-game-control", url: lostGameControlUrl },
  { key: "lost-phone", url: lostPhoneUrl },
  { key: "lost-sleepy-air", url: lostSleepyAirUrl },
  { key: "lost-takeout", url: lostTakeoutUrl },
  { key: "lost-wallet", url: lostWalletUrl },
];

const finalOnlineAssets = [
  { key: "her-chatting-background", url: herChattingUrl },
  { key: "her-live-room", url: herLiveRoomUrl },
];

const finalMemoryAssets = [
  { key: "her-memory-morning", url: herMorningChatUrl },
  { key: "her-memory-walking", url: herWalkingChatUrl },
  { key: "her-memory-eating", url: herEatingChatUrl },
  { key: "her-memory-labor", url: herLaborChatUrl },
  { key: "her-memory-bus", url: herBusChatUrl },
  { key: "her-memory-sleep", url: herSleepChatUrl },
];

const finalMeetAssets = [
  { key: "her-meet-first", url: herFirstMeetUrl },
  { key: "her-meet-umbrella", url: herUmbrellaUrl },
  { key: "her-meet-museum", url: herMuseumUrl },
  { key: "her-meet-subway", url: herSubwayUrl },
  { key: "her-meet-meal", url: herMealUrl },
  { key: "her-meet-boat", url: herBoatUrl },
  { key: "her-meet-lying-bed", url: herLyingBedUrl },
];

const finalEndingAssets = [
  { key: "her-fetch-pic", url: herFetchPicUrl },
  { key: "her-final-pic", url: herFinalPicUrl },
];

function loadSceneAssets(scene, assets, onLoaded) {
  const missing = assets.filter((asset) => !scene.textures.exists(asset.key));
  if (missing.length === 0) {
    onLoaded();
    return;
  }

  const failed = new Set();
  const failHandler = (file) => failed.add(file.key);
  scene.load.on("loaderror", failHandler);
  missing.forEach((asset) => scene.load.image(asset.key, asset.url));
  scene.load.once("complete", () => {
    scene.load.off("loaderror", failHandler);
    failed.forEach((key) => createFallbackAssetTexture(scene, key));
    onLoaded();
  });
  scene.load.start();
}

function createFallbackAssetTexture(scene, key) {
  if (scene.textures.exists(key)) return;
  const g = freshGraphics(scene);
  if (key.includes("background") || key.includes("gaokao") || key.includes("clock")) {
    g.fillStyle(0x16242c, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.fillStyle(0x2f4f5a, 1);
    g.fillRect(0, GAME_HEIGHT * 0.62, GAME_WIDTH, GAME_HEIGHT * 0.38);
    g.fillStyle(0xf4d77d, 0.24);
    g.fillRect(0, 116, GAME_WIDTH, 4);
    g.generateTexture(key, GAME_WIDTH, GAME_HEIGHT);
  } else {
    g.fillStyle(0xffe79b, 0.24);
    g.fillCircle(48, 48, 42);
    g.fillStyle(0xf4d77d, 0.95);
    g.fillRect(22, 22, 52, 52);
    g.fillStyle(0x17232a, 1);
    g.fillRect(34, 40, 28, 8);
    g.fillRect(40, 52, 16, 8);
    g.generateTexture(key, 96, 96);
  }
  g.destroy();
}

const childhoodItems = [
  {
    texture: "item-toy-plane",
    x: 132,
    y: 234,
    title: "木头小飞机",
    text: "那时一架小飞机，就能装下整个天空。",
  },
  {
    texture: "item-kite",
    x: 416,
    y: 116,
    title: "纸风筝",
    text: "风一吹，就以为自己也能飞到很远的地方。",
  },
  {
    texture: "item-marbles",
    x: 312,
    y: 306,
    title: "玻璃弹珠",
    text: "小小一颗弹珠，藏着彩色的宇宙。",
  },
  {
    texture: "item-toy-car",
    x: 556,
    y: 198,
    title: "铁皮小汽车",
    text: "推着它跑过泥路，就像开过全世界。",
  },
  {
    texture: "item-gamepad",
    x: 710,
    y: 306,
    title: "掌机游戏",
    text: "屏幕很小，快乐却亮得很久。",
  },
];

const chapterOneCompleteText =
  "那些小小的东西，\n曾经撑起过他整个世界。\n\n后来世界变大了，\n他却常常忘记，\n自己也曾这样快乐过。";
const CAMPUS_WORLD_WIDTH = 2200;
const CAMPUS_GROUND_Y = 306;
const CAMPUS_RUN_SPEED = 164;
const CAMPUS_JUMP_SPEED = -475;
const CAMPUS_GRAVITY = 1050;

const campusFragments = [
  {
    texture: "fragment-homework",
    x: 246,
    y: 252,
    title: "作业本",
    text: "歪歪扭扭的字，也是在认真长大的证明。",
  },
  {
    texture: "fragment-desk",
    x: 636,
    y: 248,
    title: "小课桌",
    text: "桌面不大，却放得下很多奇奇怪怪的梦。",
  },
  {
    texture: "fragment-basketball",
    x: 928,
    y: 252,
    title: "篮球",
    text: "操场上的风，总让人觉得自己可以跑得更远。",
  },
  {
    texture: "fragment-classmate",
    x: 1306,
    y: 248,
    title: "同学",
    text: "身边的人来来往往，青春开始有了热闹的声音。",
  },
  {
    texture: "fragment-blackboard",
    x: 1618,
    y: 250,
    title: "黑板",
    text: "粉笔灰落下来，很多答案还没有被写清楚。",
  },
];

const campusHurdles = [
  { x: 500, height: 42, width: 46 },
  { x: 760, height: 48, width: 48 },
  { x: 1160, height: 46, width: 46 },
  { x: 1500, height: 48, width: 46 },
  { x: 1780, height: 52, width: 48 },
];

const campusGates = [
  {
    label: "幼儿园",
    x: 360,
    color: 0xff8b72,
    playerTexture: "campus-kindergarten-boy",
    message: "幼儿园：世界变成彩色积木和午睡铃声。",
  },
  {
    label: "小学",
    x: 1020,
    color: 0x6cb6d8,
    playerTexture: "campus-primary-boy",
    message: "小学：书包变重了，好奇心也更大了。",
  },
  {
    label: "初中",
    x: 1700,
    color: 0x8d7ad8,
    playerTexture: "campus-middle-boy",
    message: "初中：男孩戴上眼镜，也开始看见心里微小的光。",
  },
];

const chapterTwoCompleteText =
  "他穿过小学、初中和高中。\n收集过成长，也躲过刺痛。\n\n有些路是自己选的，\n有些路只是大家都说必须走。\n\n钟声响起时，\n所有人都说他自由了。";
const TOTAL_CHAPTERS = 4;
const chapterProgressData = {
  1: {
    title: "The boy",
    enter: "世界很小，快乐很亮。先去把那些闪闪发亮的童年记忆找回来。",
    complete: chapterOneCompleteText,
  },
  2: {
    title: "Campus life",
    enter: "后来，他背上书包。世界突然变大了，可快乐好像也不再只是快乐本身。",
    complete: chapterTwoCompleteText,
  },
  3: {
    title: "Lost",
    enter: "钟声响起的时候，所有人都说他自由了。可他还不知道，自由也会让人迷路。",
    complete: "他没有输给谁。\n只是差一点，\n在没有人管的自由里弄丢了自己。\n\n幸好某一天，\n他又愿意重新开始练习表达。",
  },
  4: {
    title: "Her, Beyond the Distance",
    enter: "研究生生活很累。可他还是一次次打开英语连麦直播间，练习表达，也练习靠近。",
    complete: "后来他终于明白，\n相遇不是把人生变简单。\n\n而是当世界依旧复杂的时候，\n有一个人，\n让他愿意继续往前走。",
  },
};

const devTestRoutes = [
  { label: "第一章", test: "chapter1" },
  { label: "小学", test: "campus-primary" },
  { label: "初中", test: "campus-middle" },
  { label: "高中", test: "campus-high" },
  { label: "高考", test: "gaokao" },
  { label: "大学", test: "chapter3" },
  { label: "进度", test: "progress" },
  { label: "远方", test: "final" },
  { label: "封面", test: "start" },
];

function getDevTestRoute() {
  if (!import.meta.env.DEV || typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("test")?.trim() ?? "";
}

function startInitialScene(scene) {
  switch (getDevTestRoute()) {
    case "chapter1":
      scene.scene.start("WorldScene", { returnToCoverOnSuccess: true });
      break;
    case "campus-primary":
      scene.scene.start("CampusScene", { phase: "primary", returnToCoverOnSuccess: true });
      break;
    case "campus-middle":
      scene.scene.start("CampusScene", { phase: "middle", returnToCoverOnSuccess: true });
      break;
    case "campus-high":
      scene.scene.start("CampusScene", { phase: "high", returnToCoverOnSuccess: true });
      break;
    case "gaokao":
      scene.scene.start("GaokaoScene", { returnToCoverOnSuccess: true });
      break;
    case "chapter3":
      scene.scene.start("ChapterThreeScene", { returnToCoverOnSuccess: true });
      break;
    case "progress":
      scene.scene.start("ChapterProgressScene", {
        chapter: 1,
        status: "enter",
        nextScene: "WorldScene",
        nextData: { returnToCoverOnSuccess: true },
        buttonLabel: "测试第一章",
      });
      break;
    case "final":
      scene.scene.start("FinalScene");
      break;
    default:
      scene.scene.start("StartScene");
      break;
  }
}

function openDevTestRoute(test) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set("test", test);
  window.location.assign(url);
}

function clearDevTestRoute() {
  if (!import.meta.env.DEV || typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has("test")) return;
  url.searchParams.delete("test");
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("cover-background", coverBackgroundUrl);
    this.load.image("chapter-background", chapterBackgroundUrl);
  }

  create() {
    createPixelTextures(this);
    startInitialScene(this);
  }
}

class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  create() {
    this.paintStartBackground();
    const returnedFromFinal = typeof window !== "undefined" && Boolean(window.__achesFinalReturn);

    this.add
      .text(810, 72, "Ache's adventure", {
        fontFamily: "Courier New, monospace",
        fontSize: "46px",
        fontStyle: "bold",
        color: "#ffe79b",
      })
      .setOrigin(1, 0.5)
      .setShadow(3, 3, "#361426", 2, true, true)
      .setDepth(30);
    if (returnedFromFinal) {
      this.add
        .text(810, 118, "and the one he found", {
          fontFamily: "Courier New, monospace",
          fontSize: "18px",
          fontStyle: "bold",
          color: "#fff4c4",
        })
        .setOrigin(1, 0.5)
        .setShadow(2, 2, "#361426", 2, true, true)
        .setDepth(30);
      this.paintFinalReturnMarks();
    }

    this.input.once("pointerdown", () => startBackgroundMusic());
    this.createStartButton(720, 332, 138, "进入游戏", () => this.showWarning(), {
      fillAlpha: 0.68,
      fontSize: "18px",
      height: 42,
      strokeAlpha: 0.58,
    });
    this.cameras.main.fadeIn(420, 12, 18, 24);
  }

  paintStartBackground() {
    const image = this.textures.get("cover-background").getSourceImage();
    const scale = Math.max(GAME_WIDTH / image.width, GAME_HEIGHT / image.height);
    this.add.image(GAME_WIDTH / 2, 200, "cover-background").setScale(scale).setDepth(0);

    const shade = this.add.graphics().setDepth(1);
    shade.fillStyle(0x1b1024, 0.18);
    shade.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    shade.fillStyle(0x170d1c, 0.18);
    shade.fillRect(0, 0, GAME_WIDTH, 156);

    this.sunGlow = this.add.circle(528, 154, 68, 0xffcf75, 0.18).setDepth(2);
    this.tweens.add({
      targets: this.sunGlow,
      alpha: 0.34,
      scale: 1.12,
      duration: 2100,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });

    this.waveOffset = 0;
    this.waveGraphics = this.add.graphics().setDepth(3);
    this.drawStartWaves(0);
  }

  drawStartWaves(offset) {
    const g = this.waveGraphics;
    g.clear();
    g.fillStyle(0xffd28b, 0.28);
    for (let row = 0; row < 6; row += 1) {
      const y = 182 + row * 18;
      const shift = Math.sin(offset + row * 0.85) * 14;
      g.fillRect(482 + shift - row * 8, y, 116 - row * 8, 3);
      g.fillRect(566 - shift * 0.55 + row * 10, y + 48, 86 + row * 8, 3);
    }
    g.fillStyle(0x9cc8de, 0.22);
    for (let x = 386; x < GAME_WIDTH; x += 66) {
      const y = 206 + Math.sin(offset + x * 0.02) * 6;
      g.fillRect(x, y, 40, 2);
      g.fillRect(x + 22, y + 38, 54, 2);
    }
  }

  update(_time, delta) {
    if (!this.waveGraphics) return;
    this.waveOffset += delta * 0.004;
    this.drawStartWaves(this.waveOffset);
  }

  createStartButton(x, y, width, label, onClick, options = {}) {
    const height = options.height ?? 56;
    const fontSize = options.fontSize ?? "22px";
    const fillAlpha = options.fillAlpha ?? 1;
    const strokeAlpha = options.strokeAlpha ?? 0.9;
    const button = this.add.container(x, y).setDepth(30);
    const bg = this.add.rectangle(0, 0, width, height, 0xf4d77d, fillAlpha);
    bg.setStrokeStyle(3, 0x704b2a, strokeAlpha);
    const text = this.add
      .text(0, 0, label, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize,
        fontStyle: "bold",
        color: "#132129",
      })
      .setOrigin(0.5);
    button.add([bg, text]);
    button.setSize(width + 12, height + 10);
    button.setInteractive({ useHandCursor: true });
    button.on("pointerdown", () => bg.setFillStyle(0xffefb0, Math.min(fillAlpha + 0.22, 1)));
    button.on("pointerup", () => {
      bg.setFillStyle(0xf4d77d, fillAlpha);
      onClick();
    });
    return button;
  }

  createDevTestDock() {
    this.add
      .text(36, 272, "DEV TEST", {
        fontFamily: "Courier New, monospace",
        fontSize: "12px",
        fontStyle: "bold",
        color: "#ffe79b",
      })
      .setDepth(70)
      .setShadow(2, 2, "#17232a", 1, true, true);

    devTestRoutes.forEach((route, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      this.createDevTestButton(72 + col * 84, 296 + row * 30, route.label, route.test);
    });
  }

  createDevTestButton(x, y, label, test) {
    const button = this.add.container(x, y).setDepth(70);
    const bg = this.add.rectangle(0, 0, 74, 22, 0x10191f, 0.74);
    bg.setStrokeStyle(1, 0xf4d77d, 0.62);
    const text = this.add
      .text(0, 0, label, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "12px",
        fontStyle: "bold",
        color: "#fff4c4",
      })
      .setOrigin(0.5);
    button.add([bg, text]);
    button.setSize(78, 26);
    button.setInteractive({ useHandCursor: true });
    button.on("pointerdown", () => bg.setFillStyle(0x263b45, 0.92));
    button.on("pointerup", () => openDevTestRoute(test));
    return button;
  }

  showWarning() {
    const overlay = this.add.container(0, 0).setDepth(80);
    const shade = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x05080b, 0.68);
    const panel = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 560, 238, 0x17232a, 0.98);
    panel.setStrokeStyle(3, 0xffd984, 0.95);

    const title = this.add
      .text(GAME_WIDTH / 2, 108, "⚠️ 重要警告", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "25px",
        fontStyle: "bold",
        color: "#ffe79b",
      })
      .setOrigin(0.5);

    const body = this.add
      .text(GAME_WIDTH / 2, 176, "一旦进入游戏后，你就必死无疑地会成为我的女朋友，是否想清楚？", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "20px",
        color: "#fff8dd",
        align: "center",
        lineSpacing: 8,
        wordWrap: { width: 468, useAdvancedWrap: true },
      })
      .setOrigin(0.5);

    const startGame = () => this.playMemoryWakeTransition(overlay);

    const ready = this.createStartButton(GAME_WIDTH / 2 - 118, 268, 156, "我想清楚了", startGame);
    const noChoice = this.createStartButton(GAME_WIDTH / 2 + 118, 268, 156, "无法拒绝", startGame);
    overlay.add([shade, panel, title, body, ready, noChoice]);
  }

  paintFinalReturnMarks() {
    const g = this.add.graphics().setDepth(24);
    g.fillStyle(0xffeff5, 0.92);
    g.fillRect(640, 292, 10, 16);
    g.fillStyle(0x8fd8e8, 0.9);
    g.fillRect(654, 292, 10, 16);
    g.fillStyle(0xffd98a, 0.9);
    g.fillRect(638, 288, 28, 4);
    g.fillStyle(0xffffff, 0.28);
    g.fillCircle(650, 282, 26);
    this.tweens.add({
      targets: g,
      alpha: 0.58,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
  }

  playMemoryWakeTransition(warningOverlay) {
    if (this.openingTransitioning) return;
    this.openingTransitioning = true;
    this.input.enabled = false;
    warningOverlay?.destroy(true);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.time.delayedCall(420, () => this.scene.start("SubtitleScene"));
    });
    this.cameras.main.fadeOut(2200, 0, 0, 0);
  }
}

class SubtitleScene extends Phaser.Scene {
  constructor() {
    super("SubtitleScene");
  }

  create() {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const chinese = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "后来他才明白，\n那些看似绕远的路，\n原来都在把他带向某个人。", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "22px",
        fontStyle: "bold",
        color: "#fff4c4",
        align: "center",
        lineSpacing: 8,
        wordWrap: { width: 620, useAdvancedWrap: true },
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const subtitle = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Lead me to find you", {
        fontFamily: "Courier New, monospace",
        fontSize: "34px",
        fontStyle: "bold",
        color: "#ffe79b",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: chinese,
      alpha: 1,
      duration: 900,
      ease: "Sine.inOut",
      yoyo: true,
      hold: 2400,
      onComplete: () => {
        this.tweens.add({
          targets: subtitle,
          alpha: 1,
          duration: 900,
          ease: "Sine.out",
          yoyo: true,
          hold: 1800,
          onComplete: () => {
            this.cameras.main.fadeOut(700, 12, 18, 24);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
              this.scene.start("ChapterProgressScene", {
                chapter: 1,
                status: "enter",
                nextScene: "WorldScene",
              });
            });
          },
        });
      },
    });
  }
}

function startBackgroundMusic() {
  if (typeof window === "undefined") return;

  if (backgroundMusic?.audio) {
    backgroundMusic.audio.play().catch(() => {});
    return;
  }

  const audio = new Audio(backgroundTrackPath);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0;
  backgroundMusic = { audio, fallback: undefined, volumeTimer: undefined };

  const fadeIn = () => {
    window.clearInterval(backgroundMusic.volumeTimer);
    backgroundMusic.volumeTimer = window.setInterval(() => {
      audio.volume = Math.min(0.44, audio.volume + 0.018);
      if (audio.volume >= 0.44) window.clearInterval(backgroundMusic.volumeTimer);
    }, 100);
  };

  audio.addEventListener("playing", fadeIn, { once: true });
  audio.addEventListener(
    "error",
    () => {
      startTideMusicFallback();
    },
    { once: true },
  );

  audio.play().catch(() => {
    startTideMusicFallback();
  });
}

function startTideMusicFallback() {
  if (typeof window === "undefined") return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  if (backgroundMusic?.fallback) {
    backgroundMusic.fallback.context.resume?.();
    return;
  }

  const context = new AudioContextClass();
  const master = context.createGain();
  master.gain.setValueAtTime(0, context.currentTime);
  master.gain.linearRampToValueAtTime(0.16, context.currentTime + 2.4);
  master.connect(context.destination);

  const lowWave = createTideNoiseSource(context, 10, 520);
  const lowWaveGain = context.createGain();
  lowWaveGain.gain.value = 0.045;
  lowWave.output.connect(lowWaveGain).connect(master);

  const foamWave = createTideNoiseSource(context, 7, 1450);
  const foamGain = context.createGain();
  foamGain.gain.value = 0.018;
  foamWave.output.connect(foamGain).connect(master);

  const padGain = context.createGain();
  padGain.gain.value = 0.018;
  padGain.connect(master);

  [98, 146.83, 196].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = index === 0 ? 0.55 : 0.32;
    oscillator.connect(gain).connect(padGain);
    oscillator.start();
  });

  const scheduleTide = () => {
    const now = context.currentTime;
    lowWaveGain.gain.cancelScheduledValues(now);
    foamGain.gain.cancelScheduledValues(now);
    lowWaveGain.gain.setValueAtTime(lowWaveGain.gain.value, now);
    foamGain.gain.setValueAtTime(foamGain.gain.value, now);
    lowWaveGain.gain.linearRampToValueAtTime(0.14, now + 4.2);
    foamGain.gain.linearRampToValueAtTime(0.055, now + 3.2);
    lowWaveGain.gain.linearRampToValueAtTime(0.045, now + 9.5);
    foamGain.gain.linearRampToValueAtTime(0.018, now + 8.6);
    backgroundMusic.fallback.timer = window.setTimeout(scheduleTide, 9000);
  };

  backgroundMusic = {
    ...(backgroundMusic ?? {}),
    fallback: { context, timer: undefined },
  };
  lowWave.source.start();
  foamWave.source.start();
  scheduleTide();
  context.resume?.();
}

function pauseBackgroundMusic() {
  if (typeof window === "undefined" || !backgroundMusic) return;
  window.clearInterval(backgroundMusic.volumeTimer);
  if (backgroundMusic.audio) {
    backgroundMusic.wasAudioPlaying = !backgroundMusic.audio.paused;
    backgroundMusic.audio.pause();
  }
  if (backgroundMusic.fallback?.context?.state === "running") {
    backgroundMusic.wasFallbackRunning = true;
    backgroundMusic.fallback.context.suspend?.();
  }
}

function resumeBackgroundMusic() {
  if (typeof window === "undefined" || !backgroundMusic) return;
  if (backgroundMusic.audio && backgroundMusic.wasAudioPlaying) {
    backgroundMusic.audio.play().catch(() => {});
  }
  if (backgroundMusic.fallback && backgroundMusic.wasFallbackRunning) {
    backgroundMusic.fallback.context.resume?.();
  }
  backgroundMusic.wasAudioPlaying = false;
  backgroundMusic.wasFallbackRunning = false;
}

function createTideNoiseSource(context, seconds, cutoff) {
  const buffer = context.createBuffer(1, Math.floor(context.sampleRate * seconds), context.sampleRate);
  const data = buffer.getChannelData(0);
  let previous = 0;

  for (let index = 0; index < data.length; index += 1) {
    const white = Math.random() * 2 - 1;
    previous = (previous + 0.025 * white) / 1.025;
    data[index] = Math.max(-1, Math.min(1, previous * 4.5));
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  source.buffer = buffer;
  source.loop = true;
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  filter.Q.value = 0.35;
  source.connect(filter);
  return { output: filter, source };
}

class WorldScene extends Phaser.Scene {
  constructor() {
    super("WorldScene");
    this.collected = 0;
    this.dialogOpen = false;
    this.caughtCooldown = false;
    this.returnToCoverOnSuccess = false;
  }

  init(data = {}) {
    this.returnToCoverOnSuccess = Boolean(data.returnToCoverOnSuccess);
  }

  create() {
    this.collected = 0;
    this.dialogOpen = false;
    this.caughtCooldown = false;
    this.playerStart = { x: 62, y: 316 };

    this.physics.world.setBounds(18, 62, GAME_WIDTH - 36, GAME_HEIGHT - 92);
    this.obstacles = this.physics.add.staticGroup();
    this.paintWorld();
    this.createPlayer();
    this.createMemoryItems();
    this.createAdults();
    this.createHud();
    this.createKeyboard();

    this.physics.add.collider(this.player, this.obstacles);
    this.physics.add.collider(this.adults, this.obstacles);
    this.physics.add.overlap(this.player, this.items, this.collectMemory, undefined, this);
    this.physics.add.overlap(this.player, this.adults, this.triggerCaught, undefined, this);
    this.showChapterIntro();
    this.cameras.main.fadeIn(420, 12, 18, 24);
  }

  paintWorld() {
    const g = this.add.graphics();
    g.fillStyle(0x2f7346, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    g.fillStyle(0x4f8b55, 1);
    for (let y = 72; y < GAME_HEIGHT - 30; y += 28) {
      for (let x = 20; x < GAME_WIDTH - 16; x += 30) {
        if ((x + y) % 60 === 0) g.fillRect(x, y, 7, 6);
        if ((x * 2 + y) % 84 === 0) g.fillRect(x + 14, y + 8, 5, 4);
      }
    }

    g.fillStyle(0xb98652, 1);
    g.fillRect(36, 184, 770, 30);
    g.fillRect(388, 74, 34, 250);
    g.fillRect(80, 296, 680, 28);
    g.fillStyle(0xd1a36b, 1);
    for (let x = 56; x < 790; x += 44) g.fillRect(x, 194, 12, 7);
    for (let x = 102; x < 742; x += 46) g.fillRect(x, 306, 12, 7);
    for (let y = 94; y < 316; y += 34) g.fillRect(398, y, 10, 7);

    this.drawVillageHouse(g, 86, 86, 86, 64, 0xa64b46, 0xf1c77c);
    this.drawVillageHouse(g, 260, 82, 92, 68, 0x4f7c9b, 0xf0d199);
    this.drawVillageHouse(g, 620, 82, 96, 72, 0x9b5a3d, 0xf5ce83);
    this.drawVillageHouse(g, 166, 238, 96, 64, 0x7a5b9d, 0xe9c58b);
    this.drawVillageHouse(g, 574, 242, 90, 60, 0xc45c62, 0xf0d7a8);

    g.fillStyle(0x3f6f8a, 1);
    g.fillRect(736, 76, 86, 248);
    g.fillStyle(0x67a9bb, 1);
    for (let y = 94; y < 310; y += 30) g.fillRect(752, y, 48, 5);

    [
      [34, 92],
      [214, 76],
      [504, 78],
      [784, 72],
      [48, 274],
      [326, 336],
      [500, 322],
      [806, 326],
    ].forEach(([x, y]) => {
      this.add.image(x, y, "tree").setDepth(2);
      this.addObstacle(x - 15, y - 10, 30, 48);
    });

    [
      [224, 164],
      [318, 246],
      [470, 156],
      [536, 326],
      [702, 214],
      [790, 226],
    ].forEach(([x, y], index) => {
      this.add.image(x, y, index % 2 === 0 ? "tiny-flower-pink" : "tiny-flower-blue").setDepth(2);
    });

    g.fillStyle(0x6c4a33, 1);
    g.fillRect(454, 230, 54, 14);
    g.fillRect(462, 244, 7, 26);
    g.fillRect(492, 244, 7, 26);
    g.fillStyle(0xe2b36b, 1);
    g.fillRect(462, 233, 36, 5);
  }

  drawVillageHouse(g, x, y, width, height, roofColor, wallColor) {
    g.fillStyle(roofColor, 1);
    g.fillTriangle(x - 8, y + 24, x + width / 2, y - 12, x + width + 8, y + 24);
    g.fillStyle(wallColor, 1);
    g.fillRect(x, y + 22, width, height);
    g.fillStyle(0x7d5032, 1);
    g.fillRect(x + width / 2 - 10, y + height + 42, 20, 22);
    g.fillStyle(0x9dc3d0, 1);
    g.fillRect(x + 14, y + 38, 16, 14);
    g.fillRect(x + width - 30, y + 38, 16, 14);
    g.fillStyle(0x5e3c28, 1);
    g.fillRect(x, y + height + 20, width, 6);

    this.addObstacle(x - 4, y + 12, width + 8, height + 24);
  }

  addObstacle(x, y, width, height) {
    const obstacle = this.add.zone(x + width / 2, y + height / 2, width, height);
    obstacle.setData("type", "obstacle");
    this.physics.add.existing(obstacle, true);
    obstacle.body.setSize(width, height);
    obstacle.body.updateFromGameObject();
    this.obstacles.add(obstacle);
  }

  createPlayer() {
    this.player = this.physics.add.sprite(this.playerStart.x, this.playerStart.y, "boy-player");
    this.player.setDepth(10);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(18, 22);
    this.player.body.setOffset(7, 13);

    this.tweens.add({
      targets: this.player,
      scaleY: 0.96,
      duration: 420,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
  }

  createMemoryItems() {
    this.items = this.physics.add.staticGroup();
    childhoodItems.forEach((memory, index) => {
      const item = this.items.create(memory.x, memory.y, memory.texture);
      item.setData("memory", memory);
      item.setDepth(7);
      item.body.setCircle(22);
      item.body.updateFromGameObject();

      this.tweens.add({
        targets: item,
        y: memory.y - 6,
        duration: 760 + index * 70,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });
    });
  }

  createAdults() {
    this.adults = this.physics.add.group();
    this.createPatrolAdult(250, 200, 350, 200, "被大人发现啦！快从小路溜走。", 3200);
    this.createPatrolAdult(636, 270, 636, 134, "差点被叫回家挨训，先躲远一点。", 3600);
  }

  createPatrolAdult(x, y, targetX, targetY, message, duration) {
    const adult = this.adults.create(x, y, "adult");
    adult.setDepth(11);
    adult.setData("message", message);
    adult.setData("home", { x, y });
    adult.setData("vision", 150);
    adult.setData("speed", 92);
    adult.setData("chasing", false);
    adult.setCollideWorldBounds(true);
    adult.body.setSize(20, 26);
    adult.body.setOffset(6, 10);
    const alert = this.add
      .text(adult.x, adult.y - 34, "!", {
        fontFamily: "Courier New, monospace",
        fontSize: "24px",
        fontStyle: "bold",
        color: "#ffeed0",
      })
      .setOrigin(0.5)
      .setDepth(28)
      .setVisible(false);
    adult.setData("alert", alert);

    const patrolTween = this.tweens.add({
      targets: adult,
      x: targetX,
      y: targetY,
      duration,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
    adult.setData("patrolTween", patrolTween);
  }

  createHud() {
    this.hud = this.add.container(0, 0).setDepth(40).setScrollFactor(0);
    const titleBg = this.add.rectangle(138, 27, 238, 38, 0x10191f, 0.78);
    titleBg.setStrokeStyle(2, 0xf4d77d, 0.42);
    const title = this.add
      .text(138, 27, "chapter 1  The boy", {
        fontFamily: "Courier New, monospace",
        fontSize: "17px",
        fontStyle: "bold",
        color: "#ffe79b",
      })
      .setOrigin(0.5);
    const bg = this.add.rectangle(GAME_WIDTH / 2, 27, 168, 38, 0x10191f, 0.78);
    bg.setStrokeStyle(2, 0x9ecf9d, 0.55);
    this.hudText = this.add
      .text(GAME_WIDTH / 2, 27, "回忆 0 / 5", {
        fontFamily: "Courier New, monospace",
        fontSize: "18px",
        fontStyle: "bold",
        color: "#f9f1c7",
      })
      .setOrigin(0.5);
    this.hud.add([titleBg, title, bg, this.hudText]);
  }

  createKeyboard() {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  collectMemory(_player, item) {
    if (this.dialogOpen || !item.active) return;

    this.dialogOpen = true;
    item.disableBody(true, true);
    this.tweens.killTweensOf(item);
    this.collected += 1;
    this.hudText.setText(`回忆 ${this.collected} / ${childhoodItems.length}`);
    this.player.setVelocity(0, 0);

    const memory = item.getData("memory");
    this.showMemoryDialog(memory, () => {
      this.dialogOpen = false;
      if (this.collected >= childhoodItems.length) this.finishRun();
    });
  }

  triggerCaught(_player, adult) {
    if (this.dialogOpen || this.caughtCooldown) return;

    this.dialogOpen = true;
    this.caughtCooldown = true;
    this.player.setVelocity(0, 0);
    this.resetAdultPatrol(adult);
    this.cameras.main.shake(150, 0.006);
    this.showEventDialog(adult.getData("message"), () => {
      this.player.setPosition(this.playerStart.x, this.playerStart.y);
      this.dialogOpen = false;
      this.time.delayedCall(900, () => {
        this.caughtCooldown = false;
      });
    });
  }

  showChapterIntro() {
    this.dialogOpen = true;
    const overlay = this.add.container(0, 0).setDepth(82).setScrollFactor(0);
    const shade = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x05080b, 0.56);
    const panel = this.add.rectangle(GAME_WIDTH / 2, 196, 520, 220, 0x17232a, 0.98);
    panel.setStrokeStyle(3, 0xf4d77d, 0.92);
    const title = this.add
      .text(GAME_WIDTH / 2, 126, "chapter 1  The boy", {
        fontFamily: "Courier New, monospace",
        fontSize: "26px",
        fontStyle: "bold",
        color: "#ffe79b",
      })
      .setOrigin(0.5);
    const body = this.add
      .text(GAME_WIDTH / 2, 186, "村子很小，玩闹的地方却很多。\n收集 5 个童年回忆，别被大人逮住。", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "18px",
        color: "#fff8dd",
        align: "center",
        lineSpacing: 8,
        wordWrap: { width: 430, useAdvancedWrap: true },
      })
      .setOrigin(0.5);
    const button = this.makeCanvasButton(GAME_WIDTH / 2, 278, 150, "开始探索", () => {
      overlay.destroy();
      this.dialogOpen = false;
    });
    overlay.add([shade, panel, title, body, button]);
  }

  showEventDialog(message, onDone) {
    const overlay = this.add.container(0, 0).setDepth(84).setScrollFactor(0);
    const shade = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x05080b, 0.46);
    const panel = this.add.rectangle(GAME_WIDTH / 2, 198, 430, 176, 0x17232a, 0.98);
    panel.setStrokeStyle(3, 0xff896f, 0.88);
    const title = this.add
      .text(GAME_WIDTH / 2, 144, "小事件", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "22px",
        fontStyle: "bold",
        color: "#ffb08f",
      })
      .setOrigin(0.5);
    const body = this.add
      .text(GAME_WIDTH / 2, 194, message, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "18px",
        color: "#fff8dd",
        align: "center",
        wordWrap: { width: 342, useAdvancedWrap: true },
      })
      .setOrigin(0.5);
    const button = this.makeCanvasButton(GAME_WIDTH / 2, 260, 124, "溜走", () => {
      overlay.destroy();
      onDone();
    });
    overlay.add([shade, panel, title, body, button]);
  }

  showMemoryDialog(memory, onDone) {
    const overlay = this.add.container(0, 0).setDepth(80).setScrollFactor(0);
    const shade = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x05080b, 0.64);
    const panel = this.add.rectangle(GAME_WIDTH / 2, 196, 486, 232, 0x17232a, 0.98);
    panel.setStrokeStyle(3, 0xf4d77d, 0.92);

    const icon = this.add.image(GAME_WIDTH / 2, 104, memory.texture).setScale(1.08);
    const title = this.add
      .text(GAME_WIDTH / 2, 150, memory.title, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "20px",
        fontStyle: "bold",
        color: "#ffe79b",
        align: "center",
      })
      .setOrigin(0.5);
    const body = this.add
      .text(GAME_WIDTH / 2, 204, memory.text, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "18px",
        color: "#fff7dd",
        align: "center",
        lineSpacing: 8,
        wordWrap: { width: 386, useAdvancedWrap: true },
      })
      .setOrigin(0.5);
    const button = this.makeCanvasButton(GAME_WIDTH / 2, 286, 132, "继续", () => {
      overlay.destroy();
      onDone();
    });
    overlay.add([shade, panel, icon, title, body, button]);
  }

  makeCanvasButton(x, y, width, label, onClick) {
    const button = this.add.container(x, y);
    const buttonBg = this.add.rectangle(0, 0, width, 46, 0xf4d77d, 1);
    buttonBg.setStrokeStyle(2, 0x6c4826, 0.86);
    const buttonText = this.add
      .text(0, 0, label, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "18px",
        fontStyle: "bold",
        color: "#17232a",
      })
      .setOrigin(0.5);
    button.add([buttonBg, buttonText]);
    button.setSize(width + 10, 54);
    button.setInteractive({ useHandCursor: true });
    button.on("pointerdown", () => buttonBg.setFillStyle(0xffecae));
    button.on("pointerup", onClick);
    return button;
  }

  finishRun() {
    this.input.enabled = false;
    this.cameras.main.fadeOut(900, 8, 12, 20);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      if (this.returnToCoverOnSuccess) {
        clearDevTestRoute();
        this.scene.start("StartScene");
      } else {
        this.scene.start("ChapterProgressScene", {
          chapter: 2,
          status: "enter",
          nextScene: "CampusScene",
        });
      }
    });
  }

  playChildhoodConstellationTransition(onComplete) {
    const layer = this.add.container(0, 0).setDepth(120).setScrollFactor(0);
    const shade = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x05080b, 0).setOrigin(0);
    const starLines = this.add.graphics();
    const bag = this.add.graphics().setAlpha(0);
    const text = this.add
      .text(
        GAME_WIDTH / 2,
        70,
        "五个小小的记忆，\n慢慢收成了长大的轮廓。",
        {
          fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
          fontSize: "20px",
          fontStyle: "bold",
          color: "#fff4c4",
          align: "center",
          lineSpacing: 6,
          wordWrap: { width: 560, useAdvancedWrap: true },
        },
      )
      .setOrigin(0.5)
      .setAlpha(0);
    layer.add([shade, starLines, bag, text]);

    const constellation = [
      [GAME_WIDTH / 2 - 86, 190],
      [GAME_WIDTH / 2 - 38, 146],
      [GAME_WIDTH / 2 + 34, 162],
      [GAME_WIDTH / 2 + 82, 216],
      [GAME_WIDTH / 2 - 4, 242],
    ];
    const icons = childhoodItems.map((memory, index) => {
      const icon = this.add.image(memory.x, memory.y, memory.texture).setScale(0.9).setAlpha(0);
      layer.add(icon);
      this.tweens.add({
        targets: icon,
        x: constellation[index][0],
        y: constellation[index][1],
        alpha: 1,
        scale: 0.72,
        duration: 760,
        delay: index * 110,
        ease: "Cubic.easeOut",
      });
      return icon;
    });

    const drawBag = (alpha = 1) => {
      bag.clear();
      bag.fillStyle(0x5aa9d6, 0.92 * alpha);
      bag.fillRoundedRect(GAME_WIDTH / 2 - 42, 156, 84, 102, 8);
      bag.fillStyle(0x2f4f78, 0.96 * alpha);
      bag.fillRoundedRect(GAME_WIDTH / 2 - 52, 190, 104, 76, 8);
      bag.fillStyle(0xffe7a3, 0.92 * alpha);
      bag.fillRect(GAME_WIDTH / 2 - 22, 204, 44, 6);
      bag.fillRect(GAME_WIDTH / 2 - 18, 222, 36, 5);
      bag.lineStyle(4, 0xf4d77d, 0.9 * alpha);
      bag.strokeRoundedRect(GAME_WIDTH / 2 - 30, 146, 60, 42, 12);
    };
    drawBag(1);

    this.tweens.add({ targets: shade, alpha: 0.78, duration: 420, ease: "Sine.inOut" });
    this.tweens.add({ targets: text, alpha: 1, duration: 600, delay: 240, ease: "Sine.inOut" });
    this.time.delayedCall(980, () => {
      starLines.clear();
      starLines.lineStyle(2, 0xffe79b, 0.5);
      starLines.beginPath();
      constellation.forEach(([x, y], index) => {
        if (index === 0) starLines.moveTo(x, y);
        else starLines.lineTo(x, y);
      });
      starLines.closePath();
      starLines.strokePath();
    });
    this.time.delayedCall(1780, () => {
      icons.forEach((icon, index) => {
        this.tweens.add({
          targets: icon,
          x: GAME_WIDTH / 2,
          y: 212,
          scale: 0.2,
          alpha: 0,
          duration: 520,
          delay: index * 45,
          ease: "Sine.in",
        });
      });
      this.tweens.add({
        targets: bag,
        alpha: 1,
        duration: 520,
        delay: 240,
        ease: "Sine.out",
      });
      this.cameras.main.shake(80, 0.003);
    });
    this.time.delayedCall(2900, () => {
      this.cameras.main.fadeOut(560, 12, 18, 24);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, onComplete);
    });
  }

  update() {
    if (!this.player || this.dialogOpen) {
      if (this.player) this.player.setVelocity(0, 0);
      this.pauseAdultChasers();
      return;
    }

    const left = this.keys.left.isDown || this.keys.a.isDown;
    const right = this.keys.right.isDown || this.keys.d.isDown;
    const up = this.keys.up.isDown || this.keys.w.isDown;
    const down = this.keys.down.isDown || this.keys.s.isDown;
    const pointerTarget = this.getPointerMoveTarget();

    const velocity = new Phaser.Math.Vector2(0, 0);
    if (pointerTarget) {
      velocity.set(pointerTarget.x - this.player.x, pointerTarget.y - this.player.y);
    } else {
      if (left) velocity.x -= 1;
      if (right) velocity.x += 1;
      if (up) velocity.y -= 1;
      if (down) velocity.y += 1;
    }

    if (velocity.lengthSq() > 0) {
      velocity.normalize().scale(PLAYER_SPEED);
      this.player.setVelocity(velocity.x, velocity.y);
      this.player.setFlipX(velocity.x < 0);
    } else {
      this.player.setVelocity(0, 0);
    }

    this.updateAdults();
  }

  getPointerMoveTarget() {
    const pointer = this.input.activePointer;
    if (!pointer?.isDown) return null;

    const x = Number.isFinite(pointer.worldX) ? pointer.worldX : pointer.x;
    const y = Number.isFinite(pointer.worldY) ? pointer.worldY : pointer.y;
    if (Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y) < 12) return null;

    return { x, y };
  }

  updateAdults() {
    if (!this.adults || !this.player) return;

    this.adults.children.iterate((adult) => {
      if (!adult?.active) return;

      const distance = Phaser.Math.Distance.Between(adult.x, adult.y, this.player.x, this.player.y);
      if (!adult.getData("chasing") && distance < adult.getData("vision")) this.startAdultChase(adult);

      if (adult.getData("chasing")) {
        if (distance > 250) {
          this.resetAdultPatrol(adult);
        } else {
          this.physics.moveToObject(adult, this.player, adult.getData("speed"));
        }
      }

      const alert = adult.getData("alert");
      if (alert) alert.setPosition(adult.x, adult.y - 34).setVisible(adult.getData("chasing"));
    });
  }

  startAdultChase(adult) {
    adult.setData("chasing", true);
    adult.getData("patrolTween")?.pause();
    adult.getData("alert")?.setVisible(true);
  }

  resetAdultPatrol(adult) {
    if (!adult) return;

    adult.setData("chasing", false);
    adult.setVelocity(0, 0);
    adult.getData("alert")?.setVisible(false);

    const home = adult.getData("home");
    if (home) adult.setPosition(home.x, home.y);
    adult.getData("patrolTween")?.restart();
  }

  pauseAdultChasers() {
    if (!this.adults) return;

    this.adults.children.iterate((adult) => {
      if (adult?.active && adult.getData("chasing")) adult.setVelocity(0, 0);
    });
  }
}

class ChapterProgressScene extends Phaser.Scene {
  constructor() {
    super("ChapterProgressScene");
  }

  init(data = {}) {
    this.chapter = Phaser.Math.Clamp(data.chapter ?? 1, 1, TOTAL_CHAPTERS);
    this.status = "enter";
    this.nextScene = data.nextScene ?? "StartScene";
    this.nextData = data.nextData ?? {};
  }

  create() {
    const completed = this.chapter - 1;
    const chapterTitle = chapterProgressData[this.chapter]?.title ?? "";
    const source = this.textures.get("chapter-background").getSourceImage();
    const scale = Math.max(GAME_WIDTH / source.width, GAME_HEIGHT / source.height);
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "chapter-background").setScale(scale).setDepth(0);

    const g = this.add.graphics();
    g.fillStyle(0x041018, 0.22);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.fillStyle(0x041018, 0.34);
    g.fillRect(0, 0, GAME_WIDTH, 82);
    g.fillStyle(0xffe4a3, 0.18);
    g.fillRect(0, 82, GAME_WIDTH, 2);

    const routeY = 252;
    const startX = 138;
    const endX = 706;
    const segmentWidth = (endX - startX) / (TOTAL_CHAPTERS - 1);
    const boatX = startX + (this.chapter - 1) * segmentWidth;
    const previousBoatX = startX + Math.max(this.chapter - 2, 0) * segmentWidth;

    g.lineStyle(5, 0x092736, 0.5);
    g.beginPath();
    g.moveTo(startX, routeY + 4);
    for (let index = 1; index <= TOTAL_CHAPTERS; index += 1) {
      const x = startX + (index - 1) * segmentWidth;
      const y = routeY + Math.sin(index * 1.2) * 10;
      g.lineTo(x, y + 4);
    }
    g.strokePath();
    g.lineStyle(3, 0xffe4a3, 0.62);
    g.beginPath();
    g.moveTo(startX, routeY);
    for (let index = 1; index <= TOTAL_CHAPTERS; index += 1) {
      const x = startX + (index - 1) * segmentWidth;
      const y = routeY + Math.sin(index * 1.2) * 10;
      g.lineTo(x, y);
    }
    g.strokePath();

    for (let index = 1; index <= TOTAL_CHAPTERS; index += 1) {
      const x = startX + (index - 1) * segmentWidth;
      const y = routeY + Math.sin(index * 1.2) * 10;
      const active = index === this.chapter;
      const done = index <= completed;
      g.fillStyle(done ? 0xffd98a : active ? 0xfff2bf : 0xb6d6db, active ? 0.95 : 0.62);
      g.fillCircle(x, y, active ? 9 : 6);
      g.lineStyle(2, active ? 0xffffff : 0x0c3240, active ? 0.88 : 0.44);
      g.strokeCircle(x, y, active ? 15 : 10);
      this.add
        .text(x, y + 28, String(index), {
          fontFamily: "Courier New, monospace",
          fontSize: "15px",
          fontStyle: "bold",
          color: active ? "#fff7d2" : "#d8edf0",
        })
        .setOrigin(0.5);
    }

    this.add
      .text(GAME_WIDTH / 2, 48, `Chapter ${this.chapter}: ${chapterTitle}`, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "27px",
        fontStyle: "bold",
        color: "#fff4c4",
      })
      .setOrigin(0.5)
      .setShadow(2, 2, "#06202c", 4, true, true);

    const boat = this.add.container(previousBoatX, routeY - 18).setDepth(6);
    const boatBody = this.add.graphics();
    this.drawProgressBoat(boatBody);
    boat.add(boatBody);
    if (previousBoatX !== boatX) {
      this.tweens.add({
        targets: boat,
        x: boatX,
        duration: 1050,
        ease: "Sine.inOut",
        onComplete: () => this.startBoatFloat(boat),
      });
    } else {
      this.startBoatFloat(boat);
    }

    this.cameras.main.fadeIn(620, 12, 18, 24);
    this.time.delayedCall(2300, () => this.continueNext());
  }

  drawProgressBoat(g) {
    const x = 0;
    const y = 0;
    g.fillStyle(0x06202c, 0.3);
    g.fillEllipse(x, y + 26, 74, 12);
    g.fillStyle(0x7a4b2a, 1);
    g.fillTriangle(x - 34, y + 8, x + 34, y + 8, x + 20, y + 26);
    g.fillRect(x - 25, y + 6, 50, 9);
    g.fillStyle(0xffd98a, 1);
    g.fillRect(x - 2, y - 24, 4, 34);
    g.fillStyle(0xfff2bf, 0.96);
    g.fillTriangle(x + 2, y - 22, x + 2, y + 6, x + 28, y + 4);
    g.fillStyle(0xb9e3e8, 0.86);
    g.fillTriangle(x - 2, y - 18, x - 2, y + 5, x - 22, y + 2);
    g.fillStyle(0xffffff, 0.45);
    g.fillRect(x + 7, y - 12, 10, 3);
  }

  startBoatFloat(boat) {
    this.tweens.add({
      targets: boat,
      y: boat.y - 5,
      duration: 1300,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
  }

  continueNext() {
    this.cameras.main.fadeOut(620, 12, 18, 24);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(this.nextScene, this.nextData);
    });
  }

  makeProgressButton(x, y, label, onClick) {
    const button = this.add.container(x, y).setDepth(8);
    const bg = this.add.rectangle(0, 0, 146, 46, 0xf4d77d, 1);
    bg.setStrokeStyle(2, 0x704b2a, 0.9);
    const text = this.add
      .text(0, 0, label, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "18px",
        fontStyle: "bold",
        color: "#132129",
      })
      .setOrigin(0.5);
    button.add([bg, text]);
    button.setSize(156, 56);
    button.setInteractive({ useHandCursor: true });
    button.on("pointerdown", () => bg.setFillStyle(0xffefb0));
    button.on("pointerup", () => {
      bg.setFillStyle(0xf4d77d);
      onClick();
    });
    return button;
  }
}

class InterludeSubtitleScene extends Phaser.Scene {
  constructor() {
    super("InterludeSubtitleScene");
  }

  init(data = {}) {
    this.message = data.message ?? "";
    this.nextScene = data.nextScene ?? "StartScene";
    this.nextData = data.nextData ?? {};
    this.hold = data.hold ?? 2600;
  }

  create() {
    const g = this.add.graphics();
    g.fillStyle(0x05080b, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.fillStyle(0xffd28b, 0.12);
    g.fillRect(0, 190, GAME_WIDTH, 2);

    const text = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, this.message, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "21px",
        fontStyle: "bold",
        color: "#fff4c4",
        align: "center",
        lineSpacing: 8,
        wordWrap: { width: 660, useAdvancedWrap: true },
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: text,
      alpha: 1,
      duration: 900,
      yoyo: true,
      hold: this.hold,
      ease: "Sine.inOut",
      onComplete: () => {
        this.cameras.main.fadeOut(650, 8, 12, 20);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          this.scene.start(this.nextScene, this.nextData);
        });
      },
    });
    this.cameras.main.fadeIn(520, 8, 12, 20);
  }
}

class CampusScene extends Phaser.Scene {
  constructor() {
    super("CampusScene");
    this.startPhase = "primary";
    this.returnToCoverOnSuccess = false;
    this.phase = "primary";
    this.dialogOpen = false;
    this.primaryCards = 0;
    this.primaryComplete = false;
    this.highTimeLimit = 10;
    this.highTimeLeft = 10;
    this.highRequiredGates = 4;
    this.highPassedGates = 0;
    this.highGateSpeed = 145;
    this.highGateSpawnDelay = 1400;
    this.highGateStreamStarted = false;
    this.highGateIndex = 0;
    this.highGateSpawned = 0;
    this.highGoalOpen = false;
    this.highFinishing = false;
    this.phaseTimers = [];
    this.dangerCooldown = false;
    this.primaryTouchDirection = 0;
    this.middleTouchDirection = 0;
  }

  init(data = {}) {
    this.startPhase = data.phase ?? "primary";
    this.returnToCoverOnSuccess = Boolean(data.returnToCoverOnSuccess);
  }

  create() {
    this.input.enabled = true;
    this.completing = false;
    this.phaseTimers = [];
    this.dangerCooldown = false;
    this.primaryTouchDirection = 0;
    this.middleTouchDirection = 0;
    this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.cameras.main.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
    this.input.on("pointerdown", this.handleCampusPointer, this);
    this.input.on("pointermove", this.handleCampusPointerMove, this);
    this.input.on("pointerup", this.handleCampusPointerUp, this);
    if (this.startPhase === "middle") {
      this.startMiddlePhase();
    } else if (this.startPhase === "high") {
      this.startHighPhase();
    } else {
      this.startPrimaryPhase();
    }
    this.cameras.main.fadeIn(420, 12, 18, 24);
  }

  clearPhase() {
    this.phaseTimers.forEach((timer) => timer.remove(false));
    this.phaseTimers = [];
    this.tweens.killAll();
    this.physics.world.colliders.destroy();
    this.children.removeAll(true);
    this.dialogOpen = false;
    this.dangerCooldown = false;
  }

  createCampusHud(stage, detail) {
    this.hud = this.add.container(0, 0).setDepth(50).setScrollFactor(0);
    const titleBg = this.add.rectangle(156, 27, 270, 38, 0x10191f, 0.82);
    titleBg.setStrokeStyle(2, 0xf4d77d, 0.42);
    const title = this.add
      .text(156, 27, `chapter 2  ${stage}`, {
        fontFamily: "Courier New, monospace",
        fontSize: "15px",
        fontStyle: "bold",
        color: "#ffe79b",
      })
      .setOrigin(0.5);
    const progressBg = this.add.rectangle(548, 27, 312, 38, 0x10191f, 0.82);
    progressBg.setStrokeStyle(2, 0x9ecf9d, 0.55);
    this.hudText = this.add
      .text(548, 27, detail, {
        fontFamily: "Courier New, monospace",
        fontSize: detail.length > 24 ? "12px" : "14px",
        fontStyle: "bold",
        color: "#f9f1c7",
      })
      .setOrigin(0.5);
    this.hud.add([titleBg, title, progressBg, this.hudText]);
    this.createCampusExitButton();
  }

  createCampusExitButton() {
    const button = this.add.container(800, 27).setDepth(90).setScrollFactor(0);
    const bg = this.add.rectangle(0, 0, 64, 36, 0x10191f, 0.86);
    bg.setStrokeStyle(2, 0xffd984, 0.8);
    const text = this.add
      .text(0, 0, "封面", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "15px",
        fontStyle: "bold",
        color: "#ffe79b",
      })
      .setOrigin(0.5);
    button.add([bg, text]);
    button.setSize(70, 42);
    button.setInteractive({ useHandCursor: true });
    button.on("pointerdown", (_pointer, _x, _y, event) => {
      event?.stopPropagation();
      bg.setFillStyle(0x263b45, 0.96);
    });
    button.on("pointerup", (_pointer, _x, _y, event) => {
      event?.stopPropagation();
      this.returnToCover();
    });
    button.on("pointerout", () => bg.setFillStyle(0x10191f, 0.86));
  }

  updateHud(text) {
    if (this.hudText) this.hudText.setText(text);
  }

  drawSchoolBackground(label, wallColor, roofColor, accentColor) {
    const g = this.add.graphics().setDepth(0);
    g.fillStyle(0x7fcbd7, 1);
    g.fillRect(0, 0, GAME_WIDTH, 182);
    g.fillStyle(0xb7e0db, 1);
    g.fillRect(0, 182, GAME_WIDTH, 74);
    g.fillStyle(0x3f8f67, 1);
    g.fillRect(0, 256, GAME_WIDTH, 134);

    g.fillStyle(0xf3d176, 1);
    for (let x = 36; x < GAME_WIDTH; x += 96) {
      g.fillRect(x, 68 + (x % 4) * 7, 16, 7);
      g.fillRect(x + 34, 98 + (x % 3) * 9, 12, 6);
    }

    g.fillStyle(wallColor, 1);
    g.fillRect(148, 112, 548, 138);
    g.fillStyle(roofColor, 1);
    g.fillRect(124, 84, 596, 30);
    g.fillStyle(accentColor, 1);
    g.fillRect(366, 160, 92, 90);
    g.fillStyle(0x9cd3e4, 1);
    for (let x = 178; x <= 624; x += 74) {
      g.fillRect(x, 136, 24, 18);
      g.fillRect(x, 178, 24, 18);
    }

    this.add
      .text(GAME_WIDTH / 2, 100, label, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "30px",
        fontStyle: "bold",
        color: "#fff4c4",
      })
      .setOrigin(0.5)
      .setShadow(3, 3, "#3d2832", 2, true, true)
      .setDepth(3);
  }

  makeStaticGround(y = 314) {
    this.ground = this.physics.add.staticImage(GAME_WIDTH / 2, y + 22, "solid-hitbox");
    this.ground.setDisplaySize(GAME_WIDTH, 44).setVisible(false).refreshBody();
  }

  makePrimaryGround(y = 314) {
    this.primaryGroundLeft = this.physics.add.staticImage(350, y + 22, "solid-hitbox");
    this.primaryGroundLeft.setDisplaySize(700, 44).setVisible(false).refreshBody();
    this.primaryGroundRight = this.physics.add.staticImage(772, y + 22, "solid-hitbox");
    this.primaryGroundRight.setDisplaySize(144, 44).setVisible(false).refreshBody();
  }

  startPrimaryPhase() {
    this.clearPhase();
    this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT + 220);
    this.phase = "primary";
    this.primaryCards = 0;
    this.primaryComplete = false;
    this.primaryFinishing = false;
    this.primaryTouchDirection = 0;
    this.drawSchoolBackground("小学", 0xffd36f, 0xff7d7d, 0xf4f0cf);
    this.createCampusHud("Primary School", "碎片 0 / 3   主动移动");

    const g = this.add.graphics().setDepth(4);
    g.fillStyle(0xd6a15d, 1);
    g.fillRect(0, 292, GAME_WIDTH, 44);
    g.fillStyle(0xf4d77d, 1);
    for (let x = 18; x < GAME_WIDTH; x += 58) g.fillRect(x, 310, 22, 6);

    this.makePrimaryGround(314);
    this.primaryPlayer = this.physics.add.sprite(76, 286, "campus-primary-boy").setDepth(12);
    this.primaryPlayer.setGravityY(CAMPUS_GRAVITY);
    this.primaryPlayer.setCollideWorldBounds(true);
    this.primaryPlayer.body.setSize(18, 26);
    this.primaryPlayer.body.setOffset(7, 13);
    this.physics.add.collider(this.primaryPlayer, this.primaryGroundLeft);
    this.primaryRightGroundCollider = this.physics.add.collider(this.primaryPlayer, this.primaryGroundRight);
    this.primaryPlayer.body.allowGravity = false;

    this.primaryCardsGroup = this.physics.add.staticGroup();
    [
      [216, 252],
      [398, 214],
      [692, 224],
    ].forEach(([x, y], index) => {
      const card = this.primaryCardsGroup.create(x, y, "primary-fragment");
      card.setData("label", `成长碎片 ${index + 1}`);
      card.setDepth(10);
      card.body.setCircle(24, 5, 5);
      card.body.updateFromGameObject();
      this.tweens.add({ targets: card, y: y - 7, duration: 720 + index * 90, yoyo: true, repeat: -1 });
    });

    this.primaryObstacles = this.physics.add.staticGroup();
    [
      { x: 286, y: 284, key: "campus-hurdle", w: 48, h: 46, message: "原来长大后，连操场上都有要跨过去的东西。" },
      { x: 486, y: 282, key: "ultraman-obstacle", w: 44, h: 52, message: "他想成为英雄，可现在连跳过去都很难。" },
      { x: 686, y: 284, key: "homework-obstacle", w: 48, h: 46, message: "作业还没写完，不能出去玩。" },
    ].forEach((obstacle) => {
      this.add.image(obstacle.x, obstacle.y, obstacle.key).setDisplaySize(obstacle.w, obstacle.h).setDepth(9);
      const hitbox = this.add.zone(obstacle.x, obstacle.y + 6, obstacle.w - 16, obstacle.h - 16);
      this.physics.add.existing(hitbox, true);
      hitbox.setData("message", obstacle.message);
      hitbox.body.updateFromGameObject();
      this.primaryObstacles.add(hitbox);
    });

    this.physics.add.overlap(this.primaryPlayer, this.primaryCardsGroup, this.collectPrimaryCard, undefined, this);
    this.physics.add.overlap(this.primaryPlayer, this.primaryObstacles, this.hitPrimaryObstacle, undefined, this);

    this.showCampusDialog("小学：成长碎片", "按左右键移动，空格或上键跳跃。收集 3 个成长碎片后，一直向屏幕右边缘移动进入初中。", "primary-fragment", () => {
      this.dialogOpen = false;
      this.primaryPlayer.body.allowGravity = true;
    });
  }

  collectPrimaryCard(_player, card) {
    if (this.dialogOpen || !card.active) return;
    card.disableBody(true, true);
    this.tweens.killTweensOf(card);
    this.primaryCards += 1;
    this.updateHud(`碎片 ${this.primaryCards} / 3   主动移动`);
    this.showCampusToast(card.x, 148, card.getData("label"));
    if (this.primaryCards >= 3) this.openPrimaryDropExit();
  }

  openPrimaryDropExit() {
    if (this.primaryComplete) return;
    this.primaryComplete = true;
    this.updateHud("向右移动到屏幕边缘");
    this.primaryPlayer.setCollideWorldBounds(false);
    this.showCampusToast(GAME_WIDTH / 2, 76, "碎片收齐，往右边走");
  }

  hitPrimaryObstacle(_player, obstacle) {
    if (this.dialogOpen || this.dangerCooldown) return;
    this.dangerCooldown = true;
    this.dialogOpen = true;
    this.primaryPlayer.setVelocity(0, 0);
    this.primaryTouchDirection = 0;
    this.primaryPlayer.body.allowGravity = false;
    this.cameras.main.shake(140, 0.005);
    this.showCampusDialog("小学障碍", obstacle.getData("message"), "campus-hurdle", () => {
      this.primaryPlayer.setPosition(76, 286);
      this.primaryPlayer.setVelocity(0, 0);
      this.primaryPlayer.body.updateFromGameObject();
      this.primaryPlayer.body.allowGravity = true;
      this.dialogOpen = false;
      this.time.delayedCall(500, () => {
        this.dangerCooldown = false;
      });
    });
  }

  updatePrimary() {
    if (!this.primaryPlayer) return;
    if (this.dialogOpen) {
      this.primaryPlayer.setVelocity(0, 0);
      return;
    }
    if (this.primaryFinishing) return;
    let direction = this.primaryTouchDirection;
    if (this.keys.left.isDown || this.keys.a.isDown) direction -= 1;
    if (this.keys.right.isDown || this.keys.d.isDown) direction += 1;
    direction = Phaser.Math.Clamp(direction, -1, 1);
    this.primaryPlayer.setVelocityX(direction * CAMPUS_RUN_SPEED);

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.space) ||
      Phaser.Input.Keyboard.JustDown(this.keys.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.w)
    ) {
      this.jumpPrimaryPlayer();
    }
    if (this.primaryPlayer.x < 36) this.primaryPlayer.setX(36);
    if (this.primaryComplete && this.primaryPlayer.x > GAME_WIDTH - 34) {
      this.finishPrimaryEdge();
      return;
    }
    if (this.primaryPlayer.x > 794 && !this.primaryComplete) {
      if (this.primaryCards >= 3) {
        this.openPrimaryDropExit();
      } else if (!this.dialogOpen) {
        this.dialogOpen = true;
        this.primaryPlayer.setVelocity(0, 0);
        this.showCampusDialog("碎片还没收齐", "回到起点，再把小学操场上的 3 个碎片都收起来。", "primary-fragment", () => {
          this.primaryPlayer.setPosition(76, 286);
          this.primaryPlayer.setVelocity(0, 0);
          this.primaryTouchDirection = 0;
          this.dialogOpen = false;
        });
      }
    }
  }

  finishPrimaryEdge() {
    if (this.primaryFinishing) return;
    this.primaryFinishing = true;
    this.primaryTouchDirection = 0;
    this.updateHud("进入初中");
    this.showCampusToast(748, 76, "往右走，去初中");
    this.primaryPlayer.setVelocity(180, 0);
    this.tweens.add({ targets: this.primaryPlayer, alpha: 0, duration: 650, ease: "Sine.in" });
    this.phaseTimers.push(
      this.time.delayedCall(780, () => {
        if (this.returnToCoverOnSuccess) this.finishCampusTest();
        else this.startMiddlePhase();
      }),
    );
  }

  jumpPrimaryPlayer() {
    if (!this.primaryPlayer || this.dialogOpen) return;
    if (this.primaryPlayer.body.blocked.down || this.primaryPlayer.body.touching.down) {
      this.primaryPlayer.setVelocityY(CAMPUS_JUMP_SPEED);
    }
  }

  startMiddlePhase() {
    this.clearPhase();
    this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT + 220);
    this.phase = "middle";
    this.middleTouchDirection = 0;
    this.middleFinishing = false;
    this.drawMiddleBackground();
    this.createCampusHud("Middle School", "倒刺 x3 / 滚石 / 霸凌者 / 终点");

    this.middleGround = this.physics.add.staticImage(GAME_WIDTH / 2, 326, "solid-hitbox");
    this.middleGround.setDisplaySize(GAME_WIDTH, 42).setVisible(false).refreshBody();

    this.middlePlayer = this.physics.add.sprite(74, 286, "campus-middle-boy").setDepth(18);
    this.middlePlayer.setGravityY(CAMPUS_GRAVITY);
    this.middlePlayer.setCollideWorldBounds(false);
    this.middlePlayer.body.setSize(18, 30);
    this.middlePlayer.body.setOffset(8, 14);
    this.middlePlayer.body.setMaxVelocity(230, 760);
    this.physics.add.collider(this.middlePlayer, this.middleGround);

    this.middleDangers = this.physics.add.group({ allowGravity: false, immovable: true });
    [
      { x: 210, y: 302, texture: "middle-spikes", message: "有些话像刺一样，听过一次，就会记很久。" },
      { x: 410, y: 302, texture: "middle-spikes", message: "他低下头，以为这样就不会被看见。" },
      { x: 610, y: 302, texture: "middle-spikes", message: "快到出口的时候，心里那根刺反而更清楚。" },
    ].forEach((danger) => this.createMiddleDanger(danger, 54, 28, 5, 10));

    const stoneOne = this.createMiddleDanger(
      { x: 276, y: 290, texture: "rolling-stone", message: "压力滚过来的时候，他只想找个地方躲起来。" },
      34,
      34,
      8,
      8,
    );
    this.tweens.add({ targets: stoneOne, x: 344, angle: 360, duration: 1320, yoyo: true, repeat: -1, ease: "Sine.inOut" });

    const bully = this.createMiddleDanger(
      { x: 470, y: 286, texture: "bully-shadow", message: "他低下头，以为这样就不会被看见。" },
      28,
      34,
      10,
      16,
    );
    this.tweens.add({ targets: bully, x: 550, duration: 1280, yoyo: true, repeat: -1, ease: "Sine.inOut" });

    this.physics.add.overlap(this.middlePlayer, this.middleDangers, this.hitMiddleDanger, undefined, this);

    this.showCampusDialog("初中：躲开阴影", "按方向键移动，点击屏幕左右侧也可以前进。躲开倒刺、滚石和霸凌者后，一直向屏幕右边缘移动进入高中。", "middle-spikes", () => {
      this.dialogOpen = false;
    });
  }

  drawMiddleBackground() {
    const g = this.add.graphics().setDepth(0);
    g.fillStyle(0x93d7ef, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.fillStyle(0xbdebdc, 1);
    g.fillRect(0, 176, GAME_WIDTH, 92);
    g.fillStyle(0x8fcf77, 1);
    g.fillRect(0, 268, GAME_WIDTH, 122);

    g.fillStyle(0xffcf83, 1);
    g.fillRect(56, 82, 226, 144);
    g.fillStyle(0xf1b06d, 1);
    g.fillRect(506, 70, 238, 156);
    g.fillStyle(0xe77b6d, 1);
    g.fillRect(86, 58, 166, 28);
    g.fillRect(532, 46, 186, 30);
    g.fillStyle(0x8fcce6, 1);
    for (let x = 92; x <= 224; x += 42) {
      g.fillRect(x, 104, 20, 18);
      g.fillRect(x, 146, 20, 18);
    }
    for (let x = 548; x <= 684; x += 42) {
      g.fillRect(x, 96, 20, 18);
      g.fillRect(x, 140, 20, 18);
    }

    g.fillStyle(0x789196, 1);
    g.fillRect(0, 306, GAME_WIDTH, 42);
    g.fillStyle(0xe2bc6a, 1);
    g.fillRect(724, 306, 120, 42);
    g.fillStyle(0xfff0a6, 1);
    for (let x = 20; x < 690; x += 54) g.fillRect(x, 322, 24, 5);

    this.add
      .text(GAME_WIDTH / 2, 66, "初中", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "30px",
        fontStyle: "bold",
        color: "#fff8cf",
      })
      .setOrigin(0.5)
      .setShadow(3, 3, "#5c5a37", 2, true, true)
      .setDepth(3);
  }

  createMiddleDanger(config, bodyWidth, bodyHeight, offsetX, offsetY) {
    const danger = this.middleDangers.create(config.x, config.y, config.texture);
    danger.setDepth(16);
    danger.setData("message", config.message);
    danger.body.allowGravity = false;
    danger.body.setImmovable(true);
    danger.body.setSize(bodyWidth, bodyHeight);
    danger.body.setOffset(offsetX, offsetY);
    return danger;
  }

  jumpMiddlePlayer() {
    if (!this.middlePlayer || this.dialogOpen || this.middleFinishing) return;
    if (this.middlePlayer.body.blocked.down || this.middlePlayer.body.touching.down) {
      this.middlePlayer.setVelocityY(CAMPUS_JUMP_SPEED);
    }
  }

  hitMiddleDanger(_player, danger) {
    if (this.dialogOpen || this.dangerCooldown || this.middleFinishing) return;
    this.dangerCooldown = true;
    this.dialogOpen = true;
    this.middlePlayer.setVelocity(0, 0);
    this.middleTouchDirection = 0;
    this.cameras.main.shake(150, 0.006);
    this.showCampusDialog("初中重来", danger.getData("message"), danger.texture.key, () => {
      this.resetMiddleRun();
      this.dialogOpen = false;
      this.time.delayedCall(500, () => {
        this.dangerCooldown = false;
      });
    });
  }

  resetMiddleRun() {
    this.middlePlayer.setPosition(74, 286);
    this.middlePlayer.setVelocity(0, 0);
    this.middlePlayer.body.updateFromGameObject();
  }

  finishMiddleEdge() {
    if (this.middleFinishing) return;
    this.middleFinishing = true;
    this.middleTouchDirection = 0;
    this.updateHud("进入高中");
    this.showCampusToast(748, 78, "往右走，去高中");
    this.middlePlayer.setVelocity(180, 0);
    this.tweens.add({ targets: this.middlePlayer, alpha: 0, duration: 650, ease: "Sine.in" });
    this.phaseTimers.push(
      this.time.delayedCall(780, () => {
        if (this.returnToCoverOnSuccess) this.finishCampusTest();
        else this.startHighPhase();
      }),
    );
  }

  updateMiddle() {
    if (!this.middlePlayer) return;
    if (this.dialogOpen) {
      this.middlePlayer.setVelocityX(0);
      return;
    }
    if (this.middleFinishing) return;

    let direction = this.middleTouchDirection;
    if (this.keys.left.isDown || this.keys.a.isDown) direction -= 1;
    if (this.keys.right.isDown || this.keys.d.isDown) direction += 1;
    direction = Phaser.Math.Clamp(direction, -1, 1);
    this.middlePlayer.setVelocityX(direction * 178);

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.space) ||
      Phaser.Input.Keyboard.JustDown(this.keys.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.w)
    ) {
      this.jumpMiddlePlayer();
    }

    if (this.middlePlayer.x < 34) this.middlePlayer.setX(34);
    if (this.middlePlayer.x > GAME_WIDTH - 34) this.finishMiddleEdge();
    if (this.middlePlayer.y > GAME_HEIGHT + 110) this.resetMiddleRun();
  }

  startHighPhase() {
    this.clearPhase();
    this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.phase = "high";
    this.highRequiredGates = 4;
    this.highPassedGates = 0;
    this.highGateSpeed = 118;
    this.highGateSpawnDelay = 1300;
    this.highGateIndex = 0;
    this.highGateSpawned = 0;
    this.highGateStreamStarted = false;
    this.highGateWaves = [];
    this.highGoalOpen = false;
    this.highFinishing = false;
    this.drawSchoolBackground("高中", 0x9da7c7, 0x455d8c, 0x37425f);
    this.createCampusHud("High School", `横栏 ${this.highPassedGates} / ${this.highRequiredGates}   前往高考`);

    const g = this.add.graphics().setDepth(5);
    g.fillStyle(0xdfeaf1, 0.62);
    for (let y = 82; y <= 318; y += 20) g.fillRect(0, y, GAME_WIDTH, 2);
    g.fillStyle(0x455d8c, 0.18);
    g.fillRect(44, 76, 210, 250);
    g.fillStyle(0xfff0a6, 0.25);
    g.fillRect(726, 82, 74, 240);
    g.fillStyle(0xf4d77d, 1);
    g.fillRect(744, 78, 38, 8);
    g.fillRect(744, 318, 38, 8);
    g.fillStyle(0x17232a, 0.9);
    g.fillRect(736, 104, 54, 44);
    this.highGoalLabel = this.add
      .text(763, 126, "高考", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "18px",
        fontStyle: "bold",
        color: "#ffe79b",
      })
      .setOrigin(0.5)
      .setDepth(7);

    this.highPlayer = this.physics.add.sprite(92, 204, "campus-high-boy").setDepth(18);
    this.highPlayer.setCollideWorldBounds(true);
    this.highPlayer.body.setSize(20, 34);
    this.highPlayer.body.setOffset(8, 16);

    this.highGates = this.physics.add.group({ allowGravity: false, immovable: true });
    this.physics.add.overlap(this.highPlayer, this.highGates, this.hitHighGate, undefined, this);

    this.showCampusDialog("高中：穿过横栏", "自由移动小人，从作业、情书、老师和家庭组成的横栏空隙穿过去。穿过 4 道横栏后，一直走到屏幕右边触发高考。", "homework-obstacle", () => {
      this.dialogOpen = false;
      this.startHighGateStream();
    });
  }

  startHighGateStream() {
    if (this.highGateStreamStarted || this.phase !== "high") return;
    this.highGateStreamStarted = true;
    this.spawnHighGate();
    this.phaseTimers.push(
      this.time.addEvent({
        delay: this.highGateSpawnDelay,
        repeat: Math.max(0, this.highRequiredGates - 2),
        callback: this.spawnHighGate,
        callbackScope: this,
      }),
    );
    this.updateHighHud();
  }

  spawnHighGate() {
    if (this.phase !== "high" || this.dialogOpen || this.completing) return;
    if (this.highGateSpawned >= this.highRequiredGates) return;

    const gapY = [204, 148, 260, 204][this.highGateSpawned % 4];
    const gapHeight = 86;
    const laneStart = 84;
    const laneStep = 28;
    const laneYs = Array.from({ length: 10 }, (_value, index) => laneStart + index * laneStep);
    const pieces = [];
    const gateX = GAME_WIDTH + 68;
    const gateModels = ["homework-obstacle", "love-letter-obstacle", "teacher-obstacle", "family-obstacle"];
    const model = gateModels[this.highGateIndex % gateModels.length];
    this.highGateIndex += 1;
    this.highGateSpawned += 1;

    laneYs.forEach((y) => {
      if (Math.abs(y - gapY) < gapHeight / 2) return;
      const bar = this.highGates.create(gateX, y, model);
      bar.setDepth(17);
      bar.setDisplaySize(34, 38);
      bar.setVelocityX(-this.highGateSpeed);
      bar.body.allowGravity = false;
      bar.body.setImmovable(true);
      bar.body.setSize(24, 26);
      bar.body.setOffset(14, 16);
      pieces.push(bar);
    });

    this.highGateWaves.push({ pieces, counted: false, model });
  }

  hitHighGate(_player, gate) {
    if (this.dangerCooldown || this.dialogOpen || this.phase !== "high") return;
    this.dangerCooldown = true;
    this.dialogOpen = true;
    this.highPlayer.setVelocity(0, 0);
    this.highGates.children.iterate((child) => child?.setVelocity(0, 0));
    this.cameras.main.shake(160, 0.006);
    this.showCampusDialog("高中重来", this.getHighGateFailureText(gate.texture.key), gate.texture.key, () => {
      this.startHighPhase();
    });
  }

  passHighGate(wave) {
    if (!wave || wave.counted) return;
    wave.counted = true;
    const subtitle = this.getHighGateSubtitle(wave.model);
    wave.pieces.forEach((piece) => piece.destroy());
    this.highPassedGates = Math.min(this.highRequiredGates, this.highPassedGates + 1);
    if (subtitle) this.showCampusToast(GAME_WIDTH / 2, 84, subtitle);
    this.updateHighHud();
    if (this.highPassedGates >= this.highRequiredGates) this.openHighGaokaoGate();
  }

  getHighGateSubtitle(textureKey) {
    const subtitles = {
      "homework-obstacle": "写完这一页，还有下一页。",
      "love-letter-obstacle": "有些喜欢，只敢藏在草稿纸背面。",
      "teacher-obstacle": "再坚持一下。",
      "family-obstacle": "我们都是为了你好。",
    };
    return subtitles[textureKey] ?? "";
  }

  getHighGateFailureText(textureKey) {
    const failures = {
      "homework-obstacle": "作业像一道道横栏，写完这一页，还有下一页。",
      "love-letter-obstacle": "有些喜欢只敢藏起来，走神的一瞬间就会被拦住。",
      "teacher-obstacle": "老师说再坚持一下，可他已经快喘不过气。",
      "family-obstacle": "那句“都是为了你好”，有时候也会变成看不见的墙。",
    };
    return failures[textureKey] ?? "横栏挡住了去路，找准空隙再穿一次。";
  }

  updateHighHud() {
    if (this.highGoalOpen) {
      this.updateHud("横栏通过   走到右侧高考");
      return;
    }
    this.updateHud(`横栏 ${this.highPassedGates} / ${this.highRequiredGates}   前往高考`);
  }

  openHighGaokaoGate() {
    if (this.highGoalOpen) return;
    this.highGoalOpen = true;
    this.updateHighHud();
    this.showCampusToast(720, 78, "横栏通过，去右侧高考");
    this.highGoalLabel?.setColor("#ffffff");
    this.highGoalLabel?.setShadow(0, 0, "#ffe79b", 8, true, true);
  }

  getHighPlayerMaxX() {
    return this.highGoalOpen ? GAME_WIDTH - 34 : GAME_WIDTH - 116;
  }

  triggerGaokaoScene() {
    if (this.highFinishing || this.completing) return;
    this.highFinishing = true;
    this.completing = true;
    this.input.enabled = false;
    this.updateHud("高考开始");
    this.phaseTimers.forEach((timer) => timer.remove(false));
    this.phaseTimers = [];
    this.clearHighGates();
    this.highPlayer.setVelocity(0, 0);
    this.showCampusToast(734, 78, "高考来了");
    this.tweens.add({
      targets: this.highPlayer,
      x: GAME_WIDTH + 28,
      duration: 720,
      ease: "Sine.in",
    });
    this.phaseTimers.push(
      this.time.delayedCall(820, () => {
        this.cameras.main.fadeOut(760, 12, 18, 24);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          this.scene.start("GaokaoScene", { returnToCoverOnSuccess: this.returnToCoverOnSuccess });
        });
      }),
    );
  }

  clearHighGates() {
    if (!this.highGates) return;
    this.highGates.clear(true, true);
    this.highGateWaves = [];
  }

  updateHigh() {
    if (!this.highPlayer || this.dialogOpen || this.highFinishing) {
      if (this.highPlayer) this.highPlayer.setVelocity(0, 0);
      return;
    }
    if (!this.highGateStreamStarted) this.startHighGateStream();

    const velocity = new Phaser.Math.Vector2(0, 0);
    if (this.keys.left.isDown || this.keys.a.isDown) velocity.x -= 1;
    if (this.keys.right.isDown || this.keys.d.isDown) velocity.x += 1;
    if (this.keys.up.isDown || this.keys.w.isDown) velocity.y -= 1;
    if (this.keys.down.isDown || this.keys.s.isDown) velocity.y += 1;
    if (this.input.activePointer.isDown) {
      const pointer = this.input.activePointer;
      velocity.set(pointer.worldX - this.highPlayer.x, pointer.worldY - this.highPlayer.y);
    }
    if (velocity.lengthSq() > 0) {
      velocity.normalize().scale(205);
      this.highPlayer.setVelocity(velocity.x, velocity.y);
    } else {
      this.highPlayer.setVelocity(0, 0);
    }

    const maxX = this.getHighPlayerMaxX();
    this.highPlayer.setPosition(
      Phaser.Math.Clamp(this.highPlayer.x, 42, maxX),
      Phaser.Math.Clamp(this.highPlayer.y, 72, 334),
    );
    this.updateHighGateProgress();
    if (!this.highGoalOpen && this.highPlayer.x >= maxX - 2) this.updateHighHud();
    if (this.highGoalOpen && this.highPlayer.x >= GAME_WIDTH - 44) this.triggerGaokaoScene();
  }

  updateHighGateProgress() {
    if (!this.highGateWaves?.length) return;

    this.highGateWaves.forEach((wave) => {
      if (wave.counted) return;
      const pieces = wave.pieces.filter((piece) => piece.active);
      if (pieces.length === 0) return;

      const gateX = pieces.reduce((sum, piece) => sum + piece.x, 0) / pieces.length;
      if (gateX < this.highPlayer.x - 58) {
        this.passHighGate(wave);
        return;
      }

      pieces.forEach((piece) => {
        if (piece.x < -90) piece.destroy();
      });
    });

    this.highGateWaves = this.highGateWaves.filter((wave) => !wave.counted && wave.pieces.some((piece) => piece.active));
  }

  finishCampusRun() {
    if (this.completing) return;
    this.completing = true;
    this.input.enabled = false;
    this.cameras.main.fadeOut(900, 12, 18, 24);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start("ChapterProgressScene", {
        chapter: 3,
        status: "enter",
        nextScene: "ChapterThreeScene",
      });
    });
  }

  returnToCover() {
    if (this.completing) return;
    this.completing = true;
    this.input.enabled = false;
    clearDevTestRoute();
    this.cameras.main.fadeOut(320, 12, 18, 24);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start("StartScene");
    });
  }

  finishCampusTest() {
    if (this.completing) return;
    this.completing = true;
    this.input.enabled = false;
    this.showCampusToast(GAME_WIDTH / 2, 90, "测试通过，回到封面");
    this.time.delayedCall(480, () => {
      this.cameras.main.fadeOut(360, 12, 18, 24);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        clearDevTestRoute();
        this.scene.start("StartScene");
      });
    });
  }

  handleCampusPointer(pointer) {
    if (this.phase === "primary" && !this.dialogOpen) {
      this.primaryTouchDirection = pointer.worldX < GAME_WIDTH / 2 ? -1 : 1;
      if (pointer.worldY < GAME_HEIGHT * 0.58) this.jumpPrimaryPlayer();
    }
    if (this.phase === "middle" && !this.dialogOpen) {
      this.middleTouchDirection = pointer.worldX < GAME_WIDTH / 2 ? -1 : 1;
      if (pointer.worldY < GAME_HEIGHT * 0.58) this.jumpMiddlePlayer();
    }
  }

  handleCampusPointerMove(pointer) {
    if (this.phase === "primary" && pointer.isDown && !this.dialogOpen) {
      this.primaryTouchDirection = pointer.worldX < GAME_WIDTH / 2 ? -1 : 1;
      return;
    }
    if (this.phase === "middle" && pointer.isDown && !this.dialogOpen) {
      this.middleTouchDirection = pointer.worldX < GAME_WIDTH / 2 ? -1 : 1;
      return;
    }
    if (this.phase !== "high" || !pointer.isDown || this.dialogOpen || !this.highPlayer) return;
    this.highPlayer.setPosition(
      Phaser.Math.Clamp(pointer.worldX, 42, this.getHighPlayerMaxX()),
      Phaser.Math.Clamp(pointer.worldY, 72, 322),
    );
  }

  handleCampusPointerUp() {
    if (this.phase === "primary") this.primaryTouchDirection = 0;
    if (this.phase === "middle") this.middleTouchDirection = 0;
  }

  showCampusDialog(titleText, bodyText, texture, onDone) {
    this.dialogOpen = true;
    const overlay = this.add.container(0, 0).setDepth(84).setScrollFactor(0);
    const shade = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x05080b, 0.58);
    const panel = this.add.rectangle(GAME_WIDTH / 2, 196, 512, 226, 0x17232a, 0.98);
    panel.setStrokeStyle(3, 0xf4d77d, 0.92);
    const icon = this.add.image(GAME_WIDTH / 2, 104, texture).setScale(texture === "high-plane" ? 1.24 : 1);
    const title = this.add
      .text(GAME_WIDTH / 2, 150, titleText, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "20px",
        fontStyle: "bold",
        color: "#ffe79b",
      })
      .setOrigin(0.5);
    const body = this.add
      .text(GAME_WIDTH / 2, 204, bodyText, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "18px",
        color: "#fff7dd",
        align: "center",
        lineSpacing: 8,
        wordWrap: { width: 406, useAdvancedWrap: true },
      })
      .setOrigin(0.5);
    const button = this.makeCampusButton(GAME_WIDTH / 2, 286, 126, "继续", () => {
      overlay.destroy();
      onDone();
    });
    overlay.add([shade, panel, icon, title, body, button]);
  }

  showCampusToast(x, y, message) {
    const toast = this.add
      .text(x, y, message, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "16px",
        fontStyle: "bold",
        color: "#fff8dd",
        align: "center",
        wordWrap: { width: 300, useAdvancedWrap: true },
      })
      .setOrigin(0.5)
      .setDepth(42)
      .setShadow(2, 2, "#17232a", 2, true, true);
    this.tweens.add({
      targets: toast,
      y: y - 22,
      alpha: 0,
      duration: 1500,
      ease: "Sine.inOut",
      onComplete: () => toast.destroy(),
    });
  }

  makeCampusButton(x, y, width, label, onClick) {
    const button = this.add.container(x, y).setScrollFactor(0);
    const bg = this.add.rectangle(0, 0, width, 46, 0xf4d77d, 1);
    bg.setStrokeStyle(2, 0x6c4826, 0.86);
    const text = this.add
      .text(0, 0, label, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "18px",
        fontStyle: "bold",
        color: "#17232a",
      })
      .setOrigin(0.5);
    button.add([bg, text]);
    button.setSize(width + 10, 54);
    button.setInteractive({ useHandCursor: true });
    button.on("pointerdown", () => bg.setFillStyle(0xffecae));
    button.on("pointerup", onClick);
    return button;
  }

  update() {
    if (this.phase === "primary") this.updatePrimary();
    if (this.phase === "middle") this.updateMiddle();
    if (this.phase === "high") this.updateHigh();
  }
}

class GaokaoScene extends Phaser.Scene {
  constructor() {
    super("GaokaoScene");
    this.returnToCoverOnSuccess = false;
  }

  init(data = {}) {
    this.returnToCoverOnSuccess = Boolean(data.returnToCoverOnSuccess);
  }

  create() {
    loadSceneAssets(this, gaokaoSceneAssets, () => this.createLoaded());
  }

  createLoaded() {
    this.quizIndex = 0;
    this.score = 0;
    this.answerLocked = false;
    this.optionButtons = [];
    this.gaokaoQuestions = [
      {
        subject: "英语",
        question: "In “smartphones are ubiquitous on campus”, “ubiquitous” is closest in meaning to:",
        options: ["rare", "common everywhere", "costly", "short-lived"],
        answer: 1,
      },
      {
        subject: "数学",
        question: "函数 f(x)=x^2-4x+3 在区间 [0,4] 上的最小值是：",
        options: ["-1", "0", "1", "3"],
        answer: 0,
      },
      {
        subject: "语文",
        question: "《红楼梦》中，“金陵十二钗正册”判词里写“可叹停机德，堪怜咏絮才”，分别暗指哪两位女子？",
        options: ["王熙凤、巧姐", "薛宝钗、林黛玉", "史湘云、妙玉", "秦可卿、李纨"],
        answer: 1,
      },
    ];

    this.paintGaokaoClassroom();
    this.createGaokaoBoard();
    this.createGaokaoKeyboard();
    this.showGaokaoQuestion();
    this.cameras.main.fadeIn(420, 12, 18, 24);
  }

  paintGaokaoClassroom() {
    const source = this.textures.get("gaokao-background").getSourceImage();
    const scale = Math.max(GAME_WIDTH / source.width, GAME_HEIGHT / source.height);
    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "gaokao-background").setScale(scale).setDepth(0);
    bg.setDisplaySize(source.width * scale, source.height * scale);

    const shade = this.add.graphics().setDepth(1);
    shade.fillStyle(0x081018, 0.04);
    shade.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    shade.fillStyle(0x05080b, 0.28);
    shade.fillRect(0, 224, GAME_WIDTH, 166);
  }

  createGaokaoBoard() {
    this.answerPanel = this.add.container(0, 0).setDepth(12);
    const panelBg = this.add.rectangle(GAME_WIDTH / 2, 306, 804, 156, 0x10191f, 0.9);
    panelBg.setStrokeStyle(3, 0xf4d77d, 0.88);
    const panelLine = this.add.rectangle(GAME_WIDTH / 2, 236, 742, 2, 0xffe0a1, 0.36);
    this.answerPanel.add([panelBg, panelLine]);

    this.questionText = this.add
      .text(GAME_WIDTH / 2, 268, "", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "17px",
        fontStyle: "bold",
        color: "#fff4c4",
        align: "center",
        lineSpacing: 4,
        wordWrap: { width: 700, useAdvancedWrap: true },
      })
      .setOrigin(0.5)
      .setDepth(14);

    this.feedbackText = this.add
      .text(GAME_WIDTH / 2, 374, "", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "14px",
        fontStyle: "bold",
        color: "#ffe79b",
        align: "center",
        wordWrap: { width: 620, useAdvancedWrap: true },
      })
      .setOrigin(0.5)
      .setDepth(14);

    const buttonPositions = [
      [226, 318],
      [618, 318],
      [226, 352],
      [618, 352],
    ];
    this.optionButtons = buttonPositions.map(([x, y], index) => this.makeAnswerButton(x, y, index));
  }

  createGaokaoKeyboard() {
    this.keyboardHandler = (event) => {
      const key = event.key?.toUpperCase();
      const optionIndex = ["A", "B", "C", "D"].indexOf(key);
      if (optionIndex >= 0) this.chooseAnswer(optionIndex);
    };
    this.input.keyboard.on("keydown", this.keyboardHandler);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard.off("keydown", this.keyboardHandler);
    });
  }

  showGaokaoQuestion() {
    const question = this.gaokaoQuestions[this.quizIndex];
    this.answerLocked = false;
    this.questionText.setText(question.question);
    this.feedbackText.setText("");

    this.optionButtons.forEach((button, index) => {
      const label = ["A", "B", "C", "D"][index];
      button.bg.setFillStyle(0xf7e6b1, 1);
      button.bg.setStrokeStyle(2, 0xf4d77d, 0.9);
      button.text.setColor("#17232a");
      button.text.setText(`${label}. ${question.options[index]}`);
      button.container.setVisible(true);
      button.container.setInteractive({ useHandCursor: true });
    });
  }

  chooseAnswer(optionIndex) {
    if (this.answerLocked || optionIndex < 0 || optionIndex > 3) return;
    const question = this.gaokaoQuestions[this.quizIndex];
    const selected = this.optionButtons[optionIndex];

    this.answerLocked = true;
    const isCorrect = optionIndex === question.answer;
    if (isCorrect) this.score += 1;
    selected.bg.setFillStyle(0xffefb0, 1);
    selected.bg.setStrokeStyle(2, 0xffffff, 0.95);
    selected.text.setColor("#17232a");
    this.feedbackText.setText("");
    this.transitionToNextExam();
  }

  transitionToNextExam() {
    this.time.delayedCall(420, () => this.nextGaokaoQuestion());
  }

  nextGaokaoQuestion() {
    this.quizIndex += 1;
    if (this.quizIndex >= this.gaokaoQuestions.length) {
      this.finishGaokaoQuiz();
      return;
    }
    this.showGaokaoQuestion();
  }

  finishGaokaoQuiz() {
    this.answerLocked = true;
    this.optionButtons.forEach((button) => {
      button.container.disableInteractive?.();
    });
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.optionButtons.forEach((button) => button.container.destroy());
      this.optionButtons = [];
      this.answerPanel?.destroy();
      this.questionText?.destroy();
      this.feedbackText?.destroy();
      this.showClockTowerEnding();
      this.cameras.main.fadeIn(900, 0, 0, 0);
    });
    this.cameras.main.fadeOut(1100, 0, 0, 0);
  }

  returnToCoverAfterTest() {
    clearDevTestRoute();
    this.cameras.main.fadeOut(320, 12, 18, 24);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start("StartScene");
    });
  }

  showClockTowerEnding() {
    const source = this.textures.get("clock-tower-background").getSourceImage();
    const scale = Math.max(GAME_WIDTH / source.width, GAME_HEIGHT / source.height);
    const imageHeight = source.height * scale;
    const centerY = imageHeight / 2 - 28;

    this.clockTowerLayer = this.add.container(0, 0).setDepth(30);
    const backdrop = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x72c4f2, 1);
    const tower = this.add.image(GAME_WIDTH / 2, centerY, "clock-tower-background").setScale(scale);
    const shade = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x05080b, 0.08);
    this.clockTowerLayer.add([backdrop, tower, shade]);
    this.playClockTowerBgm();
    this.time.delayedCall(6200, () => this.leaveClockTowerEnding());
  }

  leaveClockTowerEnding() {
    this.stopClockTowerBgm();
    this.cameras.main.fadeOut(820, 12, 18, 24);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      if (this.returnToCoverOnSuccess) {
        clearDevTestRoute();
        this.scene.start("StartScene");
        return;
      }
      this.scene.start("ChapterProgressScene", {
        chapter: 3,
        status: "enter",
        nextScene: "ChapterThreeScene",
      });
    });
  }

  playClockTowerBgm() {
    if (typeof window === "undefined") return;
    this.stopClockTowerBgm();
    pauseBackgroundMusic();
    const audio = new Audio(clockBellTrackPath);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.72;
    audio.play().catch(() => {});
    this.clockTowerBgm = { audio };
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.stopClockTowerBgm());
  }

  stopClockTowerBgm() {
    if (!this.clockTowerBgm) return;
    const { audio } = this.clockTowerBgm;
    audio.pause();
    try {
      audio.currentTime = 0;
    } catch {}
    this.clockTowerBgm = undefined;
    resumeBackgroundMusic();
  }

  makeAnswerButton(x, y, index) {
    const container = this.add.container(x, y).setDepth(14);
    const bg = this.add.rectangle(0, 0, 268, 30, 0xf7e6b1, 1);
    bg.setStrokeStyle(2, 0xf4d77d, 0.9);
    const text = this.add
      .text(0, 0, "", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "13px",
        fontStyle: "bold",
        color: "#17232a",
        align: "center",
        wordWrap: { width: 238, useAdvancedWrap: true },
      })
      .setOrigin(0.5);
    container.add([bg, text]);
    container.setSize(278, 34);
    container.setInteractive({ useHandCursor: true });
    container.on("pointerdown", () => {
      if (!this.answerLocked) bg.setFillStyle(0xfff1c4, 1);
    });
    container.on("pointerout", () => {
      if (!this.answerLocked) bg.setFillStyle(0xf7e6b1, 1);
    });
    container.on("pointerup", () => this.chooseAnswer(index));
    return { container, bg, text };
  }

}

class ChapterThreeScene extends Phaser.Scene {
  constructor() {
    super("ChapterThreeScene");
    this.returnToCoverOnSuccess = false;
  }

  init(data = {}) {
    this.returnToCoverOnSuccess = Boolean(data.returnToCoverOnSuccess);
  }

  create() {
    loadSceneAssets(this, lostSceneAssets, () => this.createLoaded());
  }

  createLoaded() {
    this.corruption = 0;
    this.maxCorruption = 100;
    this.mode = "absorb";
    this.survivalMs = 0;
    this.survivalDurationMs = 10000;
    this.nextEnemyAt = 300;
    this.lastHitAt = -1000;
    this.endingActive = false;
    this.bookAvailable = false;
    this.modalOpen = false;
    this.seenLostTemptations = new Set();
    this.basePlayerSpeed = 150;
    this.playerSpeed = this.basePlayerSpeed;
    this.minPlayerSpeed = 66;
    this.speedLossPerCollect = 10;
    this.completing = false;
    this.roomBounds = new Phaser.Geom.Rectangle(44, 66, GAME_WIDTH - 88, GAME_HEIGHT - 108);

    this.physics.world.setBounds(this.roomBounds.x, this.roomBounds.y, this.roomBounds.width, this.roomBounds.height);
    this.createDormGroups();
    this.paintDormRoom();
    this.createDormPlayer();
    this.createUniversityHud();
    this.createDormInput();
    this.createDormCollisions();
    this.showLostStartSubtitle();
    this.cameras.main.fadeIn(420, 12, 18, 24);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.restoreDormAudio());
  }

  update(time, delta) {
    if (!this.player || this.completing) return;

    this.updateUniversityHud();
    this.updateDormMood();

    if (this.modalOpen) {
      this.player.setVelocity(0, 0);
      return;
    }

    if (this.endingActive) {
      this.player.setVelocity(0, 0);
      return;
    }

    if (this.mode === "dodge") {
      this.survivalMs = Math.min(this.survivalDurationMs, this.survivalMs + delta);
      if (this.survivalMs >= this.survivalDurationMs) {
        this.showGoldenBook();
        return;
      }
    }

    this.handleDormSpawns(time);
    this.updatePlayerMovement(time);
    this.updateDormEnemies(time);
  }

  createDormGroups() {
    this.enemies = this.physics.add.group({ allowGravity: false });
  }

  paintDormRoom() {
    const source = this.textures.get("lost-background").getSourceImage();
    const scale = Math.max(GAME_WIDTH / source.width, GAME_HEIGHT / source.height);
    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "lost-background").setScale(scale).setDepth(0);
    bg.setDisplaySize(source.width * scale, source.height * scale);

    this.computerGlow = this.add.rectangle(GAME_WIDTH - 110, 74, 72, 40, 0x78d8ff, 0).setDepth(2);
    this.computerGlow.setBlendMode(Phaser.BlendModes.ADD);
    this.computerOff = this.add.rectangle(GAME_WIDTH - 110, 74, 72, 40, 0x0b1118, 0).setDepth(3);
    this.lampGlow = this.add.circle(106, 86, 48, 0xffe79b, 0).setDepth(2);
    this.lampGlow.setBlendMode(Phaser.BlendModes.ADD);

    this.darkOverlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x05080b, 0.06).setDepth(45);
    this.damageFlash = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xe85c68, 0).setDepth(56);
  }

  createDormPlayer() {
    this.player = this.physics.add.sprite(GAME_WIDTH / 2, 232, "lost-character").setDisplaySize(128, 86).setDepth(20);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(320, 430, true);
  }

  createUniversityHud() {
    this.add
      .text(48, 28, "腐败值", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "14px",
        fontStyle: "bold",
        color: "#fff4c4",
      })
      .setOrigin(0.5)
      .setShadow(2, 2, "#05080b", 3, true, true)
      .setDepth(61);
    this.selfBarBack = this.add.rectangle(146, 28, 124, 12, 0x16242c, 0.74).setDepth(61);
    this.selfBar = this.add.rectangle(84, 28, 124, 12, 0xe85c68, 1).setOrigin(0, 0.5).setDepth(62);
    this.selfText = this.add
      .text(236, 28, "0", {
        fontFamily: "Courier New, monospace",
        fontSize: "14px",
        fontStyle: "bold",
        color: "#ffe79b",
      })
      .setOrigin(0.5)
      .setShadow(2, 2, "#05080b", 3, true, true)
      .setDepth(62);

    this.timerText = this.add
      .text(GAME_WIDTH / 2, 28, "", {
        fontFamily: "Courier New, monospace",
        fontSize: "23px",
        fontStyle: "bold",
        color: "#ffe79b",
      })
      .setOrigin(0.5)
      .setShadow(2, 2, "#05080b", 3, true, true)
      .setDepth(62);

    this.makeDormButton(790, 28, 76, 32, "封面", () => this.returnToCover(), 62);
    this.updateUniversityHud();
  }

  createDormInput() {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.touchStart = null;
    this.touchVector = new Phaser.Math.Vector2(0, 0);
    this.input.on("pointerdown", (pointer) => {
      if (this.modalOpen || this.endingActive) return;
      this.touchStart = { x: pointer.x, y: pointer.y };
      this.touchVector.set(0, 0);
    });
    this.input.on("pointermove", (pointer) => {
      if (!this.touchStart) return;
      this.touchVector.set(pointer.x - this.touchStart.x, pointer.y - this.touchStart.y);
      if (this.touchVector.length() > 64) this.touchVector.setLength(64);
    });
    const clearTouch = () => {
      this.touchStart = null;
      this.touchVector.set(0, 0);
    };
    this.input.on("pointerup", clearTouch);
    this.input.on("pointercancel", clearTouch);
  }

  createDormCollisions() {
    this.physics.add.overlap(this.player, this.enemies, this.handleDormEnemyHit, undefined, this);
  }

  showLostStartSubtitle() {
    this.showLostConfirmModal(
      "我要吃外卖，睡懒觉，刷视频，问父母要钱，享受快乐自由的大学生活",
      () => {
        this.createLostCollectibles();
      },
    );
  }

  showLostConfirmModal(message, onConfirm, buttonLabel = "确定") {
    this.modalOpen = true;
    this.player?.setVelocity(0, 0);
    const modal = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2).setDepth(92);
    const shade = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x05080b, 0.56);
    const panel = this.add.rectangle(0, 0, 706, 154, 0x10191f, 0.94);
    panel.setStrokeStyle(3, 0xf4d77d, 0.78);
    const text = this.add
      .text(
        0,
        -24,
        message,
        {
          fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
          fontSize: "18px",
          fontStyle: "bold",
          color: "#fff8dd",
          align: "center",
          lineSpacing: 6,
          wordWrap: { width: 612, useAdvancedWrap: true },
        },
      )
      .setOrigin(0.5);

    const button = this.add.container(0, 52);
    const buttonBg = this.add.rectangle(0, 0, 126, 38, 0xf4d77d, 0.98);
    buttonBg.setStrokeStyle(2, 0x704b2a, 0.9);
    const buttonText = this.add
      .text(0, 0, "确定", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "17px",
        fontStyle: "bold",
        color: "#132129",
      })
      .setOrigin(0.5);
    buttonText.setText(buttonLabel);
    button.add([buttonBg, buttonText]);
    button.setSize(136, 48);
    button.setInteractive({ useHandCursor: true });
    button.on("pointerdown", () => buttonBg.setFillStyle(0xffefb0, 1));
    button.on("pointerup", () => {
      buttonBg.setFillStyle(0xf4d77d, 0.98);
      this.startDormHum();
      modal.destroy();
      this.modalOpen = false;
      onConfirm?.();
    });

    modal.add([shade, panel, text, button]);
  }

  updateUniversityHud() {
    if (!this.selfBar || !this.timerText) return;
    const ratio = Phaser.Math.Clamp(this.corruption / this.maxCorruption, 0, 1);
    this.selfBar.setDisplaySize(124 * ratio, 12);
    this.selfBar.setFillStyle(ratio < 0.5 ? 0xf4d77d : 0xe85c68, 1);
    this.selfText.setText(String(Math.ceil(this.corruption)));
    if (this.mode !== "dodge") {
      this.timerText.setText("");
      return;
    }
    const secondsLeft = Math.max(0, Math.ceil((this.survivalDurationMs - this.survivalMs) / 1000));
    const hudLabel = secondsLeft > 7 ? "呼吸" : secondsLeft > 4 ? "清醒" : secondsLeft > 0 ? "站起来" : "重新开始";
    this.timerText.setText(`${hudLabel} ${secondsLeft}s`);
  }

  updatePlayerMovement(time) {
    const direction = new Phaser.Math.Vector2(0, 0);
    if (this.keys.left.isDown || this.keys.a.isDown) direction.x -= 1;
    if (this.keys.right.isDown || this.keys.d.isDown) direction.x += 1;
    if (this.keys.up.isDown || this.keys.w.isDown) direction.y -= 1;
    if (this.keys.down.isDown || this.keys.s.isDown) direction.y += 1;
    if (direction.lengthSq() === 0 && this.touchVector.length() > 8) {
      direction.copy(this.touchVector).normalize();
    }
    if (direction.lengthSq() > 0) direction.normalize();

    const speed = this.playerSpeed;
    this.player.setVelocity(direction.x * speed, direction.y * speed);
    if (direction.x !== 0) this.player.setFlipX(direction.x < 0);
  }

  handleDormSpawns(time) {
    if (this.endingActive || this.bookAvailable) return;

    if (this.mode === "absorb" || this.mode === "dodge") {
      if (time >= this.nextEnemyAt) {
        this.spawnLostCollectible();
        const progress = this.getCorruptionProgress();
        const interval = Phaser.Math.Linear(920, 430, progress);
        this.nextEnemyAt = time + interval + Phaser.Math.Between(-70, 90);
      }
      return;
    }
  }

  getCorruptionProgress() {
    return Phaser.Math.Clamp(this.corruption / this.maxCorruption, 0, 1);
  }

  getDormProgress() {
    return this.mode === "absorb" ? this.getCorruptionProgress() : Phaser.Math.Clamp(this.survivalMs / this.survivalDurationMs, 0, 1);
  }

  updateDormEnemies(time) {
    if (this.endingActive) {
      this.stopDormThreats(false);
      return;
    }

    this.enemies.children.iterate((enemy) => {
      if (!enemy?.active) return;
      const type = enemy.getData("type");
      const bornAt = enemy.getData("bornAt") ?? time;
      const collectible = enemy.getData("collectible");
      if (!collectible && time - bornAt > 12500) {
        enemy.destroy();
        return;
      }

      if (this.mode === "absorb" && collectible) {
        this.keepCollectibleMoving(enemy);
        return;
      }

      if (this.mode !== "dodge") {
        enemy.setVelocity(0, 0);
        return;
      }

      this.keepCollectibleMoving(enemy);
    });
  }

  stopDormThreats(clear = true) {
    if (!this.enemies) return;
    this.enemies.children.iterate((enemy) => {
      if (!enemy?.active) return;
      enemy.setVelocity(0, 0);
      if (clear) enemy.destroy();
    });
  }

  createLostCollectibles() {
    this.enemies.clear(true, true);
    this.playerSpeed = this.basePlayerSpeed;
    this.nextEnemyAt = this.time.now + 720;
    this.collectibleLayout = [
      ["balance", 118, 116],
      ["video", 282, 104],
      ["takeout", 716, 122],
      ["game", 594, 304],
      ["sleep", 128, 246],
    ];
    this.collectibleLayout.forEach(([type, x, y]) => this.createLostElement(type, x, y, true));
  }

  spawnLostCollectible() {
    if (this.enemies.countActive(true) >= 42 || (this.mode !== "absorb" && this.mode !== "dodge")) return null;
    const roll = Math.random();
    const type =
      roll < 0.24 ? "game" : roll < 0.45 ? "sleep" : roll < 0.66 ? "takeout" : roll < 0.88 ? "video" : "balance";
    const spot = this.randomDormInteriorPoint(118);
    return this.createLostElement(type, spot.x, spot.y, true);
  }

  createLostElement(type, x, y, collectible) {
    const config = this.getDormEnemyConfig(type);
    if (!config) return null;
    const enemy = this.enemies.create(x, y, config.texture);
    enemy.setDepth(config.depth ?? 16);
    enemy.setData("type", type);
    enemy.setData("absorbValue", config.absorbValue);
    enemy.setData("collectible", collectible);
    enemy.setData("bornAt", this.time.now);
    enemy.setData("lastHitAt", -1000);
    if (config.displayWidth && config.displayHeight) enemy.setDisplaySize(config.displayWidth, config.displayHeight);
    enemy.setSize(config.bodyWidth, config.bodyHeight, true);
    enemy.setVelocity(0, 0);
    if (collectible) {
      enemy.setCollideWorldBounds(true);
      enemy.setBounce(1, 1);
      this.startCollectibleDrift(enemy, config, this.getCorruptionProgress());
    }
    return enemy;
  }

  startCollectibleDrift(enemy, config, progress = 0) {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const minSpeed = Math.floor(34 + progress * 18);
    const maxSpeed = Math.max(minSpeed + 4, Math.floor(config.absorbSpeed * (0.62 + progress * 0.3)));
    const speed = Phaser.Math.Between(minSpeed, maxSpeed);
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    enemy.setVelocity(vx, vy);
    enemy.setData("driftSpeed", speed);
  }

  keepCollectibleMoving(enemy) {
    if (!enemy.body) return;
    const velocity = enemy.body.velocity;
    const speed = enemy.getData("driftSpeed") ?? 44;
    if (velocity.lengthSq() < 64) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      enemy.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    }
  }

  getDormEnemyConfig(type) {
    const configs = {
      game: {
        texture: this.textures.exists("lost-game-control") ? "lost-game-control" : "dorm-enemy-game",
        displayWidth: 148,
        displayHeight: 100,
        bodyWidth: 74,
        bodyHeight: 50,
        absorbValue: 10,
        absorbSpeed: 74,
        dodgeSpeed: 142,
      },
      sleep: {
        texture: this.textures.exists("lost-sleepy-air") ? "lost-sleepy-air" : "dorm-enemy-sleep",
        displayWidth: 144,
        displayHeight: 102,
        bodyWidth: 72,
        bodyHeight: 50,
        absorbValue: 8,
        absorbSpeed: 62,
        dodgeSpeed: 124,
      },
      takeout: {
        texture: this.textures.exists("lost-takeout") ? "lost-takeout" : "dorm-enemy-takeout",
        displayWidth: 144,
        displayHeight: 102,
        bodyWidth: 72,
        bodyHeight: 50,
        absorbValue: 9,
        absorbSpeed: 68,
        dodgeSpeed: 132,
      },
      video: {
        texture: this.textures.exists("lost-phone") ? "lost-phone" : "dorm-enemy-video",
        displayWidth: 104,
        displayHeight: 148,
        bodyWidth: 52,
        bodyHeight: 74,
        absorbValue: 11,
        absorbSpeed: 88,
        dodgeSpeed: 164,
      },
      balance: {
        texture: this.textures.exists("lost-wallet") ? "lost-wallet" : "dorm-enemy-balance",
        displayWidth: 150,
        displayHeight: 150,
        bodyWidth: 76,
        bodyHeight: 76,
        absorbValue: 16,
        absorbSpeed: 96,
        dodgeSpeed: 184,
        depth: 19,
      },
    };
    return configs[type] ?? configs.game;
  }

  randomDormEdgePoint(margin) {
    const side = Phaser.Math.Between(0, 3);
    if (side === 0) return { x: Phaser.Math.Between(60, GAME_WIDTH - 60), y: this.roomBounds.top - margin };
    if (side === 1) return { x: Phaser.Math.Between(60, GAME_WIDTH - 60), y: this.roomBounds.bottom + margin };
    if (side === 2) return { x: this.roomBounds.left - margin, y: Phaser.Math.Between(84, 318) };
    return { x: this.roomBounds.right + margin, y: Phaser.Math.Between(84, 318) };
  }

  randomDormInteriorPoint(minDistanceFromPlayer = 96) {
    let point = { x: this.roomBounds.centerX, y: this.roomBounds.centerY };
    for (let i = 0; i < 16; i += 1) {
      point = {
        x: Phaser.Math.Between(this.roomBounds.left + 48, this.roomBounds.right - 48),
        y: Phaser.Math.Between(this.roomBounds.top + 44, this.roomBounds.bottom - 44),
      };
      if (Phaser.Math.Distance.Between(point.x, point.y, this.player.x, this.player.y) >= minDistanceFromPlayer) return point;
    }
    return point;
  }

  handleActionHit(bolt, enemy) {
    if (!bolt?.active || !enemy?.active) return;
    bolt.destroy();
    if (enemy.getData("type") === "balance") return;
    const hp = (enemy.getData("hp") ?? 1) - 1;
    enemy.setData("hp", hp);
    enemy.setTint(0xfff5bf);
    this.time.delayedCall(80, () => enemy?.active && enemy.clearTint());
    if (hp <= 0) enemy.destroy();
  }

  handleDormEnemyHit(player, enemy) {
    if (!enemy?.active || this.endingActive || this.bookAvailable) return;
    const now = this.time.now;
    if (this.mode === "absorb") {
      this.absorbDormEnemy(enemy);
      return;
    }

    if (now - this.lastHitAt < 420) return;
    this.lastHitAt = now;
    this.survivalDurationMs += 5000;
    this.updateUniversityHud();
    this.showLostFloatingText(enemy.x, enemy.y - 38, "旧习惯又追上来了。");
    this.showDamageFlash();
    enemy.destroy();
  }

  absorbDormEnemy(enemy) {
    const value = enemy.getData("absorbValue") ?? 8;
    const x = enemy.x;
    const y = enemy.y;
    const type = enemy.getData("type");
    this.playerSpeed = Math.max(this.minPlayerSpeed, this.playerSpeed - this.speedLossPerCollect);
    this.showLostTemptation(type, x, y);
    this.changeCorruption(value);
    this.showAbsorbPulse(x, y);
    if (enemy.active) enemy.destroy();
  }

  showLostTemptation(type, x, y) {
    if (!type || this.seenLostTemptations.has(type)) return;
    this.seenLostTemptations.add(type);
    const lines = {
      game: "再打一局吧，反正今天也没什么重要的事。",
      sleep: "再睡十分钟，醒来就重新开始。",
      takeout: "不想下楼，也不想见人。",
      video: "再刷一会儿，烦恼就会被滑走。",
      balance: "先问家里要一点吧，下次一定省。",
    };
    this.showLostFloatingText(x, y - 48, lines[type]);
  }

  showLostFloatingText(x, y, message) {
    if (!message) return;
    const text = this.add
      .text(x, y, message, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "14px",
        fontStyle: "bold",
        color: "#fff4c4",
        align: "center",
        lineSpacing: 4,
        wordWrap: { width: 250, useAdvancedWrap: true },
      })
      .setOrigin(0.5)
      .setDepth(70)
      .setShadow(2, 2, "#05080b", 3, true, true);
    this.tweens.add({
      targets: text,
      y: y - 26,
      alpha: 0,
      duration: 2100,
      ease: "Sine.inOut",
      onComplete: () => text.destroy(),
    });
  }

  showAbsorbPulse(x, y) {
    const pulse = this.add.circle(x, y, 8, 0xe85c68, 0.34).setDepth(22);
    pulse.setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: pulse,
      alpha: 0,
      scale: 3.4,
      duration: 300,
      ease: "Sine.out",
      onComplete: () => pulse.destroy(),
    });
  }

  changeCorruption(delta) {
    this.corruption = Phaser.Math.Clamp(this.corruption + delta, 0, this.maxCorruption);
    if (this.corruption >= this.maxCorruption && this.mode === "absorb") this.prepareDodgeMode();
  }

  prepareDodgeMode() {
    this.mode = "dodge-ready";
    this.survivalMs = 0;
    this.dodgeStartSpeed = this.playerSpeed;
    this.showLostConfirmModal("他突然发现，\n自己不是在休息，\n而是在一点点消失。", () => this.startDodgeMode(), "站起来");
  }

  startDodgeMode() {
    this.mode = "dodge";
    this.survivalMs = 0;
    this.survivalDurationMs = 10000;
    this.playerSpeed = this.dodgeStartSpeed ?? this.minPlayerSpeed;
    this.cameras.main.flash(260, 232, 92, 104, false);
    this.updateUniversityHud();
  }

  showDamageFlash() {
    this.damageFlash?.setAlpha(0.24);
    this.tweens.add({
      targets: this.damageFlash,
      alpha: 0,
      duration: 180,
      ease: "Sine.out",
    });
  }

  updateDormMood() {
    const corruptionRatio = Phaser.Math.Clamp(this.corruption / this.maxCorruption, 0, 1);
    const dodgePressure = this.mode === "dodge" ? Phaser.Math.Clamp(this.survivalMs / this.survivalDurationMs, 0, 1) : 0;
    if (this.mode === "dodge") {
      this.playerSpeed = Phaser.Math.Linear(this.dodgeStartSpeed ?? this.minPlayerSpeed, this.basePlayerSpeed, dodgePressure);
    }
    const alpha = this.endingActive ? 0.24 : Phaser.Math.Clamp(0.08 + corruptionRatio * 0.34 + dodgePressure * 0.12, 0.08, 0.5);
    this.darkOverlay?.setAlpha(alpha);
    this.tuneDormAudio(corruptionRatio);
    if (this.dormHum?.gain) {
      const target = corruptionRatio * 0.045;
      this.dormHum.gain.gain.setTargetAtTime(target, this.dormHum.context.currentTime, 0.18);
    }
  }

  tuneDormAudio(amount) {
    if (!backgroundMusic?.audio) return;
    const audio = backgroundMusic.audio;
    audio.volume = Phaser.Math.Clamp(0.44 - amount * 0.24, 0.16, 0.44);
    try {
      audio.playbackRate = Phaser.Math.Clamp(1 - amount * 0.12, 0.86, 1);
    } catch {}
  }

  startDormHum() {
    if (typeof window === "undefined") return;
    if (this.dormHum) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 58;
      filter.type = "lowpass";
      filter.frequency.value = 160;
      gain.gain.value = 0;
      oscillator.connect(filter).connect(gain).connect(context.destination);
      oscillator.start();
      context.resume?.();
      this.dormHum = { context, oscillator, gain };
    } catch {
      this.dormHum = undefined;
    }
  }

  stopDormHum() {
    if (!this.dormHum) return;
    try {
      this.dormHum.oscillator.stop();
      this.dormHum.context.close?.();
    } catch {}
    this.dormHum = undefined;
  }

  restoreDormAudio() {
    this.stopDormHum();
    if (!backgroundMusic?.audio) return;
    backgroundMusic.audio.volume = 0.44;
    try {
      backgroundMusic.audio.playbackRate = 1;
    } catch {}
  }

  showGoldenBook() {
    if (this.bookAvailable || this.completing) return;
    this.mode = "book";
    this.bookAvailable = true;
    this.endingActive = true;
    this.enemies.clear(true, true);
    this.playerSpeed = this.basePlayerSpeed;
    this.player.setVelocity(0, 0);
    this.updateUniversityHud();
    this.computerGlow?.setAlpha(0);
    this.computerOff?.setAlpha(1);
    this.lampGlow?.setAlpha(0.72);

    const spot = {
      x: Phaser.Math.Clamp(this.player.x + 66, this.roomBounds.left + 36, this.roomBounds.right - 36),
      y: Phaser.Math.Clamp(this.player.y, this.roomBounds.top + 36, this.roomBounds.bottom - 36),
    };
    this.bookGlow = this.add.circle(spot.x, spot.y, 48, 0xffd76a, 0.44).setDepth(24);
    this.bookGlow.setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: this.bookGlow,
      alpha: 0.82,
      scale: 1.2,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
    this.finalBook = this.physics.add.staticSprite(spot.x, spot.y, "lost-book").setDisplaySize(82, 56).setTint(0xffd76a).setDepth(26);
    this.finalBook.refreshBody();
    this.physics.add.overlap(this.player, this.finalBook, this.pickDormBook, undefined, this);
    this.showLostFloatingText(spot.x, spot.y - 56, "不是所有光都会很亮。\n有些只是刚好够你看清下一页。");
    this.endingActive = false;
  }

  pickDormBook() {
    if (!this.bookAvailable || this.completing) return;
    this.bookAvailable = false;
    this.finalBook?.destroy();
    this.bookGlow?.destroy();
    this.finishChapterThree();
  }

  makeDormButton(x, y, width, height, label, onClick, depth = 90) {
    const button = this.add.container(x, y).setDepth(depth);
    const bg = this.add.rectangle(0, 0, width, height, 0xf4d77d, 0.96);
    bg.setStrokeStyle(2, 0x704b2a, 0.9);
    const text = this.add
      .text(0, 0, label, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: width <= 82 ? "14px" : "16px",
        fontStyle: "bold",
        color: "#132129",
      })
      .setOrigin(0.5);
    button.add([bg, text]);
    button.setSize(width + 8, height + 8);
    button.setInteractive({ useHandCursor: true });
    button.on("pointerdown", () => bg.setFillStyle(0xffefb0, 1));
    button.on("pointerup", () => {
      bg.setFillStyle(0xf4d77d, 0.96);
      onClick();
    });
    return button;
  }

  returnToCover() {
    if (this.completing) return;
    this.completing = true;
    this.restoreDormAudio();
    clearDevTestRoute();
    this.cameras.main.fadeOut(320, 12, 18, 24);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start("StartScene");
    });
  }

  finishChapterThree() {
    if (this.completing) return;
    this.completing = true;
    this.restoreDormAudio();
    if (this.returnToCoverOnSuccess) {
      this.cameras.main.fadeOut(360, 12, 18, 24);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        clearDevTestRoute();
        this.scene.start("StartScene");
      });
      return;
    }
    this.showLostToHerBridge(() => {
      this.scene.start("ChapterProgressScene", {
        chapter: 4,
        status: "enter",
        nextScene: "FinalScene",
      });
    });
  }

  showLostToHerBridge(onComplete) {
    const layer = this.add.container(0, 0).setDepth(120).setAlpha(0);
    const black = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x020407, 1).setOrigin(0);
    const phoneLight = this.add.circle(GAME_WIDTH / 2, 232, 14, 0x8fd8ff, 0).setBlendMode(Phaser.BlendModes.ADD);
    const text = this.add
      .text(
        GAME_WIDTH / 2,
        58,
        "他没有立刻变好。\n只是从某一天开始，\n又愿意把一个单词读出口。\n\n研究生生活很累。\n可屏幕另一端的一次次真诚交流，\n慢慢把遥远变成了靠近。",
        {
          fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
          fontSize: "18px",
          fontStyle: "bold",
          color: "#fff4c4",
          align: "center",
          lineSpacing: 6,
          wordWrap: { width: 600, useAdvancedWrap: true },
        },
      )
      .setOrigin(0.5, 0);
    const finalLine = this.add
      .text(GAME_WIDTH / 2, 316, "他以为自己只是在练习表达。\n后来才发现，自己是在练习靠近。", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "18px",
        fontStyle: "bold",
        color: "#b9f0f0",
        align: "center",
        lineSpacing: 6,
        wordWrap: { width: 620, useAdvancedWrap: true },
      })
      .setOrigin(0.5)
      .setAlpha(0);
    layer.add([black, phoneLight, text, finalLine]);
    this.tweens.add({
      targets: layer,
      alpha: 1,
      duration: 820,
      ease: "Sine.inOut",
      onComplete: () => {
        this.tweens.add({
          targets: phoneLight,
          alpha: 0.76,
          scale: 5.2,
          duration: 2200,
          delay: 760,
          ease: "Sine.out",
        });
        this.tweens.add({
          targets: text,
          alpha: 0.28,
          duration: 900,
          delay: 2100,
          ease: "Sine.inOut",
        });
        this.tweens.add({
          targets: finalLine,
          alpha: 1,
          duration: 900,
          delay: 2600,
          ease: "Sine.inOut",
        });
        this.time.delayedCall(6500, () => {
          this.cameras.main.fadeOut(900, 8, 12, 20);
          this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, onComplete);
        });
      },
    });
  }
}

class FinalScene extends Phaser.Scene {
  constructor() {
    super("FinalScene");
    this.ending = false;
  }

  create() {
    loadSceneAssets(this, finalOnlineAssets, () => this.createLoaded());
  }

  createLoaded() {
    this.ending = false;
    this.stage = null;
    this.closeness = 0.08;
    this.topicCount = 0;
    this.inviteIndex = 0;
    this.mapIndex = 0;
    this.voiceStarted = false;
    this.chatStep = 0;
    this.chatMessages = [];
    this.selectedChatOption = "";
    this.chatUiVisible = false;
    this.holdProgress = 0;
    this.holdingClose = false;
    this.finalMomentShown = false;
    this.floatingChatIndex = 0;
    this.floatingChatMessages = [];
    this.floatingChatHandler = null;
    this.storyInterludeStarted = false;
    this.herMemoryIndex = 0;
    this.herMemoryHandler = null;
    this.herMemoryTransitioning = false;
    this.herMemoryImage = null;
    this.herMemoryCaption = null;
    this.meetHerInterludeStarted = false;
    this.meetMemoryIndex = 0;
    this.meetMemoryHandler = null;
    this.meetMemoryTransitioning = false;
    this.meetMemoryImage = null;
    this.meetMemoryCaption = null;
    this.mazeActive = false;
    this.mazeCompleted = false;
    this.mazeKeys = null;
    this.mazeWalls = [];
    this.paintFinalChapterBackground();
    this.createDistanceSystem();
    this.showOnlineStage();
    this.cameras.main.fadeIn(520, 8, 12, 20);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanupChatDomInput());
  }

  update(_time, delta) {
    if (this.mazeActive) this.updateHerMaze(delta);
    if (this.finalPictureActive) this.updateFinalPictureMotion(delta);
    this.updateDistanceLine();
  }

  paintFinalChapterBackground() {
    const g = this.add.graphics();
    g.fillStyle(0x111720, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    for (let y = 0; y < GAME_HEIGHT; y += 18) {
      const alpha = 0.08 + y / GAME_HEIGHT * 0.1;
      g.fillStyle(0x223440, alpha);
      g.fillRect(0, y, GAME_WIDTH, 10);
    }
    g.fillStyle(0x1f2e35, 1);
    g.fillRect(0, 310, GAME_WIDTH, 80);
    g.fillStyle(0x273f46, 1);
    for (let x = 0; x < GAME_WIDTH; x += 30) {
      g.fillRect(x, 326 + (x % 60) / 3, 18, 8);
      if (x % 90 === 0) g.fillRect(x + 8, 292, 28, 34);
    }
    g.fillStyle(0xffd98a, 0.16);
    g.fillRect(0, 96, GAME_WIDTH, 2);
    g.fillRect(0, 248, GAME_WIDTH, 2);
    for (let i = 0; i < 28; i += 1) {
      const x = 34 + i * 30;
      const y = 42 + (i % 7) * 26;
      g.fillStyle(i % 3 === 0 ? 0xffe79b : 0x89c8d8, i % 4 === 0 ? 0.3 : 0.16);
      g.fillRect(x, y, 3, 3);
    }

  }

  createDistanceSystem() {
    this.connectionLine = this.add.graphics().setDepth(12);
    this.boy = this.add.image(132, 284, "player").setScale(1.35).setDepth(18);
    this.her = this.add.image(714, 284, "partner").setScale(1.35).setFlipX(true).setDepth(18);
    this.distanceText = this.add
      .text(GAME_WIDTH / 2, 66, "distance  92%", {
        fontFamily: "Courier New, monospace",
        fontSize: "15px",
        fontStyle: "bold",
        color: "#b9d7d8",
      })
      .setOrigin(0.5)
      .setDepth(30);
    this.updateDistanceLine();
  }

  setCloseness(value) {
    this.closeness = Phaser.Math.Clamp(value, 0, 1);
    this.updateDistanceLine();
  }

  addCloseness(amount) {
    this.setCloseness(this.closeness + amount);
  }

  setActorPositions(leftX, rightX, y = 284, scale = 1.35) {
    this.boy.setPosition(leftX, y).setScale(scale);
    this.her.setPosition(rightX, y).setScale(scale).setFlipX(true);
    this.updateDistanceLine();
  }

  updateDistanceLine() {
    if (!this.connectionLine || !this.boy || !this.her) return;
    const alpha = Phaser.Math.Linear(0.18, 0.95, this.closeness);
    const color = this.closeness > 0.68 ? 0xffd98a : 0x8fd8e8;
    this.connectionLine.clear();
    this.connectionLine.lineStyle(2 + this.closeness * 3, color, alpha);
    this.connectionLine.beginPath();
    this.connectionLine.moveTo(this.boy.x + 18, this.boy.y - 12);
    this.connectionLine.lineTo(this.her.x - 18, this.her.y - 12);
    this.connectionLine.strokePath();
    this.connectionLine.fillStyle(color, alpha);
    this.connectionLine.fillCircle(this.boy.x + 18, this.boy.y - 12, 4 + this.closeness * 3);
    this.connectionLine.fillCircle(this.her.x - 18, this.her.y - 12, 4 + this.closeness * 3);
    const distance = Math.max(0, Math.round((1 - this.closeness) * 100));
    this.distanceText?.setText(`distance  ${distance}%`);
  }

  clearStage() {
    this.cleanupChatDomInput();
    this.cleanupMonologueSpeedControls();
    if (this.floatingChatHandler) {
      this.input.off("pointerdown", this.floatingChatHandler);
      this.floatingChatHandler = null;
    }
    if (this.herMemoryHandler) {
      this.input.off("pointerdown", this.herMemoryHandler);
      this.herMemoryHandler = null;
    }
    if (this.meetMemoryHandler) {
      this.input.off("pointerdown", this.meetMemoryHandler);
      this.meetMemoryHandler = null;
    }
    if (this.fetchChoicePromptHandler) {
      this.input.off("pointerdown", this.fetchChoicePromptHandler);
      this.fetchChoicePromptHandler = null;
    }
    if (this.onlineStartHandler) {
      this.input.off("pointerdown", this.onlineStartHandler);
      this.onlineStartHandler = null;
    }
    this.finalPictureActive = false;
    this.finalPictureWaves = null;
    this.finalPictureSparkles = [];
    this.mazeActive = false;
    this.mazeWalls = [];
    this.stage?.destroy(true);
    this.stage = this.add.container(0, 0).setDepth(8);
  }

  cleanupMonologueSpeedControls() {
    if (this.monologueSpeedHandler) {
      this.input.off("pointerdown", this.monologueSpeedHandler);
      this.monologueSpeedHandler = null;
    }
    this.monologueSpeedReset?.remove(false);
    this.monologueSpeedReset = null;
    if (this.monologueScrollTween) this.monologueScrollTween.timeScale = 1;
    this.monologueScrollTween = null;
  }

  showOnlineStage() {
    this.clearStage();
    this.setCloseness(0.08);
    this.setDistanceSystemVisible(false);
    this.chatStep = 0;
    this.chatMessages = [];
    this.selectedChatOption = "";
    this.chatUiVisible = false;
    this.herFetchTransitionStarted = false;
    this.reachHandChoiceShown = false;
    this.herFinalExposureStarted = false;

    const source = this.textures.get("her-chatting-background").getSourceImage();
    const scale = Math.max(GAME_WIDTH / source.width, GAME_HEIGHT / source.height);
    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "her-chatting-background").setScale(scale);
    this.stage.add(bg);

    const g = this.add.graphics();
    g.fillStyle(0x071018, 0.12);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.stage.add(g);

    this.onlineStartHandler = () => {
      this.onlineStartHandler = null;
      this.showChatPanel();
    };
    this.input.once("pointerdown", this.onlineStartHandler);
  }

  showChatPanel() {
    if (this.chatUiVisible || !this.stage) return;
    this.chatUiVisible = true;

    const shade = this.add.graphics();
    shade.fillStyle(0x02070c, 0.26);
    shade.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.stage.add(shade);

    const phoneGlow = this.add.graphics();
    phoneGlow.fillStyle(0x90d7ff, 0.18);
    phoneGlow.fillCircle(286, 218, 28);
    phoneGlow.lineStyle(2, 0x90d7ff, 0.38);
    phoneGlow.strokeCircle(286, 218, 36);
    this.stage.add(phoneGlow);

    const liveSource = this.textures.get("her-live-room").getSourceImage();
    const finalWidth = 480;
    const finalScale = finalWidth / liveSource.width;
    const finalX = GAME_WIDTH - finalWidth / 2 - 35;
    const bubblePadding = 18;
    const bubbleLeft = -liveSource.width / 2 - bubblePadding;
    const bubbleTop = -liveSource.height / 2 - bubblePadding;
    const bubbleWidth = liveSource.width + bubblePadding * 2;
    const bubbleHeight = liveSource.height + bubblePadding * 2;
    const tailTipX = bubbleLeft - 170;
    const tailTipY = 100;
    const tailTopY = 24;
    const tailBottomY = 120;
    const liveBubble = this.add.container(286, 218).setScale(0.038).setAlpha(0.2).setDepth(9);
    const bubbleBack = this.add.graphics();
    bubbleBack.fillStyle(0x090d14, 0.2);
    bubbleBack.fillRoundedRect(bubbleLeft, bubbleTop, bubbleWidth, bubbleHeight, 36);
    bubbleBack.fillTriangle(bubbleLeft, tailTopY, bubbleLeft, tailBottomY, tailTipX, tailTipY);
    const liveRoom = this.add
      .image(0, 0, "her-live-room")
      .setAlpha(0.86);
    const bubbleFrame = this.add.graphics();
    bubbleFrame.lineStyle(10, 0xffd3e1, 0.92);
    bubbleFrame.strokeRoundedRect(bubbleLeft, bubbleTop, bubbleWidth, bubbleHeight, 36);
    bubbleFrame.lineBetween(bubbleLeft, tailTopY, tailTipX, tailTipY);
    bubbleFrame.lineBetween(tailTipX, tailTipY, bubbleLeft, tailBottomY);
    bubbleFrame.lineStyle(3, 0xfff1f6, 0.68);
    bubbleFrame.strokeRoundedRect(bubbleLeft + 14, bubbleTop + 14, bubbleWidth - 28, bubbleHeight - 28, 28);
    liveBubble.add([bubbleBack, liveRoom, bubbleFrame]);
    this.stage.add(liveBubble);
    this.tweens.add({
      targets: liveBubble,
      x: finalX,
      y: GAME_HEIGHT / 2 + 20,
      scale: finalScale,
      alpha: 1,
      duration: 620,
      ease: "Cubic.easeOut",
    });
    this.tweens.add({
      targets: phoneGlow,
      alpha: 0,
      scale: 2.2,
      duration: 560,
      ease: "Cubic.easeOut",
      onComplete: () => phoneGlow.destroy(),
    });
    this.prepareFloatingChatBubbles();
  }

  prepareFloatingChatBubbles() {
    this.floatingChatIndex = 0;
    this.floatingChatMessages = [
      { text: "Hello, I'm Ache. It's my first time talking here.", x: 18, y: 30, width: 260, color: "gray", delay: 180 },
      { text: "Nice to meet you. You can take your time.", x: 72, y: 74, width: 280, color: "blue", delay: 620 },
      { text: "I'm a little nervous.", x: 18, y: 118, width: 210, color: "gray", delay: 1060 },
      { text: "That's okay. I am listening.", x: 92, y: 160, width: 250, color: "blue", delay: 1500 },
      { text: "How was your day?", x: 18, y: 204, width: 210, color: "gray", delay: 1940 },
      { text: "Tired, but not bad. What about you?", x: 82, y: 246, width: 272, color: "blue", delay: 2380 },
      { text: "I think... today became a little better.", x: 18, y: 290, width: 270, color: "gray", delay: 2820 },
      { text: "Then I'm glad I met you today.", x: 92, y: 332, width: 252, color: "blue", delay: 3260 },
    ];
    this.time.delayedCall(720, () => {
      if (!this.stage || !this.chatUiVisible) return;
      this.floatingChatHandler = () => this.showNextFloatingChatBubble();
      this.input.on("pointerdown", this.floatingChatHandler);
    });
  }

  showNextFloatingChatBubble() {
    if (!this.stage || !this.chatUiVisible || this.storyInterludeStarted) return;
    const message = this.floatingChatMessages?.[this.floatingChatIndex];
    if (!message) return;
    this.floatingChatIndex += 1;
    const bubble = this.createFloatingChatBubble(message);
    this.stage.add(bubble);
    this.tweens.add({
      targets: bubble,
      y: message.y - 10,
      alpha: 1,
      duration: 620,
      ease: "Cubic.easeOut",
    });
    this.tweens.add({
      targets: bubble,
      y: message.y - 18,
      duration: 1900,
      delay: 420,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    if (this.floatingChatIndex >= this.floatingChatMessages.length) {
      this.input.off("pointerdown", this.floatingChatHandler);
      this.floatingChatHandler = null;
      this.time.delayedCall(900, () => this.showStoryBeginsInterlude());
    }
  }

  showStoryBeginsInterlude() {
    if (this.storyInterludeStarted) return;
    this.storyInterludeStarted = true;
    this.herMemoryIndex = 0;
    this.herMemoryScenes = [
      "her-memory-morning",
      "her-memory-walking",
      "her-memory-eating",
      "her-memory-labor",
      "her-memory-bus",
      "her-memory-sleep",
    ];
    this.herMemoryCaptions = {
      "her-memory-morning": "早安变成了每天的第一束光。",
      "her-memory-walking": "他开始把路上的风，也讲给她听。",
      "her-memory-eating": "一个人的饭，好像也没那么安静了。",
      "her-memory-labor": "忙碌没有消失，只是有人愿意听他说完。",
      "her-memory-bus": "城市在窗外后退，她的消息在手心发亮。",
      "her-memory-sleep": "晚安不是结束，是明天还会再见。",
    };
    const interlude = this.add.container(0, 0).setDepth(100);
    const black = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 1).setOrigin(0);
    const subtitle = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "The story begins that day.", {
        fontFamily: "Courier New, monospace",
        fontSize: "22px",
        fontStyle: "bold",
        color: "#f6f0df",
      })
      .setOrigin(0.5);
    interlude.add([black, subtitle]);
    interlude.setAlpha(0);
    this.stage.add(interlude);
    this.tweens.add({
      targets: interlude,
      alpha: 1,
      duration: 980,
      ease: "Sine.easeInOut",
      onComplete: () => {
        loadSceneAssets(this, finalMemoryAssets, () => {
          this.herMemoryHandler = () => this.showNextHerMemoryScene();
          this.input.on("pointerdown", this.herMemoryHandler);
        });
      },
    });
  }

  showNextHerMemoryScene() {
    if (this.herMemoryTransitioning || !this.stage || !this.storyInterludeStarted) return;
    const key = this.herMemoryScenes?.[this.herMemoryIndex];
    if (!key) {
      this.showMeetHerInterlude();
      return;
    }
    this.herMemoryTransitioning = true;
    this.herMemoryIndex += 1;

    const cover = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 1).setOrigin(0).setAlpha(0).setDepth(240);
    this.stage.add(cover);
    this.tweens.add({
      targets: cover,
      alpha: 1,
      duration: 520,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.herMemoryImage?.destroy();
        this.herMemoryCaption?.destroy();
        this.herMemoryImage = this.createHerMemoryImage(key);
        this.herMemoryCaption = this.createHerSceneCaption(this.herMemoryCaptions[key]);
        this.stage.add([this.herMemoryImage, this.herMemoryCaption]);
        this.tweenHerMemoryImage(this.herMemoryImage);
        this.tweens.add({
          targets: cover,
          alpha: 0,
          duration: 720,
          ease: "Sine.easeInOut",
          onComplete: () => {
            cover.destroy();
            this.herMemoryTransitioning = false;
          },
        });
      },
    });
  }

  showMeetHerInterlude() {
    if (this.meetHerInterludeStarted) return;
    this.meetHerInterludeStarted = true;
    this.meetMemoryIndex = 0;
    this.meetMemoryScenes = [
      "her-meet-first",
      "her-meet-umbrella",
      "her-meet-museum",
      "her-meet-subway",
      "her-meet-meal",
      "her-meet-boat",
      "her-meet-lying-bed",
    ];
    this.meetMemoryCaptions = {
      "her-meet-first": "屏幕那端的人，真的出现在了他的世界里。",
      "her-meet-umbrella": "雨落下来的时候，他们终于站在同一把伞下。",
      "her-meet-museum": "照片里是展品，心里记住的却是她笑起来的样子。",
      "her-meet-subway": "城市在车窗外流动，他们第一次离彼此这么近。",
      "her-meet-meal": "普通的一顿饭，也因为她变得值得记住。",
      "her-meet-boat": "湖面很慢，时间也像是慢了下来。",
      "her-meet-lying-bed": "那些曾经只能打字说出的陪伴，终于变成了身边的呼吸。",
    };
    if (this.herMemoryHandler) {
      this.input.off("pointerdown", this.herMemoryHandler);
      this.herMemoryHandler = null;
    }
    this.herMemoryTransitioning = true;
    const interlude = this.add.container(0, 0).setDepth(130);
    const black = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 1).setOrigin(0);
    const subtitle = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "后来，她说要去那座城市。\n\n屏幕那端的人，\n真的出现在了他的世界里。", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "22px",
        fontStyle: "bold",
        color: "#f6f0df",
        align: "center",
        lineSpacing: 8,
        wordWrap: { width: 680, useAdvancedWrap: true },
      })
      .setOrigin(0.5);
    interlude.add([black, subtitle]);
    interlude.setAlpha(0);
    this.stage.add(interlude);
    this.tweens.add({
      targets: interlude,
      alpha: 1,
      duration: 980,
      ease: "Sine.easeInOut",
      onComplete: () => {
        loadSceneAssets(this, finalMeetAssets, () => {
          this.herMemoryTransitioning = false;
          this.meetMemoryHandler = () => this.showNextMeetMemoryScene();
          this.input.on("pointerdown", this.meetMemoryHandler);
        });
      },
    });
  }

  showNextMeetMemoryScene() {
    if (this.meetMemoryTransitioning || !this.stage || !this.meetHerInterludeStarted) return;
    const key = this.meetMemoryScenes?.[this.meetMemoryIndex];
    if (!key) {
      if (this.meetMemoryHandler) {
        this.input.off("pointerdown", this.meetMemoryHandler);
        this.meetMemoryHandler = null;
      }
      this.showHerMazeIntroStage();
      return;
    }
    this.meetMemoryTransitioning = true;
    this.meetMemoryIndex += 1;

    const cover = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 1).setOrigin(0).setAlpha(0).setDepth(240);
    this.stage.add(cover);
    this.tweens.add({
      targets: cover,
      alpha: 1,
      duration: 520,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.meetMemoryImage?.destroy();
        this.meetMemoryCaption?.destroy();
        this.herMemoryImage?.destroy();
        this.herMemoryCaption?.destroy();
        this.meetMemoryImage = this.createHerMemoryImage(key).setDepth(131);
        this.meetMemoryCaption = this.createHerSceneCaption(this.meetMemoryCaptions[key], 152);
        this.stage.add([this.meetMemoryImage, this.meetMemoryCaption]);
        this.tweenHerMemoryImage(this.meetMemoryImage);
        this.tweens.add({
          targets: cover,
          alpha: 0,
          duration: 720,
          ease: "Sine.easeInOut",
          onComplete: () => {
            cover.destroy();
            this.meetMemoryTransitioning = false;
          },
        });
      },
    });
  }

  createHerMemoryImage(key) {
    const source = this.textures.get(key).getSourceImage();
    const scale = Math.max(GAME_WIDTH / source.width, GAME_HEIGHT / source.height);
    return this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, key)
      .setScale(scale)
      .setDepth(101);
  }

  tweenHerMemoryImage(image) {
    if (!image) return;
    const baseScale = image.scaleX;
    this.tweens.add({
      targets: image,
      scale: baseScale * 1.035,
      duration: 3600,
      ease: "Sine.inOut",
    });
  }

  createHerSceneCaption(message, depth = 122) {
    const caption = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT - 38).setDepth(depth).setAlpha(0);
    const bg = this.add.rectangle(0, 0, 650, 46, 0x05080b, 0.58);
    bg.setStrokeStyle(1, 0xfff0c8, 0.24);
    const text = this.add
      .text(0, 0, message, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "17px",
        fontStyle: "bold",
        color: "#fff4c4",
        align: "center",
        wordWrap: { width: 590, useAdvancedWrap: true },
      })
      .setOrigin(0.5);
    caption.add([bg, text]);
    this.tweens.add({
      targets: caption,
      y: GAME_HEIGHT - 48,
      alpha: 1,
      duration: 700,
      ease: "Sine.out",
    });
    return caption;
  }

  showHerMazeIntroStage() {
    this.clearStage();
    const black = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 1).setOrigin(0);
    const text = this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        "可越是靠近，\n他越害怕。\n\n害怕自己不够好，\n害怕这只是短暂的梦，\n害怕真正靠近之后，\n又会失去。",
        {
          fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
          fontSize: "22px",
          fontStyle: "bold",
          color: "#f6f0df",
          align: "center",
          lineSpacing: 8,
          wordWrap: { width: 650, useAdvancedWrap: true },
        },
      )
      .setOrigin(0.5)
      .setAlpha(0);
    this.stage.add([black, text]);
    this.tweens.add({
      targets: text,
      alpha: 1,
      duration: 980,
      ease: "Sine.inOut",
      onComplete: () => {
        this.time.delayedCall(3800, () => {
          this.tweens.add({
            targets: text,
            alpha: 0,
            duration: 820,
            ease: "Sine.inOut",
            onComplete: () => this.showHerMazeStage(),
          });
        });
      },
    });
  }

  showHerMazeStage() {
    this.clearStage();
    this.setDistanceSystemVisible(false);
    this.mazeActive = true;
    this.mazeCompleted = false;
    this.mazeWalls = [];
    this.mazeOffsetX = 0;
    this.mazeOffsetY = 0;
    this.mazePlayerRadius = 9;
    this.mazePlayerSpeed = 145;
    this.mazeMap = [
      "#######################",
      "#S....#.......#.......#",
      "###.#.#.#####.#.#####.#",
      "#...#.#.....#.#.....#.#",
      "#.###.#####.#.#####.#.#",
      "#...#.....#.#.....#...#",
      "#.#.#####.#.#####.###.#",
      "#.#.....#.#.....#.....#",
      "#.#####.#.#####.#####.#",
      "#.......#.......#.....E",
      "#######################",
    ];
    this.mazeRows = this.mazeMap.length;
    this.mazeCols = this.mazeMap[0].length;
    this.mazeTileWidth = GAME_WIDTH / this.mazeCols;
    this.mazeTileHeight = GAME_HEIGHT / this.mazeRows;

    const g = this.add.graphics();
    g.fillStyle(0x020305, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.fillStyle(0x090c12, 0.78);
    for (let x = 0; x < GAME_WIDTH; x += 34) {
      g.fillRect(x + 4, 18 + (x % 68) / 4, 18, 2);
      g.fillRect(x + 12, 350 - (x % 51) / 5, 22, 2);
    }
    this.stage.add(g);

    this.mazeMap.forEach((row, rowIndex) => {
      [...row].forEach((cell, colIndex) => {
        const x = this.mazeOffsetX + colIndex * this.mazeTileWidth;
        const y = this.mazeOffsetY + rowIndex * this.mazeTileHeight;
        if (cell === "#") {
          g.fillStyle(0x05070b, 1);
          g.fillRect(x, y, this.mazeTileWidth + 0.5, this.mazeTileHeight + 0.5);
          g.fillStyle(0x111723, 0.88);
          g.fillRect(x + 2, y + 2, this.mazeTileWidth - 4, this.mazeTileHeight * 0.42);
          g.fillStyle(0x000000, 0.9);
          g.fillRect(x + 3, y + this.mazeTileHeight * 0.62, this.mazeTileWidth - 6, this.mazeTileHeight * 0.24);
          g.lineStyle(1, 0x2c3442, 0.58);
          g.lineBetween(x + 4, y + 4, x + this.mazeTileWidth - 4, y + this.mazeTileHeight - 4);
          g.lineBetween(x + this.mazeTileWidth - 4, y + 4, x + 4, y + this.mazeTileHeight - 4);
          g.fillStyle(0x596475, 0.2);
          if ((rowIndex + colIndex) % 2 === 0) g.fillCircle(x + this.mazeTileWidth * 0.72, y + this.mazeTileHeight * 0.32, 1.6);
          if ((rowIndex + colIndex) % 3 === 0) g.fillCircle(x + this.mazeTileWidth * 0.32, y + this.mazeTileHeight * 0.72, 1.4);
          g.lineStyle(1, 0x000000, 0.95);
          g.strokeRect(x + 0.5, y + 0.5, this.mazeTileWidth - 1, this.mazeTileHeight - 1);
          this.mazeWalls.push(new Phaser.Geom.Rectangle(x, y, this.mazeTileWidth, this.mazeTileHeight));
        } else {
          g.fillStyle(0x0b0f16, 1);
          g.fillRect(x, y, this.mazeTileWidth + 0.5, this.mazeTileHeight + 0.5);
          g.fillStyle(0x252d39, 0.34);
          g.fillRect(x + this.mazeTileWidth * 0.28, y + this.mazeTileHeight * 0.47, this.mazeTileWidth * 0.42, 2);
          if ((rowIndex + colIndex) % 4 === 0) {
            g.fillStyle(0x596475, 0.16);
            g.fillRect(x + 5, y + this.mazeTileHeight - 10, 5, 3);
          }
        }
        if (cell === "S") this.mazeStart = this.getMazeCellCenter(colIndex, rowIndex);
        if (cell === "E") {
          this.mazeExit = this.getMazeCellCenter(colIndex, rowIndex);
          this.mazeExitRect = new Phaser.Geom.Rectangle(
            x + this.mazeTileWidth * 0.48,
            y + this.mazeTileHeight * 0.1,
            this.mazeTileWidth * 0.52,
            this.mazeTileHeight * 0.8,
          );
          g.fillStyle(0xd8f5ff, 0.7);
          g.fillRect(GAME_WIDTH - 9, y + 3, 9, this.mazeTileHeight - 6);
          g.fillStyle(0x9dc9ff, 0.24);
          g.fillRect(GAME_WIDTH - 22, y + 6, 22, this.mazeTileHeight - 12);
        }
      });
    });

    const exitGlow = this.add.ellipse(GAME_WIDTH + 2, this.mazeExit.y, 92, this.mazeTileHeight * 1.9, 0xbcefff, 0.54).setDepth(12);
    exitGlow.setBlendMode(Phaser.BlendModes.ADD);
    const exitAura = this.add.ellipse(GAME_WIDTH - 4, this.mazeExit.y, 44, this.mazeTileHeight * 1.28, 0xffffff, 0.44).setDepth(13);
    exitAura.setBlendMode(Phaser.BlendModes.ADD);
    const exitCore = this.add.rectangle(GAME_WIDTH - 4, this.mazeExit.y, 12, this.mazeTileHeight * 0.96, 0xf2fbff, 1).setDepth(14);
    this.stage.add([exitGlow, exitAura, exitCore]);
    this.tweens.add({
      targets: exitGlow,
      scaleX: 1.42,
      alpha: 0.24,
      duration: 840,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    this.tweens.add({
      targets: exitAura,
      scaleX: 1.18,
      alpha: 0.72,
      duration: 620,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.mazePlayer = this.add.image(this.mazeStart.x, this.mazeStart.y, "maze-player").setScale(0.92).setDepth(20);
    this.stage.add(this.mazePlayer);
    this.mazeKeys = this.input.keyboard?.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      s: Phaser.Input.Keyboard.KeyCodes.S,
    });

    const cover = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 1).setOrigin(0).setDepth(80);
    this.stage.add(cover);
    this.tweens.add({
      targets: cover,
      alpha: 0,
      duration: 900,
      ease: "Sine.easeInOut",
      onComplete: () => cover.destroy(),
    });
  }

  getMazeCellCenter(col, row) {
    return {
      x: this.mazeOffsetX + col * this.mazeTileWidth + this.mazeTileWidth / 2,
      y: this.mazeOffsetY + row * this.mazeTileHeight + this.mazeTileHeight / 2,
    };
  }

  updateHerMaze(delta) {
    if (!this.mazePlayer || this.mazeCompleted) return;
    const direction = new Phaser.Math.Vector2(0, 0);
    if (this.mazeKeys?.left.isDown || this.mazeKeys?.a.isDown) direction.x -= 1;
    if (this.mazeKeys?.right.isDown || this.mazeKeys?.d.isDown) direction.x += 1;
    if (this.mazeKeys?.up.isDown || this.mazeKeys?.w.isDown) direction.y -= 1;
    if (this.mazeKeys?.down.isDown || this.mazeKeys?.s.isDown) direction.y += 1;

    const pointer = this.input.activePointer;
    if (pointer?.isDown && direction.lengthSq() === 0) {
      direction.set(pointer.worldX - this.mazePlayer.x, pointer.worldY - this.mazePlayer.y);
      if (direction.length() < 10) direction.set(0, 0);
    }

    if (direction.lengthSq() > 0) {
      direction.normalize();
      const distance = this.mazePlayerSpeed * (delta / 1000);
      this.moveMazePlayer(direction.x * distance, 0);
      this.moveMazePlayer(0, direction.y * distance);
      if (Math.abs(direction.x) > 0.05) this.mazePlayer.setFlipX(direction.x < 0);
    }

    const playerRect = this.getMazePlayerRect(this.mazePlayer.x, this.mazePlayer.y);
    if (this.mazeExitRect && Phaser.Geom.Rectangle.Overlaps(playerRect, this.mazeExitRect)) {
      this.completeHerMaze();
    }
  }

  moveMazePlayer(dx, dy) {
    const nextX = this.mazePlayer.x + dx;
    const nextY = this.mazePlayer.y + dy;
    if (this.canPlaceMazePlayer(nextX, nextY)) this.mazePlayer.setPosition(nextX, nextY);
  }

  canPlaceMazePlayer(x, y) {
    const rect = this.getMazePlayerRect(x, y);
    return !this.mazeWalls.some((wall) => Phaser.Geom.Rectangle.Overlaps(rect, wall));
  }

  getMazePlayerRect(x, y) {
    const radius = this.mazePlayerRadius;
    return new Phaser.Geom.Rectangle(x - radius, y - radius, radius * 2, radius * 2);
  }

  completeHerMaze() {
    if (this.mazeCompleted) return;
    this.mazeCompleted = true;
    this.mazeActive = false;
    const white = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xffffff, 1).setOrigin(0).setAlpha(0).setDepth(160);
    this.stage.add(white);
    this.tweens.add({
      targets: white,
      alpha: 1,
      duration: 920,
      ease: "Sine.easeOut",
      onComplete: () => {
        this.showHerFetchTransition();
      },
    });
  }

  getFinalMonologueText() {
    return `在遇到她之前，
他以为人生就是一个人往前走。

跌倒了就自己爬起来，
难过了就假装没关系，
想说的话，就藏进夜里。

他也曾经以为，
自由就是不用向任何人解释。

可后来他发现，
没有人等待的自由，
有时候也像一间没有灯的房间。

直到某一天，
屏幕另一端传来一个温柔的声音。

她没有替他回答人生，
也没有把他从黑暗里一把拉出。

她只是认真听他说话，
一次，又一次。

于是他开始重新走路。
重新吃饭，重新学习，重新期待明天。

他还是会迷茫，还是会害怕，
但这一次，
他不再只想逃走。

有些相遇不是让人找到答案，
而是让人开始愿意重新提问。

比如：
如果未来还有很远，
我们可不可以一起走？`;
  }

  showHerFetchTransition() {
    if (this.herFetchTransitionStarted) return;
    this.herFetchTransitionStarted = true;
    loadSceneAssets(this, finalEndingAssets, () => this.showHerFetchScene());
  }

  showHerFetchScene() {
    if (!this.textures.exists("her-fetch-pic")) {
      loadSceneAssets(this, finalEndingAssets, () => this.showHerFetchScene());
      return;
    }
    this.clearStage();
    const source = this.textures.get("her-fetch-pic").getSourceImage();
    const scale = Math.max(GAME_WIDTH / source.width, GAME_HEIGHT / source.height);
    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "her-fetch-pic").setScale(scale).setDepth(100);
    this.fetchSceneImage = bg;
    const shade = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xfffbf3, 0.08).setOrigin(0).setDepth(101);
    const white = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xffffff, 1).setOrigin(0).setDepth(220);
    this.stage.add([bg, shade, white]);
    this.tweens.add({
      targets: white,
      alpha: 0,
      duration: 1300,
      ease: "Sine.easeInOut",
      onComplete: () => {
        white.destroy();
        this.time.delayedCall(520, () => this.showReachHandChoice());
      },
    });
  }

  showReachHandChoice() {
    if (!this.stage || this.reachHandChoiceShown) return;
    this.reachHandChoiceShown = true;

    const preface = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 206, "有些话说不出口。\n所以他只是向前伸出了手。", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "17px",
        fontStyle: "bold",
        color: "#333845",
        align: "center",
        lineSpacing: 6,
        wordWrap: { width: 560, useAdvancedWrap: true },
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(229);
    this.stage.add(preface);
    this.tweens.add({
      targets: preface,
      y: GAME_HEIGHT - 214,
      alpha: 1,
      duration: 820,
      ease: "Sine.out",
    });

    const panel = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT - 78).setAlpha(0).setDepth(230);
    const back = this.add.graphics();
    back.fillStyle(0xffffff, 0.9);
    back.fillRoundedRect(-150, -54, 300, 108, 16);
    back.lineStyle(2, 0xffc7d8, 0.88);
    back.strokeRoundedRect(-150, -54, 300, 108, 16);
    back.lineStyle(1, 0xffffff, 0.82);
    back.strokeRoundedRect(-140, -44, 280, 88, 12);

    const title = this.add
      .text(0, -24, "是否伸手", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "19px",
        fontStyle: "bold",
        color: "#333845",
      })
      .setOrigin(0.5);

    const reachButton = this.createReachHandButton(0, 22, "伸手", () => this.showHerFinalExposure());
    panel.add([back, title, reachButton]);
    this.stage.add(panel);
    this.tweens.add({
      targets: panel,
      y: GAME_HEIGHT - 88,
      alpha: 1,
      duration: 720,
      ease: "Back.easeOut",
    });
  }

  createReachHandButton(x, y, label, onChoose) {
    const button = this.add.container(x, y).setSize(126, 34).setInteractive({ useHandCursor: true });
    const bg = this.add.graphics();
    bg.fillStyle(0xff8fb5, 0.95);
    bg.fillRoundedRect(-63, -17, 126, 34, 12);
    bg.lineStyle(1.5, 0xffd6e4, 0.82);
    bg.strokeRoundedRect(-63, -17, 126, 34, 12);
    const text = this.add
      .text(0, 0, label, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "15px",
        fontStyle: "bold",
        color: "#fff8fb",
      })
      .setOrigin(0.5);
    button.add([bg, text]);
    button.on("pointerover", () => button.setScale(1.04));
    button.on("pointerout", () => button.setScale(1));
    button.on("pointerdown", () => {
      button.disableInteractive();
      this.tweens.add({
        targets: button,
        scale: 0.94,
        duration: 80,
        yoyo: true,
        ease: "Sine.easeInOut",
        onComplete: () => onChoose?.(),
      });
    });
    return button;
  }

  showHerFinalExposure() {
    if (!this.stage || this.herFinalExposureStarted) return;
    this.herFinalExposureStarted = true;
    this.tweens.add({
      targets: this.fetchSceneImage,
      x: GAME_WIDTH / 2 - 6,
      scale: (this.fetchSceneImage?.scaleX ?? 1) * 1.018,
      duration: 1100,
      ease: "Sine.inOut",
    });
    const flash = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xffffff, 1).setOrigin(0).setAlpha(0).setDepth(260);
    this.stage.add(flash);
    this.tweens.add({
      targets: flash,
      alpha: 1,
      duration: 900,
      delay: 780,
      ease: "Expo.easeOut",
      onComplete: () => this.time.delayedCall(2400, () => this.showHerFinalPicture()),
    });
  }

  showHerFinalPicture() {
    if (!this.textures.exists("her-final-pic")) {
      loadSceneAssets(this, finalEndingAssets, () => this.showHerFinalPicture());
      return;
    }
    this.clearStage();
    const source = this.textures.get("her-final-pic").getSourceImage();
    const scale = Math.max(GAME_WIDTH / source.width, GAME_HEIGHT / source.height);
    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "her-final-pic").setScale(scale).setDepth(100);
    const white = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xffffff, 1).setOrigin(0).setDepth(220);
    this.stage.add(bg);
    this.createFinalPictureMotion();
    this.stage.add(white);
    this.tweens.add({
      targets: white,
      alpha: 0,
      duration: 2200,
      ease: "Sine.easeInOut",
      onComplete: () => {
        white.destroy();
        this.showFinalPictureMonologue();
        this.showFinalExitButton();
      },
    });
  }

  showFinalPictureMonologue() {
    if (!this.stage || this.finalPictureMonologue) return;
    const panelX = GAME_WIDTH - 154;
    const panelY = 58;
    const panelWidth = 270;
    const panelHeight = 276;

    const monologue = this.add
      .text(panelX, panelY + panelHeight + 18, this.getFinalMonologueText(), {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "14px",
        color: "#fff8ee",
        align: "left",
        lineSpacing: 8,
        wordWrap: { width: panelWidth - 34, useAdvancedWrap: true },
      })
      .setOrigin(0.5, 0)
      .setDepth(239)
      .setAlpha(0.96)
      .setShadow(2, 2, "#101018", 4, true, true);

    const maskShape = this.make.graphics({ x: 0, y: 0, add: false });
    maskShape.fillStyle(0xffffff, 1);
    maskShape.fillRect(panelX - panelWidth / 2 + 12, panelY + 12, panelWidth - 24, panelHeight - 24);
    const mask = maskShape.createGeometryMask();
    monologue.setMask(mask);
    this.finalPictureMonologueMask = maskShape;
    this.finalPictureMonologue = monologue;
    this.stage.add(monologue);

    const targetY = panelY - monologue.height - 28;
    this.monologueScrollTween = this.tweens.add({
      targets: monologue,
      y: targetY,
      duration: Math.max(35000, monologue.height * 68.4),
      ease: "Linear",
      onComplete: () => {
        this.monologueScrollTween = null;
        this.showFinalTitleScreen();
      },
    });
  }

  showFinalTitleScreen() {
    if (this.finalTitleShown) return;
    this.finalTitleShown = true;
    const monologue = this.finalPictureMonologue;
    if (!monologue) return;
    this.tweens.add({
      targets: monologue,
      alpha: 0,
      duration: 900,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.finalPictureMonologueMask?.destroy();
        this.finalPictureMonologueMask = null;
        this.finalPictureMonologue?.destroy();
        this.finalPictureMonologue = null;
        const title = this.add
          .text(810, 72, "Ache & Her Adventure", {
            fontFamily: "Courier New, monospace",
            fontSize: "42px",
            fontStyle: "bold",
            color: "#ffe79b",
          })
          .setOrigin(1, 0.5)
          .setShadow(3, 3, "#361426", 2, true, true)
          .setDepth(270)
          .setAlpha(0);
        this.stage.add(title);
        this.tweens.add({ targets: title, alpha: 1, duration: 1100, ease: "Sine.easeInOut" });
      },
    });
  }

  showFinalExitButton() {
    if (!this.stage || this.finalExitButton) return;
    const button = this.add.container(GAME_WIDTH - 58, 32).setDepth(260).setAlpha(0);
    const bg = this.add.rectangle(0, 0, 82, 34, 0x10191f, 0.72);
    bg.setStrokeStyle(2, 0xfff0c8, 0.82);
    const text = this.add
      .text(0, 0, "退出", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "15px",
        fontStyle: "bold",
        color: "#fff8dd",
      })
      .setOrigin(0.5);
    button.add([bg, text]);
    button.setSize(90, 42);
    button.setInteractive({ useHandCursor: true });
    button.on("pointerdown", () => bg.setFillStyle(0x263946, 0.9));
    button.on("pointerout", () => bg.setFillStyle(0x10191f, 0.72));
    button.on("pointerup", () => this.exitToCover());
    this.finalExitButton = button;
    this.stage.add(button);
    this.tweens.add({
      targets: button,
      alpha: 1,
      duration: 700,
      ease: "Sine.out",
    });
  }

  exitToCover() {
    if (this.ending) return;
    this.ending = true;
    if (typeof window !== "undefined") window.__achesFinalReturn = true;
    clearDevTestRoute();
    this.cameras.main.fadeOut(420, 12, 18, 24);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start("StartScene");
    });
  }

  createFinalPictureMotion() {
    this.finalPictureActive = true;
    this.finalPictureWaveOffset = 0;
    this.finalPictureWaves = this.add.graphics().setDepth(104);

    const sunGlow = this.add.circle(526, 154, 72, 0xffd977, 0.16).setDepth(101);
    const lampGlow = this.add.circle(133, 126, 32, 0xffb45f, 0.18).setDepth(102);
    this.tweens.add({
      targets: sunGlow,
      alpha: 0.34,
      scale: 1.16,
      duration: 2400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
    this.tweens.add({
      targets: lampGlow,
      alpha: 0.34,
      scale: 1.1,
      duration: 1300,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });

    this.finalPictureSparkles = [];
    const sparklePoints = [
      [42, 326, 0xffdca2], [74, 348, 0xfff0c5], [106, 324, 0xffd083], [166, 90, 0xffc56f],
      [198, 58, 0xffe09b], [594, 144, 0xfff3b8], [646, 118, 0xffc978], [710, 178, 0xffe5a7],
      [734, 300, 0xffd690], [782, 284, 0xffe8b1], [466, 206, 0xfff0a0], [512, 228, 0xffc773],
    ];
    sparklePoints.forEach(([x, y, color], index) => {
      const sparkle = this.add.rectangle(x, y, 4, 4, color, 0.28).setDepth(105);
      sparkle.setAngle(index % 2 === 0 ? 45 : 0);
      this.finalPictureSparkles.push(sparkle);
      this.tweens.add({
        targets: sparkle,
        y: y - 5,
        alpha: 0.76,
        scale: 1.35,
        duration: 1100 + index * 90,
        delay: index * 120,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });
    });

    this.stage.add([this.finalPictureWaves, sunGlow, lampGlow, ...this.finalPictureSparkles]);
    this.drawFinalPictureWaves(0);
  }

  updateFinalPictureMotion(delta) {
    if (!this.finalPictureWaves) return;
    this.finalPictureWaveOffset += delta * 0.0032;
    this.drawFinalPictureWaves(this.finalPictureWaveOffset);
  }

  drawFinalPictureWaves(offset) {
    const g = this.finalPictureWaves;
    if (!g) return;
    g.clear();
    g.fillStyle(0xffd878, 0.25);
    for (let row = 0; row < 8; row += 1) {
      const y = 166 + row * 13;
      const shift = Math.sin(offset + row * 0.8) * 18;
      g.fillRect(478 + shift - row * 5, y, 78 + row * 8, 2);
      g.fillRect(545 - shift * 0.5 + row * 6, y + 38, 92 - row * 5, 2);
    }
    g.fillStyle(0x9fcfe7, 0.16);
    for (let x = 300; x < GAME_WIDTH; x += 56) {
      const y = 178 + Math.sin(offset + x * 0.025) * 5;
      g.fillRect(x, y, 42, 2);
      g.fillRect(x + 18, y + 42, 58, 2);
    }
  }

  createFloatingChatBubble({ text, x, y, width, color }) {
    const isBlue = color === "blue";
    const bubble = this.add.container(x, y + 16).setAlpha(0).setDepth(12);
    const height = text.length <= 4 ? 32 : 42;
    const bg = this.add.graphics();
    bg.fillStyle(isBlue ? 0x7db7ff : 0xe9edf2, 0.88);
    bg.fillRoundedRect(0, 0, width, height, 14);
    bg.fillTriangle(isBlue ? width - 34 : 24, height - 2, isBlue ? width - 12 : 46, height - 2, isBlue ? width - 18 : 30, height + 12);
    bg.lineStyle(2, isBlue ? 0xc5e1ff : 0xffffff, 0.74);
    bg.strokeRoundedRect(0, 0, width, height, 14);
    const label = this.add
      .text(width / 2, height / 2, text, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "14px",
        fontStyle: "bold",
        color: isBlue ? "#10253d" : "#27313a",
        align: "center",
        wordWrap: { width: width - 24, useAdvancedWrap: true },
      })
      .setOrigin(0.5);
    bubble.add([bg, label]);
    return bubble;
  }

  setDistanceSystemVisible(visible) {
    this.connectionLine?.setVisible(visible);
    this.boy?.setVisible(visible);
    this.her?.setVisible(visible);
    this.distanceText?.setVisible(visible);
  }

  pushChatMessage(from, text) {
    this.chatMessages.push({ from, text });
    if (this.chatMessages.length > 8) this.chatMessages.shift();
    this.renderChatMessages();
  }

  renderChatMessages() {
    this.chatMessageLayer?.destroy(true);
    this.chatMessageLayer = this.add.container(0, 0).setDepth(11);
    this.stage.add(this.chatMessageLayer);
    const layout = this.liveChatLayout ?? {
      messageBaseX: 536,
      messageBaseY: 108,
      rowWidth: 274,
      rowHeight: 27,
    };
    const visibleMessages = this.chatMessages.slice(-5);
    visibleMessages.forEach((message, index) => {
      const isMe = message.from === "me";
      const rowY = layout.messageBaseY + index * layout.rowHeight;
      const row = this.add.container(layout.messageBaseX, rowY);
      const rowBack = this.add.rectangle(layout.rowWidth / 2, 0, layout.rowWidth, 24, isMe ? 0x1a2538 : 0x151622, isMe ? 0.62 : 0.44);
      rowBack.setStrokeStyle(1, isMe ? 0xff8fb5 : 0x56415e, isMe ? 0.42 : 0.3);
      const miniAvatar = this.add.image(11, 0, isMe ? "his-avatar" : "her-avatar").setDisplaySize(17, 17);
      const name = this.add
        .text(24, -8, isMe ? "Ache" : "她", {
          fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
          fontSize: "9px",
          fontStyle: "bold",
          color: isMe ? "#9bd7ff" : "#ffadd2",
        })
        .setOrigin(0, 0.5);
      const text = this.add
        .text(24, 6, message.text, {
          fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
          fontSize: "9px",
          color: "#eef3f7",
          align: "left",
          wordWrap: { width: layout.rowWidth - 34, useAdvancedWrap: true },
        })
        .setOrigin(0, 0.5);
      row.add([rowBack, miniAvatar, name, text]);
      this.chatMessageLayer.add(row);
    });
  }

  renderChatChoices(options) {
    this.choiceLayer?.destroy(true);
    this.choiceLayer = this.add.container(0, 0).setDepth(12);
    this.stage.add(this.choiceLayer);
    this.selectedChatOption = "";
    const layout = this.liveChatLayout ?? {
      choiceCenterX: 669,
      choiceStartY: 258,
      choiceWidth: 258,
    };
    options.forEach((option, index) => {
      const button = this.makeDanmakuChoice(layout.choiceCenterX, layout.choiceStartY + index * 18, layout.choiceWidth, 16, option, () => {
        this.selectedChatOption = option;
        this.chatInputValue = option;
        if (this.chatInput) {
          this.chatInput.value = option;
          this.chatInput.focus();
        }
        this.chatStatusText.setText("已填入弹幕，可以改写。");
      });
      this.choiceLayer.add(button);
    });
  }

  fillChatInputFromChoice() {
    if (!this.selectedChatOption) {
      this.chatStatusText.setText("先点选一条弹幕。");
      return;
    }
    this.chatInputValue = this.selectedChatOption;
    if (this.chatInput) {
      this.chatInput.value = this.selectedChatOption;
      this.chatInput.focus();
    }
  }

  sendChatInput() {
    const value = (this.chatInput?.value || this.chatInputValue || "").trim();
    if (!value) {
      this.chatStatusText.setText("先写一条弹幕。");
      return;
    }
    this.pushChatMessage("me", value);
    this.addCloseness(0.08);
    this.chatStep += 1;
    if (this.chatInput) this.chatInput.value = "";
    this.chatInputValue = "";
    if (this.chatStep >= this.chatRounds.length) {
      this.choiceLayer?.destroy(true);
      this.chatStatusText.setText("连麦暂时到这里。");
      this.pushChatMessage("her", "Then maybe... tell me more about that city next time.");
      this.cleanupChatDomInput();
      return;
    }
    const nextRound = this.chatRounds[this.chatStep];
    this.time.delayedCall(260, () => {
      this.pushChatMessage("her", nextRound.her);
      this.renderChatChoices(nextRound.options);
      this.chatStatusText.setText("继续发一条弹幕。");
    });
  }

  makeDanmakuChoice(x, y, width, height, label, onClick) {
    const chip = this.add.container(x, y).setDepth(12);
    const bg = this.add.graphics();
    const draw = (fill, alpha, strokeAlpha) => {
      bg.clear();
      bg.fillStyle(fill, alpha);
      bg.fillRoundedRect(-width / 2, -height / 2, width, height, 8);
      bg.lineStyle(1, 0x35556a, strokeAlpha);
      bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 8);
    };
    draw(0x141b24, 0.82, 0.46);
    const text = this.add
      .text(-width / 2 + 9, 0, label.length > 42 ? `${label.slice(0, 41)}...` : label, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "9px",
        color: "#d8e3eb",
        align: "left",
        wordWrap: { width: width - 18, useAdvancedWrap: true },
      })
      .setOrigin(0, 0.5);
    chip.add([bg, text]);
    chip.setSize(width, height + 4);
    chip.setInteractive({ useHandCursor: true });
    chip.on("pointerover", () => draw(0x183044, 0.92, 0.74));
    chip.on("pointerout", () => draw(0x141b24, 0.82, 0.46));
    chip.on("pointerup", onClick);
    return chip;
  }

  createChatDomInput(gameX, gameY, gameWidth, gameHeight, placeholder = "Type here") {
    if (typeof document === "undefined") return;
    this.cleanupChatDomInput();
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = placeholder;
    input.autocomplete = "off";
    input.spellcheck = false;
    input.style.position = "fixed";
    input.style.zIndex = "20";
    input.style.border = "1px solid rgba(48, 61, 77, 0.95)";
    input.style.borderRadius = "3px";
    input.style.background = "rgba(18, 24, 33, 0.94)";
    input.style.color = "#f6f7fb";
    input.style.outline = "none";
    input.style.padding = "0 7px";
    input.style.fontFamily = 'Inter, "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
    input.style.fontWeight = "500";
    input.style.boxSizing = "border-box";
    input.style.boxShadow = "none";
    input.style.caretColor = "#00aeec";
    input.addEventListener("input", () => {
      this.chatInputValue = input.value;
    });
    document.body.appendChild(input);
    this.chatInput = input;
    this.chatInputRect = { gameX, gameY, gameWidth, gameHeight };
    this.positionChatDomInput = () => {
      if (!this.chatInput || !this.game?.canvas) return;
      const rect = this.game.canvas.getBoundingClientRect();
      this.chatInput.style.left = `${rect.left + gameX / GAME_WIDTH * rect.width}px`;
      this.chatInput.style.top = `${rect.top + gameY / GAME_HEIGHT * rect.height}px`;
      this.chatInput.style.width = `${gameWidth / GAME_WIDTH * rect.width}px`;
      this.chatInput.style.height = `${gameHeight / GAME_HEIGHT * rect.height}px`;
      this.chatInput.style.fontSize = `${Math.max(11, Math.round(12 / GAME_HEIGHT * rect.height))}px`;
    };
    this.positionChatDomInput();
    window.addEventListener("resize", this.positionChatDomInput);
  }

  cleanupChatDomInput() {
    if (typeof window !== "undefined" && this.positionChatDomInput) {
      window.removeEventListener("resize", this.positionChatDomInput);
    }
    this.positionChatDomInput = null;
    this.chatInput?.remove();
    this.chatInput = null;
  }

  startVoiceCall() {
    if (this.voiceStarted) return;
    this.voiceStarted = true;
    this.voiceButton?.destroy();
    this.addCloseness(0.07);
    this.onlineText.setText("那天，他在一次线上英语练习里遇见了一个温柔的人。最开始，只是普通的英语聊天。");
    this.stage.add(this.createReplyPanel("Hi, can you hear me?", ["Yes, I can hear you.", "Nice to meet you."], () => {
      this.addCloseness(0.08);
      this.onlineText.setText("一句句英文之后，沉默没有那么尴尬，屏幕那端的人也不再只是声音。");
      this.stage.add(this.createReplyPanel("What keeps you practicing English?", ["Research is hard, but I still want to try.", "I want to meet a wider world."], () => {
        this.addCloseness(0.08);
        this.showTopicBubbles();
      }, 226));
    }, 226));
  }

  createReplyPanel(prompt, replies, onDone, y) {
    const panel = this.add.container(GAME_WIDTH / 2, y).setDepth(11);
    const bg = this.add.rectangle(0, 0, 540, 86, 0x0f1820, 0.92);
    bg.setStrokeStyle(2, 0x89c8d8, 0.55);
    const promptText = this.add
      .text(0, -26, prompt, {
        fontFamily: "Courier New, monospace",
        fontSize: "16px",
        fontStyle: "bold",
        color: "#b9f0f0",
      })
      .setOrigin(0.5);
    panel.add([bg, promptText]);
    replies.forEach((reply, index) => {
      panel.add(this.makeFinalButton(-136 + index * 272, 20, 244, 30, reply, () => {
        panel.destroy();
        onDone();
      }, { fontSize: "12px", fill: 0x243946, textColor: "#fff8dd" }));
    });
    return panel;
  }

  showTopicBubbles() {
    this.onlineText.setText("他们开始聊生活、毕业、科研压力、快乐、痛苦和未来。那些话题像一点点亮起的气泡。");
    const topics = [
      ["graduation", 180, 154],
      ["research", 318, 188],
      ["happiness", 460, 154],
      ["pain", 596, 190],
      ["future", 424, 238],
    ];
    topics.forEach(([label, x, y]) => {
      const bubble = this.add.container(x, y).setDepth(13);
      const circle = this.add.circle(0, 0, 34, 0x314a58, 0.92);
      circle.setStrokeStyle(2, 0x8fd8e8, 0.75);
      const text = this.add
        .text(0, 0, label, {
          fontFamily: "Courier New, monospace",
          fontSize: "13px",
          fontStyle: "bold",
          color: "#fff8dd",
        })
        .setOrigin(0.5);
      bubble.add([circle, text]);
      bubble.setSize(76, 76);
      bubble.setInteractive({ useHandCursor: true });
      bubble.on("pointerdown", () => circle.setFillStyle(0x4f6f72, 1));
      bubble.on("pointerup", () => {
        this.topicCount += 1;
        this.addCloseness(0.035);
        this.tweens.add({
          targets: bubble,
          alpha: 0,
          scale: 1.25,
          duration: 220,
          onComplete: () => bubble.destroy(),
        });
        if (this.topicCount >= topics.length) this.showInvitationBridge();
      });
      this.stage.add(bubble);
    });
  }

  showInvitationBridge() {
    this.onlineText.setText("后来，她说毕业旅行想去那座城市。他第一次很想把屏幕里的距离，变成真实的一段路。");
    this.time.delayedCall(360, () => {
      this.stage.add(this.makeFinalButton(GAME_WIDTH / 2, 346, 164, 38, "写下邀请", () => this.showInviteStage()));
    });
  }

  showInviteStage() {
    this.clearStage();
    this.setDistanceSystemVisible(true);
    this.setCloseness(Math.max(this.closeness, 0.56));
    this.setActorPositions(186, 658, 286, 1.32);
    this.inviteIndex = 0;
    const g = this.add.graphics();
    g.fillStyle(0x101820, 0.95);
    g.fillRoundedRect(114, 82, 616, 246, 8);
    g.lineStyle(2, 0x8fd8e8, 0.48);
    g.strokeRoundedRect(114, 82, 616, 246, 8);
    g.fillStyle(0x1d2b35, 1);
    g.fillRoundedRect(144, 116, 556, 86, 6);
    g.fillStyle(0x223946, 1);
    g.fillRoundedRect(144, 220, 556, 54, 6);
    this.stage.add(g);

    this.inviteText = this.add
      .text(GAME_WIDTH / 2, 284, "", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "20px",
        fontStyle: "bold",
        color: "#ffe69a",
        align: "center",
        wordWrap: { width: 500, useAdvancedWrap: true },
      })
      .setOrigin(0.5);
    this.stage.add(this.inviteText);

    const inviteTitle = this.add
      .text(GAME_WIDTH / 2, 102, "把那句话拼出来", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "18px",
        fontStyle: "bold",
        color: "#fff8dd",
      })
      .setOrigin(0.5)
      .setDepth(10);
    this.stage.add(inviteTitle);

    this.inviteParts = ["要不要", "在那座城市", "见一面", "？"];
    const positions = [
      [214, 158],
      [372, 158],
      [530, 158],
      [646, 158],
    ];
    this.inviteParts.forEach((part, index) => {
      const button = this.makeFinalButton(positions[index][0], positions[index][1], index === 3 ? 58 : 116, 36, part, () => {
        if (index !== this.inviteIndex) {
          this.inviteText.setText("先把心里的话按顺序说出来。");
          return;
        }
        button.disableInteractive();
        button.setAlpha(0.38);
        this.inviteIndex += 1;
        this.addCloseness(0.045);
        this.inviteText.setText(this.inviteParts.slice(0, this.inviteIndex).join(""));
        if (this.inviteIndex >= this.inviteParts.length) this.showSendInviteButton();
      }, { fill: 0x263946, textColor: "#fff8dd" });
      this.stage.add(button);
    });
  }

  showSendInviteButton() {
    this.stage.add(this.makeFinalButton(GAME_WIDTH / 2, 346, 128, 38, "发送", () => {
      this.addCloseness(0.08);
      this.inviteText.setText("她回：好呀，那就在那座城市见。");
      this.time.delayedCall(760, () => this.showCityMapStage());
    }));
  }

  showCityMapStage() {
    this.clearStage();
    this.setDistanceSystemVisible(true);
    this.setCloseness(Math.max(this.closeness, 0.74));
    this.setActorPositions(224, 620, 300, 1.25);
    this.mapIndex = 0;
    const g = this.add.graphics();
    g.fillStyle(0x132026, 0.96);
    g.fillRoundedRect(88, 82, 668, 246, 8);
    g.lineStyle(2, 0x9fb8a7, 0.52);
    g.strokeRoundedRect(88, 82, 668, 246, 8);
    g.lineStyle(4, 0x6f8d8c, 0.7);
    g.beginPath();
    g.moveTo(168, 250);
    g.lineTo(300, 160);
    g.lineTo(456, 202);
    g.lineTo(602, 138);
    g.lineTo(690, 250);
    g.strokePath();
    this.stage.add(g);

    this.mapText = this.add
      .text(GAME_WIDTH / 2, 344, "那座城市真的出现在他们之间。车站、景点、美食、雨夜街道，都成了新的记忆。", {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "17px",
        color: "#fff8dd",
        align: "center",
        lineSpacing: 5,
        wordWrap: { width: 610, useAdvancedWrap: true },
      })
      .setOrigin(0.5);
    this.stage.add(this.mapText);

    this.mapStops = [
      { label: "车站", x: 168, y: 250, text: "第一次见面的时候，他紧张得连一句自然的开场白都要在心里练很多遍。" },
      { label: "景点", x: 300, y: 160, text: "他们一起走过那座城市的景点。照片里是风景，心里记住的却是她笑起来的样子。" },
      { label: "美食", x: 456, y: 202, text: "吃饭的时候，话题从直播间延伸到真实生活。快乐、压力、未来，都变得可以慢慢说。" },
      { label: "雨夜", x: 602, y: 138, text: "夜色和雨声把城市变得很安静。他忽然觉得，原来真实的靠近是这样的。" },
      { label: "拥抱", x: 690, y: 250, text: "离别之前，他们都没有急着说话。那一刻，距离已经短到只剩一步。" },
    ];
    this.mapStops.forEach((stop, index) => this.stage.add(this.createMapStop(stop, index)));
  }

  createMapStop(stop, index) {
    const node = this.add.container(stop.x, stop.y).setDepth(12);
    const dot = this.add.rectangle(0, 0, 68, 40, index === 0 ? 0xf4d77d : 0x263946, 0.96);
    dot.setStrokeStyle(2, 0xf4d77d, index === 0 ? 0.95 : 0.4);
    const text = this.add
      .text(0, 0, stop.label, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: "15px",
        fontStyle: "bold",
        color: index === 0 ? "#132129" : "#fff8dd",
      })
      .setOrigin(0.5);
    node.add([dot, text]);
    node.setSize(76, 48);
    node.setInteractive({ useHandCursor: true });
    node.on("pointerup", () => {
      if (index !== this.mapIndex) return;
      dot.setFillStyle(0xffe6a5, 1);
      text.setColor("#132129");
      this.mapText.setText(stop.text);
      this.addCloseness(0.02);
      this.mapIndex += 1;
      if (this.mapIndex < this.mapStops.length) {
        const next = this.mapStops[this.mapIndex];
        const nextNode = this.stage.list.find((child) => child?.getData?.("stopIndex") === this.mapIndex);
        nextNode?.list?.[0]?.setFillStyle(0xf4d77d, 0.96);
        nextNode?.list?.[0]?.setStrokeStyle(2, 0xf4d77d, 0.95);
        nextNode?.list?.[1]?.setColor("#132129");
        this.mapText.setText(`${stop.text}\n\n下一站：${next.label}`);
      } else {
        this.time.delayedCall(520, () => this.showHerMazeIntroStage());
      }
    });
    node.setData("stopIndex", index);
    return node;
  }

  makeFinalButton(x, y, width, height, label, onClick, options = {}) {
    const button = this.add.container(x, y).setDepth(8);
    const bg = this.add.rectangle(0, 0, width, height, options.fill ?? 0xf4d77d, options.alpha ?? 0.98);
    bg.setStrokeStyle(2, options.stroke ?? 0x704b2a, 0.85);
    const text = this.add
      .text(0, 0, label, {
        fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        fontSize: options.fontSize ?? "16px",
        fontStyle: "bold",
        color: options.textColor ?? "#132129",
        align: "center",
        wordWrap: { width: width - 14, useAdvancedWrap: true },
      })
      .setOrigin(0.5);
    button.add([bg, text]);
    button.setSize(width + 8, height + 8);
    button.setInteractive({ useHandCursor: true });
    button.on("pointerdown", () => bg.setFillStyle(options.downFill ?? 0xffefb0, 1));
    button.on("pointerup", () => {
      bg.setFillStyle(options.fill ?? 0xf4d77d, options.alpha ?? 0.98);
      onClick();
    });
    return button;
  }

  celebrate() {
    for (let index = 0; index < 18; index += 1) {
      const heart = this.add.image(GAME_WIDTH / 2, 316, "pixel-heart-small").setDepth(20);
      heart.setScale(Phaser.Math.FloatBetween(0.8, 1.4));
      this.tweens.add({
        targets: heart,
        x: Phaser.Math.Between(38, GAME_WIDTH - 38),
        y: Phaser.Math.Between(58, 270),
        alpha: 0,
        duration: Phaser.Math.Between(900, 1500),
        ease: "Cubic.out",
        onComplete: () => heart.destroy(),
      });
    }
  }
}

function createPixelTextures(scene) {
  makeChildPlayer(scene);
  makeAdult(scene);
  makeCampusBoy(scene, "campus-little-boy", 0xf2b15f, 0x4771b8, false);
  makeCampusBoy(scene, "campus-kindergarten-boy", 0xff8b72, 0x4771b8, false);
  makeCampusBoy(scene, "campus-primary-boy", 0x5aa9d6, 0x2f4f78, false);
  makeCampusMiddleBoy(scene);
  makeCampusHighBoy(scene);
  makeDormBoy(scene);
  makeMazePlayer(scene);
  makeDormActionBolt(scene);
  makeDormEnemies(scene);
  makeDormClutterTextures(scene);
  makeDormBuriedBook(scene);
  makePlayer(scene, "player", 0x30251d, 0xffc7a2, 0xe85c68, 0x263c65);
  makePlayer(scene, "partner", 0x44283f, 0xffc7a2, 0x74b6a0, 0x5f496e);
  makeTree(scene);
  makeTinyFlower(scene, "tiny-flower-pink", 0xff8faf);
  makeTinyFlower(scene, "tiny-flower-blue", 0x8fd8ff);
  makeSign(scene);
  makeCampusFragmentHomework(scene);
  makeCampusFragmentDesk(scene);
  makeCampusFragmentBasketball(scene);
  makeCampusFragmentClassmate(scene);
  makeCampusFragmentBlackboard(scene);
  makeHeartBubble(scene);
  makeCampusHurdle(scene);
  makeSolidHitbox(scene);
  makeGameCard(scene);
  makePrimaryFragment(scene);
  makeUltramanObstacle(scene);
  makeHomeworkObstacle(scene);
  makeBullyShadow(scene);
  makeSchoolBox(scene);
  makeSchoolTarget(scene);
  makeSchoolExit(scene);
  makeMiddleSpikes(scene);
  makeRollingStone(scene);
  makeMovingEnemy(scene);
  makeDropExit(scene);
  makeHighGateBar(scene);
  makeHighPlane(scene);
  makePlaneBullet(scene);
  makeExamEnemy(scene);
  makePaperEnemy(scene);
  makeVideoGameObstacle(scene);
  makeLoveLetterObstacle(scene);
  makeTeacherObstacle(scene);
  makeFamilyObstacle(scene);
  makeItemToyPlane(scene);
  makeItemKite(scene);
  makeItemMarbles(scene);
  makeItemToyCar(scene);
  makeItemGamepad(scene);
  makeItemLetter(scene);
  makeItemCamera(scene);
  makeItemTea(scene);
  makeItemStar(scene);
  makeItemMusic(scene);
  makeItemFlower(scene);
  makeSmallStar(scene);
  makeHeart(scene, "big-heart", 0xff697a, 0xffa0ae, 42);
  makeHeart(scene, "pixel-heart-small", 0xff697a, 0xffa0ae, 18);
}

function freshGraphics(scene) {
  return scene.make.graphics({ x: 0, y: 0, add: false });
}

function makeChildPlayer(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x2b1f1a, 1);
  g.fillRect(8, 4, 16, 7);
  g.fillRect(6, 10, 20, 7);
  g.fillStyle(0xf0b07c, 1);
  g.fillRect(10, 12, 12, 10);
  g.fillStyle(0x1a1a1f, 1);
  g.fillRect(12, 16, 3, 3);
  g.fillRect(18, 16, 3, 3);
  g.fillStyle(0x63a7d5, 1);
  g.fillRect(8, 22, 16, 9);
  g.fillRect(5, 24, 6, 7);
  g.fillRect(21, 24, 6, 7);
  g.fillStyle(0xd9bd64, 1);
  g.fillRect(9, 31, 6, 6);
  g.fillRect(17, 31, 6, 6);
  g.fillStyle(0x382819, 1);
  g.fillRect(8, 37, 8, 3);
  g.fillRect(16, 37, 8, 3);
  g.generateTexture("boy-player", 32, 40);
  g.destroy();
}

function makeAdult(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x3c2b26, 1);
  g.fillRect(8, 2, 16, 8);
  g.fillRect(6, 8, 20, 8);
  g.fillStyle(0xf1bb8d, 1);
  g.fillRect(10, 10, 12, 10);
  g.fillStyle(0x1a1a1f, 1);
  g.fillRect(11, 14, 3, 3);
  g.fillRect(18, 14, 3, 3);
  g.fillStyle(0x6d4458, 1);
  g.fillRect(7, 22, 18, 12);
  g.fillRect(4, 24, 6, 9);
  g.fillRect(22, 24, 6, 9);
  g.fillStyle(0x2e343f, 1);
  g.fillRect(8, 34, 7, 5);
  g.fillRect(17, 34, 7, 5);
  g.generateTexture("adult", 32, 42);
  g.destroy();
}

function makeCampusBoy(scene, key, shirt, pants, glasses) {
  const g = freshGraphics(scene);
  g.fillStyle(0x2b211d, 1);
  g.fillRect(8, 4, 16, 7);
  g.fillRect(6, 10, 20, 7);
  g.fillStyle(0xf0b07c, 1);
  g.fillRect(10, 12, 12, 10);
  g.fillStyle(0x1a1a1f, 1);
  g.fillRect(12, 16, 3, 3);
  g.fillRect(18, 16, 3, 3);

  if (glasses) {
    g.lineStyle(2, 0x18252b, 1);
    g.strokeRect(10, 15, 6, 5);
    g.strokeRect(17, 15, 6, 5);
    g.fillStyle(0x18252b, 1);
    g.fillRect(16, 17, 2, 1);
  }

  g.fillStyle(shirt, 1);
  g.fillRect(8, 22, 16, 10);
  g.fillRect(5, 24, 6, 8);
  g.fillRect(21, 24, 6, 8);
  g.fillStyle(0xffe7a3, 1);
  g.fillRect(14, 22, 4, 10);
  g.fillStyle(pants, 1);
  g.fillRect(9, 32, 6, 7);
  g.fillRect(17, 32, 6, 7);
  g.fillStyle(0x231d22, 1);
  g.fillRect(8, 39, 8, 3);
  g.fillRect(16, 39, 8, 3);
  g.generateTexture(key, 32, 44);
  g.destroy();
}

function makeCampusMiddleBoy(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x2b211d, 1);
  g.fillRect(8, 3, 18, 7);
  g.fillRect(6, 10, 22, 7);
  g.fillStyle(0xf0b07c, 1);
  g.fillRect(11, 13, 12, 11);
  g.fillStyle(0x1a1a1f, 1);
  g.fillRect(12, 17, 3, 3);
  g.fillRect(19, 17, 3, 3);
  g.lineStyle(2, 0x18252b, 1);
  g.strokeRect(10, 16, 6, 5);
  g.strokeRect(18, 16, 6, 5);
  g.fillStyle(0x18252b, 1);
  g.fillRect(16, 18, 2, 1);
  g.fillStyle(0xf0d36d, 1);
  g.fillRect(8, 25, 18, 11);
  g.fillRect(5, 27, 6, 9);
  g.fillRect(24, 27, 5, 9);
  g.fillStyle(0x4f5b68, 1);
  g.fillRect(8, 25, 3, 18);
  g.fillStyle(0xffe7a3, 1);
  g.fillRect(16, 25, 4, 11);
  g.fillStyle(0x2f3a48, 1);
  g.fillRect(10, 36, 6, 8);
  g.fillRect(19, 36, 6, 8);
  g.fillStyle(0x231d22, 1);
  g.fillRect(9, 44, 8, 3);
  g.fillRect(18, 44, 8, 3);
  g.generateTexture("campus-middle-boy", 34, 48);
  g.destroy();
}

function makeCampusHighBoy(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x211915, 1);
  g.fillRect(9, 3, 18, 7);
  g.fillRect(7, 10, 22, 8);
  g.fillStyle(0xf0b07c, 1);
  g.fillRect(12, 14, 13, 12);
  g.fillStyle(0x1a1a1f, 1);
  g.fillRect(13, 18, 3, 3);
  g.fillRect(21, 18, 3, 3);
  g.lineStyle(2, 0x1b2630, 1);
  g.strokeRect(11, 17, 7, 5);
  g.strokeRect(20, 17, 7, 5);
  g.fillStyle(0x1b2630, 1);
  g.fillRect(18, 19, 2, 1);
  g.fillStyle(0xf5efe0, 1);
  g.fillRect(8, 27, 20, 13);
  g.fillRect(5, 29, 6, 10);
  g.fillRect(26, 29, 5, 10);
  g.fillStyle(0x455d8c, 1);
  g.fillRect(17, 27, 4, 13);
  g.fillRect(10, 27, 3, 22);
  g.fillStyle(0xe85c68, 1);
  g.fillRect(18, 29, 3, 8);
  g.fillStyle(0x263c65, 1);
  g.fillRect(10, 40, 7, 10);
  g.fillRect(20, 40, 7, 10);
  g.fillStyle(0x17191f, 1);
  g.fillRect(9, 50, 9, 3);
  g.fillRect(19, 50, 9, 3);
  g.generateTexture("campus-high-boy", 36, 54);
  g.destroy();
}

function makeDormBoy(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x211915, 1);
  g.fillRect(8, 4, 19, 7);
  g.fillRect(6, 10, 23, 7);
  g.fillStyle(0xf0b07c, 1);
  g.fillRect(11, 13, 13, 12);
  g.fillStyle(0x1a1a1f, 1);
  g.fillRect(12, 17, 3, 3);
  g.fillRect(21, 17, 3, 3);
  g.fillStyle(0x5aa0a8, 1);
  g.fillRect(8, 27, 20, 12);
  g.fillRect(5, 29, 7, 9);
  g.fillRect(26, 29, 6, 9);
  g.fillStyle(0xffe7a3, 1);
  g.fillRect(17, 27, 3, 12);
  g.fillStyle(0x273344, 1);
  g.fillRect(10, 39, 7, 8);
  g.fillRect(20, 39, 7, 8);
  g.fillStyle(0x15191f, 1);
  g.fillRect(8, 47, 10, 3);
  g.fillRect(19, 47, 10, 3);
  g.generateTexture("dorm-boy", 38, 52);
  g.destroy();
}

function makeMazePlayer(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x111111, 1);
  g.fillRect(8, 3, 18, 6);
  g.fillRect(6, 8, 22, 8);
  g.fillStyle(0xf0b07c, 1);
  g.fillRect(11, 13, 12, 10);
  g.fillStyle(0x0f1116, 1);
  g.fillRect(12, 16, 3, 3);
  g.fillRect(20, 16, 3, 3);
  g.fillStyle(0xffffff, 1);
  g.fillRect(8, 25, 19, 12);
  g.fillRect(5, 27, 6, 9);
  g.fillRect(25, 27, 6, 9);
  g.fillStyle(0xd9e0e8, 1);
  g.fillRect(11, 25, 13, 3);
  g.fillStyle(0x05070b, 1);
  g.fillRect(10, 37, 7, 10);
  g.fillRect(19, 37, 7, 10);
  g.fillStyle(0x202632, 1);
  g.fillRect(9, 47, 9, 3);
  g.fillRect(18, 47, 9, 3);
  g.fillStyle(0xffffff, 0.95);
  g.fillRect(10, 48, 7, 2);
  g.fillRect(19, 48, 7, 2);
  g.generateTexture("maze-player", 36, 52);
  g.destroy();
}

function makeDormActionBolt(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xfff5bf, 1);
  g.fillTriangle(10, 0, 18, 0, 13, 9);
  g.fillTriangle(12, 8, 4, 20, 12, 20);
  g.fillStyle(0xf4d77d, 1);
  g.fillRect(9, 7, 7, 7);
  g.fillStyle(0xffffff, 0.78);
  g.fillRect(12, 3, 3, 5);
  g.generateTexture("dorm-action-bolt", 22, 22);
  g.destroy();
}

function makeDormEnemies(scene) {
  makeDormGameInvite(scene);
  makeDormSleepiness(scene);
  makeDormTakeoutEnemy(scene);
  makeDormShortVideo(scene);
  makeDormBalanceEnemy(scene);
}

function makeDormGameInvite(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xfff0b8, 1);
  g.fillRect(4, 5, 42, 28);
  g.fillStyle(0xf4d77d, 1);
  g.fillRect(4, 5, 42, 7);
  g.fillStyle(0x2f3a48, 1);
  g.fillRect(12, 18, 26, 13);
  g.fillRect(9, 22, 7, 7);
  g.fillRect(34, 22, 7, 7);
  g.fillStyle(0x8fcce6, 1);
  g.fillRect(18, 21, 6, 3);
  g.fillRect(20, 19, 3, 7);
  g.fillStyle(0xff7d9f, 1);
  g.fillRect(31, 21, 4, 4);
  g.fillStyle(0x17232a, 1);
  g.fillRect(8, 14, 28, 3);
  g.generateTexture("dorm-enemy-game", 50, 38);
  g.destroy();
}

function makeDormSleepiness(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xd8efff, 0.92);
  g.fillRect(6, 10, 38, 18);
  g.fillRect(12, 5, 24, 28);
  g.fillStyle(0x6aaed6, 1);
  g.fillRect(13, 11, 16, 4);
  g.fillRect(25, 15, 4, 4);
  g.fillRect(13, 19, 16, 4);
  g.fillRect(31, 10, 9, 3);
  g.fillRect(37, 13, 3, 3);
  g.fillRect(31, 16, 9, 3);
  g.fillStyle(0xffffff, 0.76);
  g.fillRect(12, 8, 6, 4);
  g.generateTexture("dorm-enemy-sleep", 50, 38);
  g.destroy();
}

function makeDormTakeoutEnemy(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xe0aa5e, 1);
  g.fillRect(9, 12, 28, 24);
  g.fillStyle(0xfff0b8, 1);
  g.fillRect(12, 16, 22, 10);
  g.fillStyle(0xd46a4a, 1);
  g.fillRect(16, 28, 14, 4);
  g.fillStyle(0x7a5638, 1);
  g.fillRect(15, 8, 16, 5);
  g.fillRect(13, 9, 4, 10);
  g.fillRect(29, 9, 4, 10);
  g.fillStyle(0xffffff, 0.65);
  g.fillRect(14, 17, 7, 3);
  g.generateTexture("dorm-enemy-takeout", 46, 42);
  g.destroy();
}

function makeDormShortVideo(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x10191f, 1);
  g.fillRect(8, 3, 26, 40);
  g.fillStyle(0x2a3a45, 1);
  g.fillRect(11, 7, 20, 31);
  g.fillStyle(0xff7d9f, 1);
  g.fillTriangle(17, 15, 17, 29, 28, 22);
  g.fillStyle(0x8fcce6, 1);
  g.fillRect(15, 33, 12, 3);
  g.fillStyle(0xffffff, 0.64);
  g.fillRect(13, 9, 6, 4);
  g.generateTexture("dorm-enemy-video", 42, 48);
  g.destroy();
}

function makeDormBalanceEnemy(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xe85c68, 0.26);
  g.fillCircle(24, 24, 22);
  g.fillStyle(0x6d2d35, 1);
  g.fillRect(8, 15, 31, 22);
  g.fillStyle(0x9a4b55, 1);
  g.fillRect(12, 19, 27, 14);
  g.fillStyle(0xf4d77d, 1);
  g.fillRect(33, 22, 8, 8);
  g.fillStyle(0xfff5bf, 1);
  g.fillRect(20, 7, 7, 19);
  g.fillRect(20, 30, 7, 6);
  g.generateTexture("dorm-enemy-balance", 48, 48);
  g.destroy();
}

function makeDormClutterTextures(scene) {
  makeDormClutter(scene, "dorm-clutter-takeout", 42, 28, (g) => {
    g.fillStyle(0xf4d77d, 1);
    g.fillRect(6, 8, 30, 14);
    g.fillStyle(0xd67935, 1);
    g.fillRect(10, 12, 22, 4);
    g.fillStyle(0x7a5638, 1);
    g.fillRect(12, 22, 18, 4);
  });
  makeDormClutter(scene, "dorm-clutter-bottle", 22, 38, (g) => {
    g.fillStyle(0x8fcce6, 1);
    g.fillRect(8, 7, 7, 25);
    g.fillStyle(0x5aa0a8, 1);
    g.fillRect(9, 3, 5, 6);
    g.fillStyle(0xffffff, 0.66);
    g.fillRect(10, 11, 3, 12);
  });
  makeDormClutter(scene, "dorm-clutter-clothes", 46, 30, (g) => {
    g.fillStyle(0x7d68cd, 1);
    g.fillRect(8, 12, 24, 10);
    g.fillStyle(0x5aa0a8, 1);
    g.fillRect(18, 7, 20, 10);
    g.fillStyle(0x2f3a48, 1);
    g.fillRect(23, 19, 16, 6);
  });
  makeDormClutter(scene, "dorm-clutter-headphones", 42, 32, (g) => {
    g.lineStyle(5, 0x202630, 1);
    g.strokeCircle(21, 18, 13);
    g.fillStyle(0x202630, 1);
    g.fillRect(7, 17, 8, 12);
    g.fillRect(27, 17, 8, 12);
    g.fillStyle(0x8fcce6, 1);
    g.fillRect(10, 20, 4, 5);
    g.fillRect(28, 20, 4, 5);
  });
  makeDormClutter(scene, "dorm-clutter-schedule", 42, 34, (g) => {
    g.fillStyle(0xfff6d5, 1);
    g.fillTriangle(7, 8, 36, 5, 31, 29);
    g.fillStyle(0x6aaed6, 1);
    g.fillRect(14, 13, 16, 3);
    g.fillRect(13, 20, 12, 3);
    g.fillStyle(0xe85c68, 1);
    g.fillRect(29, 7, 4, 18);
  });
  makeDormClutter(scene, "dorm-clutter-textbook", 44, 32, (g) => {
    g.fillStyle(0x9ecf9d, 1);
    g.fillRect(8, 7, 28, 19);
    g.fillStyle(0x5f9a64, 1);
    g.fillRect(11, 10, 4, 16);
    g.fillStyle(0xfff5bf, 1);
    g.fillRect(18, 13, 12, 3);
    g.fillRect(18, 19, 10, 3);
  });
}

function makeDormClutter(scene, key, width, height, draw) {
  const g = freshGraphics(scene);
  g.fillStyle(0x05080b, 0.16);
  g.fillRect(4, height - 7, width - 8, 5);
  draw(g);
  g.generateTexture(key, width, height);
  g.destroy();
}

function makeDormBuriedBook(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xffe79b, 0.22);
  g.fillRect(3, 4, 54, 34);
  g.fillStyle(0x9ecf9d, 1);
  g.fillRect(12, 12, 34, 22);
  g.fillStyle(0x5f9a64, 1);
  g.fillRect(15, 14, 5, 20);
  g.fillStyle(0xfff5bf, 1);
  g.fillRect(24, 18, 15, 3);
  g.fillRect(24, 25, 11, 3);
  g.fillStyle(0xf4d77d, 1);
  g.fillRect(43, 10, 6, 26);
  g.fillStyle(0xffffff, 0.72);
  g.fillRect(27, 14, 7, 3);
  g.generateTexture("dorm-buried-book", 60, 42);
  g.destroy();
}

function makePlayer(scene, key, hair, skin, shirt, pants) {
  const g = freshGraphics(scene);
  g.fillStyle(hair, 1);
  g.fillRect(8, 2, 16, 8);
  g.fillRect(6, 8, 20, 8);
  g.fillStyle(skin, 1);
  g.fillRect(10, 10, 12, 10);
  g.fillRect(8, 18, 16, 4);
  g.fillStyle(0x2b1c16, 1);
  g.fillRect(11, 14, 3, 3);
  g.fillRect(18, 14, 3, 3);
  g.fillStyle(shirt, 1);
  g.fillRect(8, 22, 16, 10);
  g.fillRect(5, 24, 6, 8);
  g.fillRect(21, 24, 6, 8);
  g.fillStyle(pants, 1);
  g.fillRect(9, 32, 6, 6);
  g.fillRect(17, 32, 6, 6);
  g.fillStyle(0x231d22, 1);
  g.fillRect(8, 38, 8, 2);
  g.fillRect(16, 38, 8, 2);
  g.generateTexture(key, 32, 40);
  g.destroy();
}

function makeTree(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x543a24, 1);
  g.fillRect(18, 30, 10, 20);
  g.fillStyle(0x1f5b3a, 1);
  g.fillRect(8, 12, 30, 22);
  g.fillRect(14, 4, 18, 14);
  g.fillStyle(0x2f794f, 1);
  g.fillRect(10, 10, 8, 6);
  g.fillRect(28, 18, 8, 8);
  g.generateTexture("tree", 48, 54);
  g.destroy();
}

function makeTinyFlower(scene, key, color) {
  const g = freshGraphics(scene);
  g.fillStyle(0x2e6b43, 1);
  g.fillRect(8, 12, 4, 10);
  g.fillStyle(color, 1);
  g.fillRect(4, 6, 6, 6);
  g.fillRect(10, 2, 6, 6);
  g.fillRect(14, 8, 6, 6);
  g.fillStyle(0xffef9f, 1);
  g.fillRect(10, 8, 5, 5);
  g.generateTexture(key, 24, 24);
  g.destroy();
}

function makeSign(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x7a5638, 1);
  g.fillRect(96, 34, 8, 30);
  g.fillStyle(0xd59b5b, 1);
  g.fillRect(32, 6, 136, 34);
  g.fillStyle(0xf2c979, 1);
  g.fillRect(38, 10, 124, 10);
  g.fillStyle(0x6b4428, 1);
  g.fillRect(44, 26, 112, 4);
  g.generateTexture("sign", 200, 70);
  g.destroy();
}

function makeItemBase(scene, key, draw) {
  const g = freshGraphics(scene);
  g.fillStyle(0xffe69a, 0.2);
  g.fillRect(8, 8, 42, 42);
  g.fillStyle(0xfff0b8, 0.22);
  g.fillRect(14, 2, 30, 8);
  g.fillRect(14, 48, 30, 8);
  draw(g);
  g.generateTexture(key, 58, 58);
  g.destroy();
}

function makeCampusFragmentHomework(scene) {
  makeItemBase(scene, "fragment-homework", (g) => {
    g.fillStyle(0xfff6d5, 1);
    g.fillRect(17, 14, 26, 34);
    g.fillStyle(0x6aaed6, 1);
    g.fillRect(21, 20, 18, 3);
    g.fillRect(21, 28, 18, 3);
    g.fillRect(21, 36, 13, 3);
    g.fillStyle(0xe85c68, 1);
    g.fillRect(17, 14, 5, 34);
  });
}

function makeCampusFragmentDesk(scene) {
  makeItemBase(scene, "fragment-desk", (g) => {
    g.fillStyle(0xb97842, 1);
    g.fillRect(14, 22, 32, 12);
    g.fillStyle(0xe0aa5e, 1);
    g.fillRect(12, 18, 36, 8);
    g.fillStyle(0x6d4a32, 1);
    g.fillRect(18, 34, 6, 14);
    g.fillRect(38, 34, 6, 14);
  });
}

function makeCampusFragmentBasketball(scene) {
  makeItemBase(scene, "fragment-basketball", (g) => {
    g.fillStyle(0xd67935, 1);
    g.fillRect(19, 17, 22, 22);
    g.fillRect(16, 22, 28, 12);
    g.fillStyle(0x7a3f25, 1);
    g.fillRect(28, 17, 3, 22);
    g.fillRect(18, 27, 24, 3);
    g.fillRect(21, 20, 3, 16);
    g.fillRect(37, 20, 3, 16);
  });
}

function makeCampusFragmentClassmate(scene) {
  makeItemBase(scene, "fragment-classmate", (g) => {
    g.fillStyle(0x3c2b26, 1);
    g.fillRect(21, 12, 16, 8);
    g.fillStyle(0xf0b07c, 1);
    g.fillRect(23, 18, 12, 10);
    g.fillStyle(0x1a1a1f, 1);
    g.fillRect(25, 22, 3, 3);
    g.fillRect(31, 22, 3, 3);
    g.fillStyle(0x8d7ad8, 1);
    g.fillRect(20, 30, 18, 12);
    g.fillStyle(0xffe7a3, 1);
    g.fillRect(28, 30, 3, 12);
    g.fillStyle(0x2f3a48, 1);
    g.fillRect(22, 42, 6, 6);
    g.fillRect(31, 42, 6, 6);
  });
}

function makeCampusFragmentBlackboard(scene) {
  makeItemBase(scene, "fragment-blackboard", (g) => {
    g.fillStyle(0x234f47, 1);
    g.fillRect(12, 17, 36, 25);
    g.fillStyle(0xd6a15d, 1);
    g.fillRect(10, 14, 40, 5);
    g.fillRect(10, 42, 40, 5);
    g.fillRect(10, 14, 5, 33);
    g.fillRect(45, 14, 5, 33);
    g.fillStyle(0xf5efe0, 1);
    g.fillRect(20, 25, 20, 3);
    g.fillRect(20, 33, 14, 3);
  });
}

function makeHeartBubble(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xf7d8ff, 0.18);
  g.fillCircle(35, 35, 32);
  g.fillStyle(0xffffff, 0.2);
  g.fillCircle(24, 22, 9);
  g.fillStyle(0xff7d9f, 0.75);
  g.fillRect(27, 24, 7, 7);
  g.fillRect(38, 24, 7, 7);
  g.fillRect(24, 31, 24, 8);
  g.fillRect(28, 39, 16, 7);
  g.fillRect(32, 46, 8, 6);
  g.fillStyle(0xffe3ef, 0.7);
  g.fillRect(30, 27, 4, 4);
  g.generateTexture("heart-bubble", 70, 70);
  g.destroy();
}

function makeCampusHurdle(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x5b3b32, 1);
  g.fillRect(8, 8, 6, 44);
  g.fillRect(38, 8, 6, 44);
  g.fillStyle(0xf6e0a5, 1);
  g.fillRect(4, 8, 44, 8);
  g.fillRect(4, 25, 44, 7);
  g.fillStyle(0xff7d7d, 1);
  g.fillRect(15, 8, 8, 8);
  g.fillRect(30, 25, 8, 7);
  g.fillStyle(0x352722, 1);
  g.fillRect(4, 50, 44, 5);
  g.generateTexture("campus-hurdle", 52, 58);
  g.destroy();
}

function makeSolidHitbox(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xffffff, 1);
  g.fillRect(0, 0, 8, 8);
  g.generateTexture("solid-hitbox", 8, 8);
  g.destroy();
}

function makeGameCard(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xffe48d, 1);
  g.fillRect(8, 4, 34, 48);
  g.fillStyle(0x7d68cd, 1);
  g.fillRect(12, 8, 26, 40);
  g.fillStyle(0xfff5bf, 1);
  g.fillRect(17, 15, 16, 10);
  g.fillStyle(0xff7d9f, 1);
  g.fillRect(19, 29, 12, 12);
  g.fillStyle(0x34243d, 1);
  g.fillRect(14, 44, 22, 3);
  g.generateTexture("game-card", 50, 58);
  g.destroy();
}

function makePrimaryFragment(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xfff1a8, 1);
  g.fillTriangle(24, 4, 44, 22, 30, 54);
  g.fillStyle(0xffc95f, 1);
  g.fillTriangle(24, 4, 30, 54, 9, 24);
  g.fillStyle(0xffffff, 0.72);
  g.fillRect(23, 14, 7, 7);
  g.fillRect(18, 27, 5, 5);
  g.fillStyle(0xe87c68, 1);
  g.fillRect(27, 39, 6, 8);
  g.generateTexture("primary-fragment", 54, 60);
  g.destroy();
}

function makeUltramanObstacle(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xd9e4ed, 1);
  g.fillRect(14, 8, 22, 28);
  g.fillStyle(0xc53d4b, 1);
  g.fillRect(10, 22, 30, 24);
  g.fillStyle(0x6aaed6, 1);
  g.fillRect(21, 16, 8, 7);
  g.fillStyle(0xffdf68, 1);
  g.fillRect(22, 30, 6, 6);
  g.fillStyle(0x2f3a48, 1);
  g.fillRect(12, 46, 10, 6);
  g.fillRect(28, 46, 10, 6);
  g.generateTexture("ultraman-obstacle", 50, 58);
  g.destroy();
}

function makeHomeworkObstacle(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xfff5d1, 1);
  g.fillRect(9, 12, 34, 34);
  g.fillStyle(0xe85c68, 1);
  g.fillRect(9, 12, 6, 34);
  g.fillStyle(0x6aaed6, 1);
  g.fillRect(18, 20, 18, 3);
  g.fillRect(18, 28, 18, 3);
  g.fillRect(18, 36, 12, 3);
  g.fillStyle(0x6d5438, 1);
  g.fillRect(7, 46, 38, 6);
  g.generateTexture("homework-obstacle", 52, 58);
  g.destroy();
}

function makeBullyShadow(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x202630, 1);
  g.fillRect(10, 8, 24, 9);
  g.fillRect(8, 16, 28, 24);
  g.fillStyle(0xf1bb8d, 1);
  g.fillRect(14, 18, 16, 10);
  g.fillStyle(0x11151b, 1);
  g.fillRect(15, 22, 4, 3);
  g.fillRect(25, 22, 4, 3);
  g.fillStyle(0x5b3b6d, 1);
  g.fillRect(8, 31, 28, 15);
  g.fillStyle(0x11151b, 1);
  g.fillRect(11, 46, 9, 6);
  g.fillRect(25, 46, 9, 6);
  g.generateTexture("bully-shadow", 46, 58);
  g.destroy();
}

function makeSchoolBox(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xb97842, 1);
  g.fillRect(7, 9, 36, 34);
  g.fillStyle(0xe0aa5e, 1);
  g.fillRect(11, 13, 28, 8);
  g.fillStyle(0x6d4a32, 1);
  g.fillRect(11, 28, 28, 5);
  g.fillRect(20, 9, 5, 34);
  g.generateTexture("school-box", 50, 52);
  g.destroy();
}

function makeSchoolTarget(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xffe69a, 0.35);
  g.fillCircle(25, 25, 21);
  g.lineStyle(4, 0xffe69a, 1);
  g.strokeCircle(25, 25, 15);
  g.fillStyle(0xffe69a, 1);
  g.fillRect(22, 22, 6, 6);
  g.generateTexture("school-target", 50, 50);
  g.destroy();
}

function makeSchoolExit(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x2f8f67, 1);
  g.fillRect(10, 8, 30, 36);
  g.fillStyle(0xfff5bf, 1);
  g.fillRect(14, 13, 22, 6);
  g.fillRect(14, 24, 16, 4);
  g.fillStyle(0x17232a, 1);
  g.fillRect(31, 29, 4, 4);
  g.generateTexture("school-exit", 50, 52);
  g.destroy();
}

function makeMiddleSpikes(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x242a32, 1);
  g.fillRect(5, 31, 54, 7);
  g.fillStyle(0xdfe6ee, 1);
  for (let x = 6; x <= 46; x += 10) {
    g.fillTriangle(x, 31, x + 8, 31, x + 4, 10);
  }
  g.fillStyle(0x8d2d3e, 1);
  g.fillRect(13, 32, 6, 3);
  g.fillRect(43, 32, 6, 3);
  g.generateTexture("middle-spikes", 64, 42);
  g.destroy();
}

function makeRollingStone(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x2c333d, 1);
  g.fillCircle(25, 25, 21);
  g.fillStyle(0x5e6872, 1);
  g.fillCircle(20, 18, 8);
  g.fillCircle(31, 29, 7);
  g.fillStyle(0x9aa3aa, 1);
  g.fillRect(15, 30, 20, 5);
  g.fillRect(26, 12, 5, 24);
  g.generateTexture("rolling-stone", 52, 52);
  g.destroy();
}

function makeMovingEnemy(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x15191f, 1);
  g.fillRect(12, 8, 26, 10);
  g.fillRect(9, 18, 32, 27);
  g.fillStyle(0x2d3440, 1);
  g.fillRect(13, 30, 24, 16);
  g.fillStyle(0xf05b6a, 1);
  g.fillRect(16, 22, 5, 4);
  g.fillRect(29, 22, 5, 4);
  g.fillStyle(0x0c0f14, 1);
  g.fillRect(12, 46, 9, 7);
  g.fillRect(29, 46, 9, 7);
  g.generateTexture("moving-enemy", 52, 58);
  g.destroy();
}

function makeDropExit(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x0f151d, 1);
  g.fillRect(6, 8, 56, 44);
  g.fillStyle(0xf4d77d, 1);
  g.fillRect(30, 12, 8, 22);
  g.fillTriangle(22, 31, 46, 31, 34, 45);
  g.lineStyle(3, 0x6c7890, 1);
  g.strokeRect(6, 8, 56, 44);
  g.generateTexture("drop-exit", 68, 60);
  g.destroy();
}

function makeHighGateBar(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x233247, 1);
  g.fillRect(0, 1, 88, 10);
  g.fillStyle(0xf4d77d, 1);
  g.fillRect(0, 3, 88, 2);
  g.fillRect(0, 8, 88, 2);
  g.fillStyle(0xe85c68, 1);
  for (let x = 6; x < 88; x += 18) g.fillRect(x, 0, 5, 12);
  g.generateTexture("high-gate-bar", 88, 12);
  g.destroy();
}

function makeHighPlane(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x6aaed6, 1);
  g.fillRect(10, 20, 34, 10);
  g.fillStyle(0xffe69a, 1);
  g.fillTriangle(43, 16, 58, 25, 43, 34);
  g.fillStyle(0xf5efe0, 1);
  g.fillTriangle(22, 8, 38, 22, 18, 22);
  g.fillTriangle(22, 42, 38, 28, 18, 28);
  g.fillStyle(0xe85c68, 1);
  g.fillRect(6, 18, 8, 14);
  g.generateTexture("high-plane", 64, 50);
  g.destroy();
}

function makePlaneBullet(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xfff5bf, 1);
  g.fillRect(0, 3, 18, 5);
  g.fillStyle(0xff8b72, 1);
  g.fillRect(13, 2, 5, 7);
  g.generateTexture("plane-bullet", 20, 12);
  g.destroy();
}

function makeExamEnemy(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xfff6d5, 1);
  g.fillRect(8, 6, 36, 42);
  g.fillStyle(0xe85c68, 1);
  g.fillRect(13, 14, 26, 5);
  g.fillRect(13, 24, 20, 4);
  g.fillRect(13, 34, 24, 4);
  g.fillStyle(0x2f3a48, 1);
  g.fillRect(17, 42, 14, 3);
  g.generateTexture("exam-enemy", 54, 58);
  g.destroy();
}

function makePaperEnemy(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xf8f1df, 1);
  g.fillTriangle(7, 25, 46, 8, 40, 46);
  g.fillStyle(0x9bcce0, 1);
  g.fillTriangle(18, 25, 46, 8, 30, 30);
  g.fillStyle(0x6d7a88, 1);
  g.fillRect(24, 33, 14, 4);
  g.generateTexture("paper-enemy", 54, 54);
  g.destroy();
}

function makeVideoGameObstacle(scene) {
  makeItemBase(scene, "video-game-obstacle", (g) => {
    g.fillStyle(0x2f3a48, 1);
    g.fillRect(15, 19, 30, 24);
    g.fillStyle(0x89c7d2, 1);
    g.fillRect(21, 23, 18, 10);
    g.fillStyle(0xffe69a, 1);
    g.fillRect(19, 37, 7, 3);
    g.fillRect(21, 35, 3, 7);
    g.fillStyle(0xff7d9f, 1);
    g.fillRect(38, 36, 4, 4);
  });
}

function makeLoveLetterObstacle(scene) {
  makeItemBase(scene, "love-letter-obstacle", (g) => {
    g.fillStyle(0xfff4c7, 1);
    g.fillRect(14, 20, 30, 22);
    g.fillStyle(0xe8a0b4, 1);
    g.fillTriangle(14, 20, 29, 34, 44, 20);
    g.fillStyle(0xff697a, 1);
    g.fillRect(26, 29, 4, 4);
    g.fillRect(31, 29, 4, 4);
    g.fillRect(25, 33, 11, 5);
  });
}

function makeTeacherObstacle(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0x3c2b26, 1);
  g.fillRect(10, 5, 22, 10);
  g.fillStyle(0xf1bb8d, 1);
  g.fillRect(14, 15, 14, 12);
  g.fillStyle(0x1a1a1f, 1);
  g.fillRect(16, 19, 3, 3);
  g.fillRect(24, 19, 3, 3);
  g.fillStyle(0x486077, 1);
  g.fillRect(10, 29, 22, 18);
  g.fillStyle(0xf7d7a3, 1);
  g.fillRect(32, 31, 10, 16);
  g.fillStyle(0x2f3a48, 1);
  g.fillRect(12, 47, 8, 6);
  g.fillRect(24, 47, 8, 6);
  g.generateTexture("teacher-obstacle", 52, 58);
  g.destroy();
}

function makeFamilyObstacle(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xfff0b8, 0.22);
  g.fillRect(7, 11, 44, 40);
  g.fillStyle(0x8a5640, 1);
  g.fillTriangle(5, 22, 29, 5, 53, 22);
  g.fillStyle(0xf7c678, 1);
  g.fillRect(12, 22, 34, 27);
  g.fillStyle(0x6c4a33, 1);
  g.fillRect(25, 35, 8, 14);
  g.fillStyle(0x8fcce6, 1);
  g.fillRect(16, 27, 8, 8);
  g.fillRect(34, 27, 8, 8);
  g.fillStyle(0x5a3a2e, 1);
  g.fillRect(20, 47, 18, 4);
  g.generateTexture("family-obstacle", 58, 58);
  g.destroy();
}

function makeItemToyPlane(scene) {
  makeItemBase(scene, "item-toy-plane", (g) => {
    g.fillStyle(0xf5efe0, 1);
    g.fillRect(17, 27, 26, 6);
    g.fillStyle(0x74b6d7, 1);
    g.fillRect(25, 17, 10, 26);
    g.fillStyle(0xe85c68, 1);
    g.fillRect(40, 25, 7, 10);
    g.fillStyle(0xd7a048, 1);
    g.fillRect(15, 24, 6, 12);
  });
}

function makeItemKite(scene) {
  makeItemBase(scene, "item-kite", (g) => {
    g.fillStyle(0xff8faf, 1);
    g.fillTriangle(29, 12, 44, 28, 29, 44);
    g.fillStyle(0x74b6d7, 1);
    g.fillTriangle(29, 12, 14, 28, 29, 44);
    g.fillStyle(0xffe69a, 1);
    g.fillRect(27, 26, 5, 5);
    g.fillStyle(0xf5efe0, 1);
    g.fillRect(30, 45, 3, 8);
    g.fillRect(34, 50, 3, 5);
  });
}

function makeItemMarbles(scene) {
  makeItemBase(scene, "item-marbles", (g) => {
    const marbles = [
      [19, 24, 0x74b6d7],
      [30, 20, 0xff8faf],
      [38, 30, 0xffdf68],
      [26, 36, 0x9edc8b],
    ];
    marbles.forEach(([x, y, color]) => {
      g.fillStyle(color, 1);
      g.fillRect(x, y, 10, 10);
      g.fillStyle(0xffffff, 0.72);
      g.fillRect(x + 2, y + 2, 3, 3);
    });
  });
}

function makeItemToyCar(scene) {
  makeItemBase(scene, "item-toy-car", (g) => {
    g.fillStyle(0xe85c68, 1);
    g.fillRect(14, 26, 32, 12);
    g.fillRect(22, 18, 16, 10);
    g.fillStyle(0xaed7e9, 1);
    g.fillRect(25, 20, 10, 6);
    g.fillStyle(0x1f252b, 1);
    g.fillRect(18, 38, 8, 8);
    g.fillRect(36, 38, 8, 8);
    g.fillStyle(0xf7f1d7, 1);
    g.fillRect(20, 40, 4, 4);
    g.fillRect(38, 40, 4, 4);
  });
}

function makeItemGamepad(scene) {
  makeItemBase(scene, "item-gamepad", (g) => {
    g.fillStyle(0x2f3a48, 1);
    g.fillRect(15, 20, 30, 22);
    g.fillStyle(0x89c7d2, 1);
    g.fillRect(21, 24, 18, 10);
    g.fillStyle(0xf5efe0, 1);
    g.fillRect(19, 37, 7, 3);
    g.fillRect(21, 35, 3, 7);
    g.fillStyle(0xff8faf, 1);
    g.fillRect(37, 36, 4, 4);
    g.fillStyle(0xffdf68, 1);
    g.fillRect(42, 32, 4, 4);
  });
}

function makeItemLetter(scene) {
  makeItemBase(scene, "item-letter", (g) => {
    g.fillStyle(0xfff4c7, 1);
    g.fillRect(15, 20, 28, 22);
    g.fillStyle(0xd78365, 1);
    g.fillRect(17, 22, 24, 4);
    g.fillRect(19, 28, 20, 3);
    g.fillRect(22, 34, 14, 3);
    g.fillStyle(0xff7b8b, 1);
    g.fillRect(27, 28, 5, 5);
  });
}

function makeItemCamera(scene) {
  makeItemBase(scene, "item-camera", (g) => {
    g.fillStyle(0x243241, 1);
    g.fillRect(14, 23, 32, 22);
    g.fillRect(20, 18, 12, 6);
    g.fillStyle(0xe6edf3, 1);
    g.fillRect(25, 27, 12, 12);
    g.fillStyle(0x5aa4c4, 1);
    g.fillRect(28, 30, 6, 6);
    g.fillStyle(0xffd56e, 1);
    g.fillRect(39, 26, 4, 4);
  });
}

function makeItemTea(scene) {
  makeItemBase(scene, "item-tea", (g) => {
    g.fillStyle(0xf7d7a3, 1);
    g.fillRect(19, 21, 24, 24);
    g.fillStyle(0xc7835a, 1);
    g.fillRect(21, 28, 20, 13);
    g.fillStyle(0x6f4a37, 1);
    g.fillRect(24, 43, 5, 5);
    g.fillRect(33, 43, 5, 5);
    g.fillStyle(0x5a3a2e, 1);
    g.fillRect(30, 10, 4, 13);
  });
}

function makeItemStar(scene) {
  makeItemBase(scene, "item-star", (g) => {
    g.fillStyle(0xffdf5d, 1);
    g.fillRect(27, 13, 7, 10);
    g.fillRect(20, 23, 22, 7);
    g.fillRect(23, 30, 16, 7);
    g.fillRect(18, 18, 6, 6);
    g.fillRect(38, 18, 6, 6);
    g.fillRect(20, 36, 6, 8);
    g.fillRect(36, 36, 6, 8);
    g.fillStyle(0xfff2a6, 1);
    g.fillRect(29, 18, 4, 4);
  });
}

function makeItemMusic(scene) {
  makeItemBase(scene, "item-music", (g) => {
    g.fillStyle(0xbca8ff, 1);
    g.fillRect(30, 14, 6, 26);
    g.fillRect(36, 14, 13, 5);
    g.fillRect(43, 18, 6, 22);
    g.fillRect(20, 36, 12, 8);
    g.fillRect(34, 36, 12, 8);
    g.fillStyle(0x7d68cd, 1);
    g.fillRect(18, 41, 14, 5);
    g.fillRect(33, 41, 14, 5);
  });
}

function makeItemFlower(scene) {
  makeItemBase(scene, "item-flower", (g) => {
    g.fillStyle(0x4d9860, 1);
    g.fillRect(28, 30, 5, 17);
    g.fillRect(22, 36, 8, 5);
    g.fillRect(32, 33, 8, 5);
    g.fillStyle(0xff83a6, 1);
    g.fillRect(23, 18, 8, 8);
    g.fillRect(31, 18, 8, 8);
    g.fillRect(27, 12, 8, 8);
    g.fillRect(27, 24, 8, 8);
    g.fillStyle(0xffdf68, 1);
    g.fillRect(28, 20, 6, 6);
  });
}

function makeSmallStar(scene) {
  const g = freshGraphics(scene);
  g.fillStyle(0xffe99a, 1);
  g.fillRect(7, 0, 4, 7);
  g.fillRect(0, 7, 18, 4);
  g.fillRect(7, 11, 4, 7);
  g.generateTexture("pixel-star-small", 18, 18);
  g.destroy();
}

function makeHeart(scene, key, dark, light, size) {
  const unit = size / 14;
  const pattern = [
    "00110011000000",
    "01111111100000",
    "11111111110000",
    "11111111110000",
    "01111111100000",
    "00111111000000",
    "00011110000000",
    "00001100000000",
  ];
  const g = freshGraphics(scene);
  pattern.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      if (cell !== "1") return;
      g.fillStyle((x + y) % 3 === 0 ? light : dark, 1);
      g.fillRect(Math.round(x * unit), Math.round(y * unit), Math.ceil(unit), Math.ceil(unit));
    });
  });
  g.generateTexture(key, size, Math.ceil(size * 0.66));
  g.destroy();
}

const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#10191f",
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scene: [
    BootScene,
    StartScene,
    SubtitleScene,
    WorldScene,
    ChapterProgressScene,
    CampusScene,
    GaokaoScene,
    ChapterThreeScene,
    FinalScene,
  ],
};

const game = new Phaser.Game(config);

if (import.meta.env.DEV) {
  window.__confessGame = game;
}

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
