import Rabbit from './Rabbit';

export default class Fox {
  x: number; y: number; vx: number; vy: number;
  color: string;

  speed: number;
  senseRadius: number;
  attackRadius: number;
  foxSeparationRadius: number;

  wanderJitter: number;
  wanderClamp: number;

  killCooldownFrames: number;
  private _cooldown: number;

  private edgeMargin: number;
  private edgePush: number;

  target: Rabbit | null;

  constructor(
    x: number,
    y: number,
    opts?: Partial<{
      speed: number;
      senseRadius: number;
      attackRadius: number;
      foxSeparationRadius: number;
      wanderJitter: number;
      wanderClamp: number;
      killCooldownFrames: number;
      color: string;
      edgeMargin: number;
      edgePush: number;
    }>
  ) {
    this.x = x; this.y = y; this.vx = 0; this.vy = 0;

    this.speed = opts?.speed ?? 0.45;
    this.senseRadius = opts?.senseRadius ?? 30;
    this.attackRadius = opts?.attackRadius ?? 1.0;
    this.foxSeparationRadius = opts?.foxSeparationRadius ?? 2.5;

    this.wanderJitter = opts?.wanderJitter ?? 0.06;
    this.wanderClamp = opts?.wanderClamp ?? 0.40;

    this.killCooldownFrames = opts?.killCooldownFrames ?? 5;
    this._cooldown = 0;

    this.edgeMargin = opts?.edgeMargin ?? 6;
    this.edgePush = opts?.edgePush ?? 1.0;

    this.target = null;
    this.color = opts?.color ?? Fox.randomFoxColor();
  }

  static randomFoxColor(): string {
    const r = 200 + Math.floor(Math.random() * 40);
    const g = 80 + Math.floor(Math.random() * 30);
    const b = 30 + Math.floor(Math.random() * 20);
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  update(rabbits: Rabbit[], otherFoxes: Fox[], worldW: number, worldH: number): Rabbit[] {
    const killed: Rabbit[] = [];
    if (this._cooldown > 0) this._cooldown--;

    if (this.target && (this.target.isCompleted?.() ?? this.target.completed)) this.target = null;

    if (!this.target) {
      this.target = this.acquireNearestRabbit(rabbits);
    } else {
      const d2 = this.dist2To(this.target.x, this.target.y);
      if (d2 > this.senseRadius * this.senseRadius) {
        const repl = this.acquireNearestRabbit(rabbits);
        if (repl) this.target = repl;
      }
    }

    let ax = 0, ay = 0;

    if (this.target) {
      const lead = this.leadTarget(this.target);
      const seekVec = this.seek(lead.x, lead.y);
      ax += seekVec.x; ay += seekVec.y;
    } else {
      const wander = this.wander();
      ax += wander.x; ay += wander.y;
      // gentle damping so idle fox keeps wandering but not drift forever
      this.vx *= 0.95; this.vy *= 0.95;
      // ensure some baseline movement so it doesn't "freeze"
      if (Math.hypot(this.vx, this.vy) < 0.05) {
        const theta = Math.random() * Math.PI * 2;
        ax += Math.cos(theta) * 0.1;
        ay += Math.sin(theta) * 0.1;
      }
    }

    const sep = this.separateFromFoxes(otherFoxes, this.foxSeparationRadius);
    ax += sep.x; ay += sep.y;

    const edge = this.edgeAvoid(worldW, worldH);
    ax += edge.x; ay += edge.y;

    this.vx += ax; this.vy += ay;

    const vmag = Math.hypot(this.vx, this.vy);
    if (vmag > 1e-6) {
      const s = this.speed / vmag;
      this.vx *= s; this.vy *= s;
    }

    this.x += this.vx; this.y += this.vy;

    // hard clamp to board after moving
    this.x = Math.max(0, Math.min(worldW - 1, this.x));
    this.y = Math.max(0, Math.min(worldH - 1, this.y));

    if (this.target && this._cooldown === 0) {
      const d2 = this.dist2To(this.target.x, this.target.y);
      if (d2 <= this.attackRadius * this.attackRadius) {
        this.target.completed = true;
        killed.push(this.target);
        this.target = null;
        this._cooldown = this.killCooldownFrames;
      }
    }

    return killed;
  }

  private acquireNearestRabbit(rabbits: Rabbit[]): Rabbit | null {
    let best: Rabbit | null = null;
    let bestD2 = this.senseRadius * this.senseRadius;
    for (const r of rabbits) {
      if (r.completed || (r.isCompleted?.() ?? false)) continue;
      const d2 = this.dist2To(r.x, r.y);
      if (d2 <= bestD2) { bestD2 = d2; best = r; }
    }
    return best;
  }

  private leadTarget(r: Rabbit): { x: number; y: number } {
    const dir = r.getDirection ? r.getDirection() : { x: 0, y: 0 };
    const dmag = Math.hypot(dir.x, dir.y) || 1;
    const rvx = (dir.x / dmag) * r.speed;
    const rvy = (dir.y / dmag) * r.speed;

    const dx = r.x - this.x, dy = r.y - this.y;
    const dist = Math.hypot(dx, dy);
    const rel = Math.max(1e-3, this.speed - r.speed * 0.5);
    const t = Math.min(15, dist / rel);

    return { x: r.x + rvx * t, y: r.y + rvy * t };
  }

  private seek(tx: number, ty: number): { x: number; y: number } {
    const dx = tx - this.x, dy = ty - this.y;
    const d = Math.hypot(dx, dy);
    if (d < 1e-6) return { x: 0, y: 0 };
    const desX = (dx / d) * this.speed, desY = (dy / d) * this.speed;
    return { x: desX - this.vx, y: desY - this.vy };
  }

  private wander(): { x: number; y: number } {
    const jx = (Math.random() * 2 - 1) * this.wanderJitter;
    const jy = (Math.random() * 2 - 1) * this.wanderJitter;
    let wx = this.vx + jx, wy = this.vy + jy;
    const wmag = Math.hypot(wx, wy);
    if (wmag > this.wanderClamp) { wx = (wx / wmag) * this.wanderClamp; wy = (wy / wmag) * this.wanderClamp; }
    return { x: wx - this.vx, y: wy - this.vy };
  }

  private separateFromFoxes(others: Fox[], radius: number): { x: number; y: number } {
    let ax = 0, ay = 0; const r2 = radius * radius;
    for (const o of others) {
      if (o === this) continue;
      const dx = this.x - o.x, dy = this.y - o.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > 1e-6 && d2 < r2) { const d = Math.sqrt(d2); ax += dx / d; ay += dy / d; }
    }
    return { x: ax, y: ay };
  }

  private edgeAvoid(worldW: number, worldH: number): { x: number; y: number } {
    let ax = 0, ay = 0;
    if (this.x < this.edgeMargin) ax += this.edgePush;
    if (this.x > worldW - this.edgeMargin) ax -= this.edgePush;
    if (this.y < this.edgeMargin) ay += this.edgePush;
    if (this.y > worldH - this.edgeMargin) ay -= this.edgePush;
    return { x: ax, y: ay };
  }

  private dist2To(tx: number, ty: number): number {
    const dx = this.x - tx, dy = this.y - ty;
    return dx * dx + dy * dy;
  }
}
