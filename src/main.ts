import Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";
import "./style.css";

declare global {
  interface Window { gameControls: { x: number; y: number; firing: boolean } }
}
window.gameControls = { x: 0, y: 0, firing: false };

const joystick = document.querySelector<HTMLDivElement>("#joystick")!;
const knob = document.querySelector<HTMLDivElement>("#knob")!;
const fire = document.querySelector<HTMLButtonElement>("#fire")!;
let stickPointer: number | null = null;
const moveStick = (event: PointerEvent) => {
  const rect = joystick.getBoundingClientRect();
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = event.clientY - (rect.top + rect.height / 2);
  const radius = rect.width * .34;
  const length = Math.hypot(dx, dy);
  const scale = length > radius ? radius / length : 1;
  window.gameControls.x = dx * scale / radius;
  window.gameControls.y = dy * scale / radius;
  knob.style.transform = `translate(calc(-50% + ${dx * scale}px), calc(-50% + ${dy * scale}px))`;
};
joystick.addEventListener("pointerdown", e => { e.preventDefault(); stickPointer = e.pointerId; joystick.setPointerCapture(e.pointerId); moveStick(e); });
joystick.addEventListener("pointermove", e => { if (e.pointerId === stickPointer) moveStick(e); });
const releaseStick = (e: PointerEvent) => { if (e.pointerId !== stickPointer) return; stickPointer = null; window.gameControls.x = 0; window.gameControls.y = 0; knob.style.transform = "translate(-50%,-50%)"; };
joystick.addEventListener("pointerup", releaseStick); joystick.addEventListener("pointercancel", releaseStick); joystick.addEventListener("lostpointercapture", () => { stickPointer = null; window.gameControls.x = 0; window.gameControls.y = 0; knob.style.transform = "translate(-50%,-50%)"; });
const startFire = (e: Event) => { e.preventDefault(); window.gameControls.firing = true; };
const stopFire = () => { window.gameControls.firing = false; };
fire.addEventListener("pointerdown", startFire); fire.addEventListener("pointerup", stopFire); fire.addEventListener("pointercancel", stopFire); fire.addEventListener("lostpointercapture", stopFire); fire.addEventListener("contextmenu", e => e.preventDefault());
window.addEventListener("pointerup", stopFire);

new Phaser.Game({ type: Phaser.AUTO, parent: "game", backgroundColor: "#17231f", scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH }, physics: { default: "arcade", arcade: { debug: false } }, input: { activePointers: 3 }, scene: [GameScene], render: { antialias: true, pixelArt: false } });
