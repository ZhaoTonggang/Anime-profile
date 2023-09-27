var PF = {};
(function() {
	function pf(option) {
		if (!option) {
			option = {};
		}
		this._plist = [];
		this._path = "./heheda/image/huaban.png"
		this._img = null;
		this._win = {
			w: window.innerWidth,
			h: window.innerHeight,
		}
		this._index = option.index || 99999;
		this.box = null;
		this.stage = null;
		this._anmition = null;
		this._time = null;
		this._maxtime = option.life || 30;
	}
	PF = pf;
	pf.prototype.init = function() {
		if (this.box) {
			return;
		}
		this._img = document.createElement("img");
		this._img.src = this._path;
		this.box = document.createElement("canvas");
		this.box.width = this._win.w;
		this.box.height = this._win.h;
		this.box.style.cssText =
			"display: block;position: fixed;top: 0;left: 0;margin: 0;padding: 0;border: none;background: none;pointer-events: none;";
		this.box.style.zIndex = this._index;
		document.body.appendChild(this.box);
		this.stage = this.box.getContext("2d");
	}
	pf.prototype.reSize = function() {
		this._win.w = window.innerWidth;
		this._win.h = window.innerHeight;
		this.box.width = this._win.w;
		this.box.height = this._win.h;
	}
	pf.prototype.action = function() {
		for (var i = 0; i < this._plist.length; i++) {
			this._plist[i].life--;
			if (this._plist[i].life <= 0) {
				this._plist.splice(i, 1);
				i--;
				continue;
			}
			this._plist[i].x += this._plist[i].vx;
			this._plist[i].y += this._plist[i].vy;
			this._plist[i]._rotate += this._plist[i].vr;
			this._plist[i]._alpha += this._plist[i].va;
		}
	}
	pf.prototype.render = function(k) {
		this.action();
		if (this._time++ >= this._maxtime) {
			this._time = 0;
			this.addImg();
			this.addImg();
		}
		this.stage.clearRect(0, 0, this.box.width, this.box.height);
		for (var i = 0; i < this._plist.length; i++) {
			this.drawImg(this._plist[i]);
		}
		if (k) {
			this._anmition = requestAnimationFrame(function() {
				this.render(1);
			}.bind(this));
		}
	}
	pf.prototype.addImg = function() {
		if (Math.random() >= 0.5) {
			var px = 0;
			var py = Math.floor(Math.random() * this._win.h)
		} else {
			var py = 0;
			var px = Math.floor(Math.random() * this._win.w)
		}
		if (px > 0 && py > 0) {
			debugger
		}
		this._plist.push({
			x: px,
			y: py,
			_alpha: 0.8,
			_rotate: 0,
			_scale: Math.random() * 0.5 + 0.5,
			vx: Math.random() * 2 + 0.2,
			vy: Math.random() + 0.2,
			va: -0.0002,
			vr: -(Math.random() * 1 + 1),
			life: Math.floor(Math.random() * 200) + 800,
		})
	}
	pf.prototype.start = function() {
		for (var i = 0; i < 4; i++) {
			this.addImg();
		}

		this.render(1);
	}
	pf.prototype.stop = function() {
		cancelAnimationFrame(this._anmition);
	}
	pf.prototype.drawImg = function(param) {
		var img_w = this._img.width * param._scale;
		var img_h = this._img.height * param._scale;

		this.stage.translate(param.x + img_w / 2, param.y + img_h / 2);
		this.stage.globalAlpha = param._alpha;
		this.stage.rotate(-(Math.PI / 180 * param._rotate));

		this.stage.drawImage(this._img, 0 - img_w, 0 - img_h, img_w, img_h);

		this.stage.rotate(Math.PI / 180 * param._rotate);
		this.stage.globalAlpha = 1;
		this.stage.translate(-(param.x + img_w / 2), -(param.y + img_h / 2));
	}
})();