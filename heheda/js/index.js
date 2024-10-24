// 获取必要参数
let title = document.title;
let url = window.location.href;
if (!navigator.share) {
	document.getElementById("cd-top").style.display = "none";
}

//页面载入设置
if (navigator.userAgent.match(/(MSIE|rv:11\.0)/)) {
	document.body.classList.add("is-ie");
}
setTimeout(() => {
	document.body.classList.remove("is-loading")
}, 3000);

//网页飘落效果
let pf = new PF({
	life: 30,
});
pf.init();
pf.start();
window.onresize = function() {
	pf.reSize();
}

//分享设置
function call() {
	navigator.share({
		title: title,
		url: url,
		text: title
	});
}

// 通知
if ("Notification" in window) {
	if (window.Notification.permission == "granted") {
		sendNotification();
	} else if (window.Notification.permission != "denied") {
		window.Notification.requestPermission(function(permission) {
			sendNotification();
		});
	}
}

function sendNotification() {
	new Notification(title, {
		body: '久违了我的朋友，欢迎您的访问！',
		icon: './heheda/icon/128.png'
	})
}

// 标题判断
document.addEventListener('visibilitychange', function() {
	if (document.hidden) {
		//当窗口不可见
		document.title = '(つ ェ ⊂)我藏好了哦~';
	} else {
		//当窗口可见
		document.title = '(*゜ロ゜)ノ被发现了~';
		setTimeout(() => {
			document.title = title;
		}, 3000);
	}
})

// 鼠标点击效果
(function() {
	let balls = [];
	let longPressed = false;
	let longPress;
	let multiplier = 0;
	let width, height;
	let origin;
	let normal;
	let ctx;
	const colours = ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"];
	const canvas = document.createElement("canvas");
	document.body.appendChild(canvas);
	canvas.setAttribute("style",
		"width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed; pointer-events: none;"
	);
	const pointer = document.createElement("span");
	pointer.classList.add("pointer");
	document.body.appendChild(pointer);

	if (canvas.getContext && window.addEventListener) {
		ctx = canvas.getContext("2d");
		updateSize();
		window.addEventListener('resize', updateSize, false);
		loop();
		window.addEventListener("mousedown", function(e) {
			pushBalls(randBetween(10, 20), e.clientX, e.clientY);
			document.body.classList.add("is-pressed");
			longPress = setTimeout(function() {
				document.body.classList.add("is-longpress");
				longPressed = true;
			}, 500);
		}, false);
		window.addEventListener("mouseup", function(e) {
			clearInterval(longPress);
			if (longPressed == true) {
				document.body.classList.remove("is-longpress");
				pushBalls(randBetween(50 + Math.ceil(multiplier), 100 + Math.ceil(multiplier)), e
					.clientX, e
					.clientY);
				longPressed = false;
			}
			document.body.classList.remove("is-pressed");
		}, false);
		window.addEventListener("mousemove", function(e) {
			let x = e.clientX;
			let y = e.clientY;
			pointer.style.top = y + "px";
			pointer.style.left = x + "px";
		}, false);
	} else {
		console.log("canvas or addEventListener is unsupported!");
	}


	function updateSize() {
		canvas.width = window.innerWidth * 2;
		canvas.height = window.innerHeight * 2;
		canvas.style.width = window.innerWidth + 'px';
		canvas.style.height = window.innerHeight + 'px';
		ctx.scale(2, 2);
		width = (canvas.width = window.innerWidth);
		height = (canvas.height = window.innerHeight);
		origin = {
			x: width / 2,
			y: height / 2
		};
		normal = {
			x: width / 2,
			y: height / 2
		};
	}
	class Ball {
		constructor(x = origin.x, y = origin.y) {
			this.x = x;
			this.y = y;
			this.angle = Math.PI * 2 * Math.random();
			if (longPressed == true) {
				this.multiplier = randBetween(14 + multiplier, 15 + multiplier);
			} else {
				this.multiplier = randBetween(6, 12);
			}
			this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
			this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);
			this.r = randBetween(8, 12) + 3 * Math.random();
			this.color = colours[Math.floor(Math.random() * colours.length)];
		}
		update() {
			this.x += this.vx - normal.x;
			this.y += this.vy - normal.y;
			normal.x = -2 / window.innerWidth * Math.sin(this.angle);
			normal.y = -2 / window.innerHeight * Math.cos(this.angle);
			this.r -= 0.3;
			this.vx *= 0.9;
			this.vy *= 0.9;
		}
	}

	function pushBalls(count = 1, x = origin.x, y = origin.y) {
		for (let i = 0; i < count; i++) {
			balls.push(new Ball(x, y));
		}
	}

	function randBetween(min, max) {
		return Math.floor(Math.random() * max) + min;
	}

	function loop() {
		ctx.fillStyle = "rgba(255, 255, 255, 0)";
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < balls.length; i++) {
			let b = balls[i];
			if (b.r < 0) continue;
			ctx.fillStyle = b.color;
			ctx.beginPath();
			ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2, false);
			ctx.fill();
			b.update();
		}
		if (longPressed == true) {
			multiplier += 0.2;
		} else if (!longPressed && multiplier >= 0) {
			multiplier -= 0.4;
		}
		removeBall();
		requestAnimationFrame(loop);
	}

	function removeBall() {
		for (let i = 0; i < balls.length; i++) {
			let b = balls[i];
			if (b.x + b.r < 0 || b.x - b.r > width || b.y + b.r < 0 || b.y - b.r > height || b.r < 0) {
				balls.splice(i, 1);
			}
		}
	}
}())

// 版权
console.log("%c赵彤刚%c版权所有", "font-size:15px;padding:3px;color:white;background:#023047",
	"font-size:15px;padding:3px;color:white;background:#219EBC");
console.log("%c本人寻求一份前端开发的工作，有意者请联系%c\n%cTEL:15327682114%c\n%c微信:16699352957",
	"font-size:15px;padding:3px;color:white;background:#023047", "",
	"font-size:15px;padding:3px;color:white;background:#219EBC", "",
	"font-size:15px;padding:3px;color:white;background:#219EBC");