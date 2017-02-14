
class AudioPlayer {

	constructor() {
		this.audio = new Audio();
		this.audio.src = 'dramatic.mp3';
		this.ctx = new AudioContext();
		this.audio.oncanplay = this.setUpStream.bind(this);
		this.stream = null;
	}

	setUpStream() {
		// create a stream from our AudioContext
		const dest = this.ctx.createMediaStreamDestination();
		this.stream = dest.stream;
		// connect our audio element's output to the stream
		const sourceNode = this.ctx.createMediaElementSource(this.audio);
		sourceNode.connect(dest);
		sourceNode.connect(this.ctx.destination);

		this.audio.oncanplay = null;

	}

	get track() {
		return this.stream.getAudioTracks()[0];
	}

	start() {
		this.audio.play();
	}

	stop() {
		this.audio.pause();
		this.audio.currentTime = 0;
	}
}

export default AudioPlayer;