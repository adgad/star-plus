
class AudioPlayer {

	constructor(el) {
		this.el = el;
		this.ctx = new AudioContext();
		this.el.oncanplay = this.setUpStream.bind(this);
		this.stream = null;
	}

	setUpStream() {
		// create a stream from our AudioContext
		const dest = this.ctx.createMediaStreamDestination();
		this.stream = dest.stream;
		// connect our audio element's output to the stream
		const sourceNode = this.ctx.createMediaElementSource(this.el);
		sourceNode.connect(dest);
		sourceNode.connect(this.ctx.destination);

		this.el.oncanplay = null;

	}

	get track() {
		return this.stream.getAudioTracks()[0];
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