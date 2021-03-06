/*globals MediaRecorder */
class Recorder {

	constructor(stream, audioPlayer) {
		this.stream = stream;
		this.mediaSource = new MediaSource();
		this.mediaRecorder = null;
		this.recordedBlobs = [];
		this.sourceBuffer = null;
		this.audioPlayer = audioPlayer;
	}

	start() {
		//reset the recorded blobs
		this.recordedBlobs = [];
		if(this.stream && this.stream.addTrack) {
			this.stream.addTrack(this.audioPlayer.track);
		}


		try {
			var mixedStream = 'MediaStream' in window ? 
			new MediaStream([this.stream.getVideoTracks()[0], this.audioPlayer.track]) :
			this.stream;
			let options = {mimeType: 'video/webm;codecs=vp9'};
			if (!MediaRecorder.isTypeSupported(options.mimeType)) {
				console.error(`${options.mimeType} is not Supported`);
				options = {mimeType: 'video/webm;codecs=vp8'};
				if (!MediaRecorder.isTypeSupported(options.mimeType)) {
					console.error(`${options.mimeType} is not Supported`);
					options = {mimeType: 'video/webm'};
					if (!MediaRecorder.isTypeSupported(options.mimeType)) {
						console.error(`${options.mimeType} is not Supported`);
						options = {mimeType: ''};
					}
				}
			}
			this.mediaRecorder = new MediaRecorder(mixedStream, options);
		} catch (e) {
			console.log('MediaRecorder is not supported by this browser', e);
			return;
		}

		//store the data whenever the mediarecorder gives us something
		const handleDataAvailable = (event) => {
			if (event.data && event.data.size > 0) {
				this.recordedBlobs.push(event.data);
			}
		};

		this.mediaRecorder.ondataavailable = handleDataAvailable;

		//start recording
		this.mediaRecorder.start(10);
	}

	stop() {
		if(this.mediaRecorder && this.mediaRecorder.state === 'recording') {
			this.mediaRecorder.stop();
		}
	}

	download() {
		const blob = new Blob(this.recordedBlobs, { type: 'video/webm' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = 'star-plus-' + new Date().getTime() + '.webm';
		document.body.appendChild(a);
		a.click();
		setTimeout(() => {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 100);
	}

}

export default Recorder;