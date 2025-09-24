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
//分享设置
const call = () => {
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
		window.Notification.requestPermission((permission) => {
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
// 版权
console.log("%c赵彤刚%c版权所有", "font-size:15px;padding:3px;color:white;background:#023047",
	"font-size:15px;padding:3px;color:white;background:#219EBC");