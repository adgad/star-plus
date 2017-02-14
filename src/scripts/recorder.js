/*globals MediaRecorder */
class Recorder {

	constructor(stream) {
		this.stream = stream;
		this.mediaSource = new MediaSource();
		this.mediaRecorder = null;
		this.recordedBlobs = [];
		this.sourceBuffer = null;
	}

	start() {
		const options = { mimeType: 'video/webm' };
		//reset the recorded blobs
		this.recordedBlobs = [];

		try {
			this.mediaRecorder = new MediaRecorder(this.stream, options);
		} catch (e0) {
			console.log('Unable to create MediaRecorder with options Object: ', e0);
			//if it fails, try another codec
			try {
				options.mimeType = 'video/webm,codecs=vp9';
				this.mediaRecorder = new MediaRecorder(this.stream, options);
			} catch (e1) {
				console.log('MediaRecorder is not supported by this browser');
				return;
			}
			
		}

		//store the data whenever the mediarecorder gives us something
		const handleDataAvailable = (event) => {
			if (event.data && event.data.size > 0) {
				this.recordedBlobs.push(event.data);
			}
		};

		this.mediaRecorder.ondataavailable = handleDataAvailable;

		//start recording
		this.mediaRecorder.start(100);
	}

	stop() {
		this.mediaRecorder.stop();
	}

	download() {
		const blob = new Blob(this.recordedBlobs, {type: 'video/webm'});
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = 'star-plus.webm';
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 100);
	}

}

export default Recorder;