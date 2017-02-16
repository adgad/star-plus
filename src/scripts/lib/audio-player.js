
class AudioPlayer {

	constructor() {
		this.audio = new Audio();
		this.srcset = ['dramatic.mp3', 'dramatic2.mp3', 'dramatic3.ogg'];

		if(typeof AudioContext === 'function') {

			this.ctx = new AudioContext();
			this.audio.oncanplay = this.setUpStream.bind(this);
		}
		this.stream = null;
	}

	setUpStream() {
		// create a stream from our AudioContext
		const dest = this.ctx.createMediaStreamDestination();
		this.stream = dest.stream;
		// connect our audio element's output to the stream
		const sourceNode = this.ctx.createMediaElementSource(this.audio);
		sourceNode.connect(this.ctx.destination);
		sourceNode.connect(dest);
		this.audio.oncanplay = null;
	}

	get track() {
		return this.stream.getAudioTracks()[0];
	}

	start() {
		this.audio.src = this.srcset[Math.floor(Math.random() * 2)];
		this.audio.loop = true;
		this.audio.play();
		return new Promise((resolve) => {
			this.audio.addEventListener('canplay', resolve);
		});

	}

	stop() {
		this.audio.pause();
		this.audio.currentTime = 0;
	}
}

export default AudioPlayer;