<template>
  <div class="art-mesh" aria-hidden="true">
    <div class="mesh-colors">
      <div class="blob blob-peach" />
      <div class="blob blob-purple" />
      <div class="blob blob-mint" />
      <div class="blob blob-gold" />
    </div>
    <div class="mesh-veil" />
  </div>
</template>

<style scoped>
/* ===== 基础布局：始终保留 ===== */
.art-mesh {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  background: var(--mesh-base);
}

/* ===== A · 奶油琥珀（当前启用）=====
   浅色：奶油、沙金、暖杏
   深色：暖黑、琥珀、深棕
*/

/*
.art-mesh {
  --mesh-base: #f7f2e8;
  --mesh-peach: #e3c18c;
  --mesh-purple: #eed8b5;
  --mesh-mint: #d8c6ad;
  --mesh-gold: #f0e4cf;
  --mesh-opacity: 0.8;
}

:global(html.dark .art-mesh) {
  --mesh-base: #100e0b;
  --mesh-peach: #624321;
  --mesh-purple: #493827;
  --mesh-mint: #37332b;
  --mesh-gold: #78542b;
  --mesh-opacity: 0.48;
}
*/

/* ===== B · 玫瑰烟紫 =====
   浅色：玫瑰粉、灰紫、淡藕色
   深色：暗玫瑰、烟紫、梅子色
   启用时删除下方单独一行的 /* 和结尾星号斜杠。
*/
/*
.art-mesh {
  --mesh-base: #f6f0f0;
  --mesh-peach: #dfb1bd;
  --mesh-purple: #c3b3d7;
  --mesh-mint: #ead0ce;
  --mesh-gold: #d4c2cf;
  --mesh-opacity: 0.8;
}

:global(html.dark .art-mesh) {
  --mesh-base: #100c13;
  --mesh-peach: #61364c;
  --mesh-purple: #44315f;
  --mesh-mint: #492e37;
  --mesh-gold: #3b314b;
  --mesh-opacity: 0.48;
}
*/

/* ===== C · 海盐蓝 =====
   浅色：雾蓝、灰蓝、淡青
   深色：海军蓝、靛蓝、深青
*/
/*
.art-mesh {
  --mesh-base: #f0f4f5;
  --mesh-peach: #a3c6d7;
  --mesh-purple: #b9c3da;
  --mesh-mint: #c3dcd8;
  --mesh-gold: #d3dfe8;
  --mesh-opacity: 0.8;
}

:global(html.dark .art-mesh) {
  --mesh-base: #080e15;
  --mesh-peach: #244b68;
  --mesh-purple: #303b65;
  --mesh-mint: #24534f;
  --mesh-gold: #273b50;
  --mesh-opacity: 0.48;
}
*/

/* ===== D · 森林苔绿 =====
   浅色：苔绿、亚麻、鼠尾草绿
   深色：森林绿、橄榄、墨绿
*/
/*
.art-mesh {
  --mesh-base: #f3f2e9;
  --mesh-peach: #bec7a4;
  --mesh-purple: #d9d3b4;
  --mesh-mint: #a9c4b4;
  --mesh-gold: #e4dbc1;
  --mesh-opacity: 0.8;
}

:global(html.dark .art-mesh) {
  --mesh-base: #0c100c;
  --mesh-peach: #3e5033;
  --mesh-purple: #504a2d;
  --mesh-mint: #254e40;
  --mesh-gold: #3c3c2c;
  --mesh-opacity: 0.48;
}
*/

/* ===== E · 落日赤陶 =====
   浅色：蜜桃、赤陶、柔金
   深色：焦糖、酒红、古铜
*/

.art-mesh {
  --mesh-base: #f8f0e9;
  --mesh-peach: #e5b398;
  --mesh-purple: #d4a29d;
  --mesh-mint: #e7c493;
  --mesh-gold: #e9c9b8;
  --mesh-opacity: 0.8;
}

:global(html.dark .art-mesh) {
  --mesh-base: #140d0b;
  --mesh-peach: #743e2b;
  --mesh-purple: #582e36;
  --mesh-mint: #624a27;
  --mesh-gold: #483126;
  --mesh-opacity: 0.48;
}

.mesh-colors {
  position: absolute;
  inset: -12%;
  opacity: var(--mesh-opacity);
  filter: blur(65px);
}

.blob {
  position: absolute;
  width: 70%;
  height: 75%;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, var(--blob-color) 0%, transparent 70%);
  animation: mesh-drift 28s ease-in-out infinite alternate;
}

.blob-peach {
  --blob-color: var(--mesh-peach);
  --move-x: 22%;
  --move-y: 18%;
  --turn: 20deg;

  top: -15%;
  left: -15%;
  animation-duration: 29s;
  animation-delay: -9s;
}

.blob-purple {
  --blob-color: var(--mesh-purple);
  --move-x: -20%;
  --move-y: 24%;
  --turn: -25deg;

  top: -10%;
  right: -15%;
  animation-duration: 34s;
  animation-delay: -21s;
}

.blob-mint {
  --blob-color: var(--mesh-mint);
  --move-x: 18%;
  --move-y: -24%;
  --turn: -18deg;

  bottom: -18%;
  left: -10%;
  animation-duration: 31s;
  animation-delay: -15s;
}

.blob-gold {
  --blob-color: var(--mesh-gold);
  --move-x: -24%;
  --move-y: -18%;
  --turn: 28deg;

  bottom: -12%;
  right: -15%;
  animation-duration: 37s;
  animation-delay: -27s;
}

/* 正文附近盖一层柔和底色，保持文字清楚 */
.mesh-veil {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 42%, var(--mesh-base) 0%, transparent 72%);
  opacity: 0.6;
}

@keyframes mesh-drift {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }

  50% {
    transform: translate(var(--move-x), 0) rotate(var(--turn)) scale(1.15, 0.95);
  }

  100% {
    transform: translate(var(--move-x), var(--move-y)) rotate(0deg) scale(0.95, 1.15);
  }
}

@media (max-width: 640px) {
  .mesh-colors {
    filter: blur(40px);
  }

  .blob {
    width: 95%;
    height: 65%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none;
  }
}

/* 加快流动，扩大移动范围 */
.art-mesh {
  --mesh-opacity: 0.8;
}

.blob-peach {
  --move-x: 45%;
  --move-y: 35%;
  animation-duration: 7s;
}

.blob-purple {
  --move-x: -40%;
  --move-y: 45%;
  animation-duration: 9s;
}

.blob-mint {
  --move-x: 40%;
  --move-y: -40%;
  animation-duration: 8s;
}

.blob-gold {
  --move-x: -45%;
  --move-y: -35%;
  animation-duration: 10s;
}

/* 减弱正文区域的遮罩 */
.mesh-veil {
  opacity: 0.35;
}
</style>
