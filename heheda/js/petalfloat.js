// 统一视觉特效模块
class VisualEffects {
	constructor(options = {}) {
		this.options = {
			// 通用配置
			zIndex: options.zIndex || 99999,
			pointerEvents: options.pointerEvents !== false,
			// 点击效果配置
			clickEffect: options.clickEffect !== false,
			clickColors: options.clickColors || ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"],
			// 花瓣效果配置
			petalEffect: options.petalEffect !== false,
			petalImagePath: options.petalImagePath || "./heheda/image/huaban.png",
			petalLife: options.petalLife || 30,
			maxParticles: options.maxParticles || 200
		};
		this.effects = [];
		this.init();
	}
	// 初始化所有启用的效果
	init() {
		if (this.options.clickEffect) {
			this.effects.push(new ClickEffect(this.options));
		}
		if (this.options.petalEffect) {
			this.effects.push(new PetalEffect(this.options));
		}
	}
	// 统一的重置大小方法
	resize() {
		this.effects.forEach(effect => effect.resize && effect.resize());
	}
	// 统一的销毁方法
	destroy() {
		this.effects.forEach(effect => effect.destroy && effect.destroy());
		this.effects = [];
	}
}
// 基础效果类
class BaseEffect {
	constructor(options) {
		this.options = options;
		this.canvas = null;
		this.ctx = null;
	}
	// 创建画布的通用方法
	createCanvas(className = '') {
		this.canvas = document.createElement("canvas");
		this.canvas.classList.add(className);
		this.canvas.style.cssText = `
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            border: none;
            background: none;
            pointer-events: ${this.options.pointerEvents ? 'none' : 'auto'};
            z-index: ${this.options.zIndex};
        `;
		document.body.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");
		this.updateSize();
	}
	// 更新画布大小的通用方法
	updateSize() {
		if (!this.canvas) return;
		const width = window.innerWidth;
		const height = window.innerHeight;
		this.canvas.width = width * 2;
		this.canvas.height = height * 2;
		this.canvas.style.width = width + 'px';
		this.canvas.style.height = height + 'px';
		if (this.ctx) {
			this.ctx.scale(2, 2);
		}
		return {
			width,
			height
		};
	}
	// 生成随机数的通用方法
	randomBetween(min, max) {
		return Math.random() * (max - min) + min;
	}
	// 生成随机整数的通用方法
	randomIntBetween(min, max) {
		return Math.floor(this.randomBetween(min, max));
	}
	// 销毁的通用方法
	destroy() {
		if (this.canvas && this.canvas.parentNode) {
			this.canvas.parentNode.removeChild(this.canvas);
		}
	}
}
// 点击效果类
class ClickEffect extends BaseEffect {
	constructor(options) {
		super(options);
		this.balls = [];
		this.longPressed = false;
		this.longPressTimer = null;
		this.multiplier = 0;
		this.pointer = null;
		this.init();
	}
	init() {
		if (!this.canvas) {
			this.createCanvas('click-effect');
		}
		this.createPointer();
		this.bindEvents();
		this.loop();
	}
	createPointer() {
		this.pointer = document.createElement("span");
		this.pointer.classList.add("pointer");
		this.pointer.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: #fff;
            border-radius: 50%;
            pointer-events: none;
            z-index: ${this.options.zIndex + 1};
            transform: translate(-50%, -50%);
            display: none;
        `;
		document.body.appendChild(this.pointer);
	}
	bindEvents() {
		if (!this.canvas) return;
		window.addEventListener('resize', () => this.updateSize(), false);
		// 鼠标事件
		window.addEventListener("mousedown", (e) => this.onMouseDown(e), false);
		window.addEventListener("mouseup", (e) => this.onMouseUp(e), false);
		window.addEventListener("mousemove", (e) => this.onMouseMove(e), false);
		// 触摸事件支持
		window.addEventListener("touchstart", (e) => this.onTouchStart(e), false);
		window.addEventListener("touchend", (e) => this.onTouchEnd(e), false);
		window.addEventListener("touchmove", (e) => this.onTouchMove(e), false);
	}
	onMouseDown(e) {
		this.handleDown(e.clientX, e.clientY);
	}
	onTouchStart(e) {
		if (e.touches.length > 0) {
			const touch = e.touches[0];
			this.handleDown(touch.clientX, touch.clientY);
		}
	}
	handleDown(x, y) {
		this.pushBalls(this.randomIntBetween(10, 20), x, y);
		document.body.classList.add("is-pressed");
		this.longPressTimer = setTimeout(() => {
			document.body.classList.add("is-longpress");
			this.longPressed = true;
		}, 500);
	}
	onMouseUp(e) {
		this.handleUp(e.clientX, e.clientY);
	}
	onTouchEnd(e) {
		if (e.changedTouches.length > 0) {
			const touch = e.changedTouches[0];
			this.handleUp(touch.clientX, touch.clientY);
		}
	}
	handleUp(x, y) {
		clearTimeout(this.longPressTimer);
		if (this.longPressed) {
			document.body.classList.remove("is-longpress");
			this.pushBalls(
				this.randomIntBetween(50 + Math.ceil(this.multiplier), 100 + Math.ceil(this.multiplier)),
				x, y
			);
			this.longPressed = false;
		}
		document.body.classList.remove("is-pressed");
	}
	onMouseMove(e) {
		this.updatePointer(e.clientX, e.clientY);
	}
	onTouchMove(e) {
		if (e.touches.length > 0) {
			const touch = e.touches[0];
			this.updatePointer(touch.clientX, touch.clientY);
		}
	}
	updatePointer(x, y) {
		if (this.pointer) {
			this.pointer.style.display = 'block';
			this.pointer.style.top = y + "px";
			this.pointer.style.left = x + "px";
		}
	}
	pushBalls(count, x, y) {
		for (let i = 0; i < count; i++) {
			this.balls.push(new Ball(x, y, this.longPressed, this.multiplier, this.options.clickColors));
		}
	}
	loop() {
		this.update();
		requestAnimationFrame(() => this.loop());
	}
	update() {
		const {
			width,
			height
		} = this.updateSize();
		// 清空画布
		this.ctx.fillStyle = "rgba(255, 255, 255, 0)";
		this.ctx.clearRect(0, 0, width * 2, height * 2);
		// 更新和绘制小球
		for (let i = 0; i < this.balls.length; i++) {
			const ball = this.balls[i];
			if (ball.r <= 0) continue;
			this.ctx.fillStyle = ball.color;
			this.ctx.beginPath();
			this.ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
			this.ctx.fill();
			ball.update(width, height);
		}
		// 更新 multiplier
		if (this.longPressed) {
			this.multiplier += 0.2;
		} else if (this.multiplier > 0) {
			this.multiplier = Math.max(0, this.multiplier - 0.4);
		}
		// 移除超出边界的小球
		this.removeOutOfBoundsBalls(width, height);
	}
	removeOutOfBoundsBalls(width, height) {
		this.balls = this.balls.filter(ball =>
			ball.x + ball.r >= 0 &&
			ball.x - ball.r <= width &&
			ball.y + ball.r >= 0 &&
			ball.y - ball.r <= height &&
			ball.r > 0
		);
	}
	destroy() {
		super.destroy();
		if (this.pointer && this.pointer.parentNode) {
			this.pointer.parentNode.removeChild(this.pointer);
		}
		this.longPressed = false;
		this.multiplier = 0;
		this.balls = [];
		if (this.longPressTimer) {
			clearTimeout(this.longPressTimer);
		}
	}
}
// 小球类
class Ball {
	constructor(x, y, longPressed, multiplier, colors) {
		this.x = x;
		this.y = y;
		this.angle = Math.PI * 2 * Math.random();
		if (longPressed) {
			this.multiplier = Math.random() * 0.5 + 14 + multiplier;
		} else {
			this.multiplier = Math.random() * 0.5 + 6;
		}
		this.vx = this.multiplier * Math.cos(this.angle);
		this.vy = this.multiplier * Math.sin(this.angle);
		this.r = Math.random() * 4 + 8;
		this.color = colors[Math.floor(Math.random() * colors.length)];
	}
	update(width, height) {
		const normalX = -2 / width * Math.sin(this.angle);
		const normalY = -2 / height * Math.cos(this.angle);
		this.x += this.vx + normalX;
		this.y += this.vy + normalY;
		this.r -= 0.3;
		this.vx *= 0.9;
		this.vy *= 0.9;
	}
}
// 花瓣效果类
class PetalEffect extends BaseEffect {
	constructor(options) {
		super(options);
		this.particles = [];
		this.animationId = null;
		this.time = 0;
		this.image = null;
		this.maxTime = options.petalLife;
		this.init();
	}
	async init() {
		if (!this.canvas) {
			this.createCanvas('petal-effect');
		}
		await this.loadImage();
		this.start();
	}
	loadImage() {
		return new Promise((resolve, reject) => {
			this.image = new Image();
			this.image.onload = resolve;
			this.image.onerror = reject;
			this.image.src = this.options.petalImagePath;
		});
	}
	start() {
		// 初始化一些粒子
		for (let i = 0; i < 4; i++) {
			this.addParticle();
		}
		this.render(true);
	}
	addParticle() {
		let px, py;
		if (Math.random() >= 0.5) {
			px = 0;
			py = this.randomIntBetween(0, window.innerHeight);
		} else {
			py = 0;
			px = this.randomIntBetween(0, window.innerWidth);
		}
		this.particles.push({
			x: px,
			y: py,
			alpha: 0.8,
			rotate: 0,
			scale: this.randomBetween(0.5, 1.0),
			vx: this.randomBetween(0.2, 2.2),
			vy: this.randomBetween(0.2, 1.2),
			va: -0.0002,
			vr: -this.randomBetween(1, 2),
			life: this.randomIntBetween(800, 1000)
		});
	}
	updateParticles() {
		for (let i = this.particles.length - 1; i >= 0; i--) {
			const p = this.particles[i];
			p.life--;
			if (p.life <= 0) {
				this.particles.splice(i, 1);
				continue;
			}
			p.x += p.vx;
			p.y += p.vy;
			p.rotate += p.vr;
			p.alpha = Math.max(0, p.alpha + p.va);
		}
	}
	render(continueAnimation) {
		this.updateParticles();
		if (this.time++ >= this.maxTime && this.particles.length < this.options.maxParticles) {
			this.time = 0;
			this.addParticle();
			this.addParticle();
		}
		this.ctx.clearRect(0, 0, this.canvas.width / 2, this.canvas.height / 2);
		for (const particle of this.particles) {
			this.drawParticle(particle);
		}
		if (continueAnimation) {
			this.animationId = requestAnimationFrame(() => this.render(true));
		}
	}
	drawParticle(particle) {
		const imgWidth = this.image.width * particle.scale;
		const imgHeight = this.image.height * particle.scale;
		this.ctx.save();
		this.ctx.translate(particle.x + imgWidth / 2, particle.y + imgHeight / 2);
		this.ctx.globalAlpha = particle.alpha;
		this.ctx.rotate(particle.rotate * Math.PI / 180);
		this.ctx.drawImage(
			this.image,
			-imgWidth / 2,
			-imgHeight / 2,
			imgWidth,
			imgHeight
		);
		this.ctx.restore();
	}
	stop() {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
	}
	destroy() {
		this.stop();
		super.destroy();
		this.particles = [];
	}
}
// 使用
const visualEffects = new VisualEffects({
	zIndex: 99999,
	clickEffect: true,
	petalEffect: true,
	clickColors: ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"],
	petalImagePath: "./heheda/image/huaban.png",
	petalLife: 50,
	maxParticles: 100
});
// 窗口大小改变时重置
window.addEventListener('resize', () => visualEffects.resize());
// 如果需要销毁效果
// visualEffects.destroy();