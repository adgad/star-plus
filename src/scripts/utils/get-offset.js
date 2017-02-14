export default function(evt) {
	let el = evt.target;
	let x = 0;
	let y = 0;

	while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
		x += el.offsetLeft - el.scrollLeft;
		y += el.offsetTop - el.scrollTop;
		el = el.offsetParent;
	}

	x = evt.clientX - x;
	y = evt.clientY - y;

	return { x: x, y: y };
}