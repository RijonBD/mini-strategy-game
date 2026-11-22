import Phaser from "phaser";

declare global { interface Window { gameControls: { x: number; y: number; firing: boolean } } }
type Fighter = Phaser.Physics.Arcade.Sprite & { nextShot?: number; hp?: number; maxHp?: number };

export class GameScene extends Phaser.Scene {
  private player!: Fighter;
  private enemies!: Phaser.Physics.Arcade.Group;
  private playerBullets!: Phaser.Physics.Arcade.Group;
  private enemyBullets!: Phaser.Physics.Arcade.Group;
  private keys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private hp = 100; private ammo = 30; private wave = 1; private kills = 0;
  private fireCooldown = 0; private reloadTimer = 0; private dead = false;
  private hud!: { hp: HTMLElement; bar: HTMLElement; ammo: HTMLElement; wave: HTMLElement; kills: HTMLElement; message: HTMLElement; restart: HTMLButtonElement };
  private lastDamage = 0;

  constructor() { super("GameScene"); }
  create(): void {
    this.makeTextures();
    this.physics.world.setBounds(0, 0, 1800, 1200);
    this.drawWorld();
    this.player = this.physics.add.sprite(900, 600, "player") as Fighter;
    this.player.setCollideWorldBounds(true).setDepth(20).setCircle(13).setScale(1.25).setVisible(true).setAlpha(1);
    this.enemies = this.physics.add.group({ runChildUpdate: false });
    this.playerBullets = this.physics.add.group({ defaultKey: "bullet", maxSize: 100 });
    this.enemyBullets = this.physics.add.group({ defaultKey: "enemyBullet", maxSize: 100 });
    this.physics.add.overlap(this.playerBullets, this.enemies, (bullet, enemy) => this.hitEnemy(bullet as Phaser.Physics.Arcade.Sprite, enemy as Fighter));
    this.physics.add.overlap(this.enemyBullets, this.player, (bullet) => this.hitPlayer(bullet as Phaser.Physics.Arcade.Sprite));
    this.cameras.main.setBounds(0, 0, 1800, 1200).startFollow(this.player, true, .08, .08);
    this.keys = this.input.keyboard!.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,R") as { [key: string]: Phaser.Input.Keyboard.Key };
    this.hud = { hp: document.querySelector("#hp")!, bar: document.querySelector("#healthFill")!, ammo: document.querySelector("#ammo")!, wave: document.querySelector("#wave")!, kills: document.querySelector("#kills")!, message: document.querySelector("#message")!, restart: document.querySelector("#restart")! };
    this.hud.restart.addEventListener("click", () => this.scene.restart());
    this.updateHud();
    this.spawnWave();
    this.scale.on("resize", () => this.cameras.main.setViewport(0, 0, this.scale.width, this.scale.height));
  }

