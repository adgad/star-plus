
class AudioPlayer {

	constructor(el) {
		this.el = el;
	}

	start() {
		this.el.play();
	}

	stop() {
		this.el.pause();
		this.el.currentTime = 0;
	}
}

export default AudioPlayer;