  private makeTextures(): void {
    const draw = (key: string, painter: (g: Phaser.GameObjects.Graphics) => void, w = 40, h = 40) => { const g = this.make.graphics({ x: 0, y: 0 }); painter(g); g.generateTexture(key, w, h); g.destroy(); };
    draw("player", g => { g.fillStyle(0x203e36); g.fillCircle(20,20,16); g.fillStyle(0x9bd7a8); g.fillCircle(20,20,10); g.fillStyle(0xe8d9ae); g.fillCircle(20,13,5); g.fillStyle(0x252b29); g.fillRect(22,17,16,5); });
    draw("enemy", g => { g.fillStyle(0x522c2a); g.fillCircle(20,20,16); g.fillStyle(0xd86d59); g.fillCircle(20,20,10); g.fillStyle(0x211f20); g.fillRect(23,17,15,5); });
    draw("bullet", g => { g.fillStyle(0xffe5a3); g.fillCircle(5,5,4); }, 10,10);
    draw("enemyBullet", g => { g.fillStyle(0xff715c); g.fillCircle(6,6,5); }, 12,12);
    draw("tree", g => { g.fillStyle(0x263e31); g.fillCircle(24,24,22); g.fillStyle(0x385b40); g.fillCircle(18,18,13); },48,48);
  }
  private drawWorld(): void {
    const bg = this.add.graphics().setDepth(-5); bg.fillStyle(0x1b2b24).fillRect(0,0,1800,1200);
    bg.lineStyle(1,0x304236,.35); for(let x=0;x<1800;x+=60) bg.lineBetween(x,0,x,1200); for(let y=0;y<1200;y+=60) bg.lineBetween(0,y,1800,y);
    bg.fillStyle(0x394039,.9).fillRect(0,555,1800,90); bg.lineStyle(3,0xb7a879,.35); bg.lineBetween(0,600,1800,600);
    for(let i=0;i<65;i++){const x=Phaser.Math.Between(35,1765),y=Phaser.Math.Between(35,1165);if(y>530&&y<670)continue;this.add.image(x,y,"tree").setAlpha(.85).setDepth(-1).setScale(Phaser.Math.FloatBetween(.65,1.25));}
    for(let i=0;i<12;i++){const x=Phaser.Math.Between(100,1700),y=Phaser.Math.Between(100,1100);if(y>520&&y<680)continue;this.add.rectangle(x,y,Phaser.Math.Between(24,52),Phaser.Math.Between(12,26),0x465047).setDepth(-2).setAngle(Phaser.Math.Between(-30,30));}
  }
  private spawnWave(): void { const count = 4 + this.wave * 2; for(let i=0;i<count;i++){const edge=Phaser.Math.Between(0,3);const x=edge===0?30:edge===1?1770:Phaser.Math.Between(30,1770);const y=edge===2?30:edge===3?1170:Phaser.Math.Between(30,1170);const e=this.enemies.create(x,y,"enemy") as Fighter;e.setCircle(13).setDepth(4);e.hp=2+Math.floor(this.wave/3);e.maxHp=e.hp;e.nextShot=Phaser.Math.Between(700,1700);}}
  update(_time: number, delta: number): void {
    if(this.dead)return; this.player.setVisible(true).setDepth(20); const dt=Math.min(delta,40); const c=window.gameControls; const k=this.keys;
    let mx=(k.A.isDown||k.LEFT.isDown?-1:0)+(k.D.isDown||k.RIGHT.isDown?1:0)+c.x; let my=(k.W.isDown||k.UP.isDown?-1:0)+(k.S.isDown||k.DOWN.isDown?1:0)+c.y; const len=Math.hypot(mx,my);if(len>1){mx/=len;my/=len;}
    this.player.setVelocity(mx*230,my*230);
    const target=this.nearestEnemy(); if(target){this.player.rotation=Phaser.Math.Angle.Between(this.player.x,this.player.y,target.x,target.y);}
    this.fireCooldown-=dt;this.reloadTimer-=dt;
    if((c.firing||k.SPACE.isDown)&&this.fireCooldown<=0&&this.reloadTimer<=0)this.shoot();
    if((k.R.isDown||this.ammo===0)&&this.reloadTimer<=0&&this.ammo<30){this.reloadTimer=1250;this.time.delayedCall(1250,()=>{this.ammo=30;this.updateHud();});}
    this.enemies.children.iterate(child=>{const e=child as Fighter|null;if(!e||!e.active)return true;const angle=Phaser.Math.Angle.Between(e.x,e.y,this.player.x,this.player.y);const distance=Phaser.Math.Distance.Between(e.x,e.y,this.player.x,this.player.y);if(distance>235)e.setVelocity(Math.cos(angle)*72,Math.sin(angle)*72);else e.setVelocity(0,0);e.nextShot=(e.nextShot??1000)-dt;if(distance<620&&e.nextShot<=0){this.enemyShoot(e,angle);e.nextShot=Phaser.Math.Between(1250,2100); } return true;});
    if(this.enemies.countActive(true)===0){this.wave++;this.spawnWave();this.updateHud();}
    this.hud.message.textContent=this.reloadTimer>0?"RELOADING":"";
  }
  private nearestEnemy(): Fighter|null { let best:Fighter|null=null,bd=Infinity;this.enemies.children.iterate(child=>{const e=child as Fighter|null;if(!e||!e.active)return true;const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,e.x,e.y);if(d<bd){bd=d;best=e;}return true;});return best; }
  private shoot(): void { if(this.ammo<=0)return;const target=this.nearestEnemy();if(!target)return;const a=Phaser.Math.Angle.Between(this.player.x,this.player.y,target.x,target.y);const b=this.playerBullets.get(this.player.x+Math.cos(a)*24,this.player.y+Math.sin(a)*24,"bullet") as Phaser.Physics.Arcade.Sprite|null;if(!b)return;b.setActive(true).setVisible(true).setDepth(6);b.body!.enable=true;b.setVelocity(Math.cos(a)*620,Math.sin(a)*620);this.time.delayedCall(1150,()=>{if(b.active)this.recycle(b);});this.ammo--;this.fireCooldown=145;this.updateHud(); }
  private enemyShoot(e:Fighter,a:number):void {const b=this.enemyBullets.get(e.x+Math.cos(a)*20,e.y+Math.sin(a)*20,"enemyBullet") as Phaser.Physics.Arcade.Sprite|null;if(!b)return;b.setActive(true).setVisible(true).setDepth(6);b.body!.enable=true;b.setVelocity(Math.cos(a)*245,Math.sin(a)*245);this.time.delayedCall(3500,()=>{if(b.active)this.recycle(b);});}
  private recycle(b:Phaser.Physics.Arcade.Sprite):void {b.setVelocity(0,0).setActive(false).setVisible(false);if(b.body)b.body.enable=false;}
  private hitEnemy(b:Phaser.Physics.Arcade.Sprite,e:Fighter):void {if(!b.active||!e.active)return;this.recycle(b);e.hp=(e.hp??1)-1;e.setTint(0xffffff);this.time.delayedCall(90,()=>{if(e.active)e.clearTint();});if(e.hp<=0){e.destroy();this.kills++;this.updateHud();}}
  private hitPlayer(b:Phaser.Physics.Arcade.Sprite):void {if(!b.active)return;this.recycle(b);const now=this.time.now;if(now-this.lastDamage<450)return;this.lastDamage=now;this.hp=Math.max(0,this.hp-8);this.player.setVisible(true).setAlpha(.55).setDepth(20).setTint(0xff7777);this.time.delayedCall(130,()=>{if(this.player.active){this.player.setVisible(true).setAlpha(1).clearTint().setDepth(20);}});this.updateHud();if(this.hp<=0){this.dead=true;this.physics.pause();this.hud.message.textContent="OUTPOST LOST";this.hud.restart.hidden=false;}}
  private updateHud():void {this.hud.hp.textContent=String(this.hp);this.hud.bar.style.width=this.hp+"%";this.hud.bar.style.background=this.hp<30?"#ef6658":"#83d69a";this.hud.ammo.textContent=String(this.ammo);this.hud.wave.textContent=String(this.wave);this.hud.kills.textContent=String(this.kills);}
}
