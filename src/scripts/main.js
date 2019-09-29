import StarPlusCanvas from './lib/star-plus-canvas';
import AudioPlayer from './lib/audio-player';
import Recorder from './lib/recorder';
import imageLoader from './lib/image-loader';

const init = () => {

	const mainEl = document.body;
	const canvasEl = document.getElementById('c');
	const imageLoaderEl =  document.getElementById('imageLoader');
	const startBtn = document.getElementById('start');
	const stopBtn = document.getElementById('stop');
	const downloadBtn = document.getElementById('download');

	const spCanvas = new StarPlusCanvas(canvasEl);
	let audioPlayer, recorder;

	imageLoader(imageLoaderEl, (img) => {
		mainEl.classList.remove('done');
		mainEl.classList.remove('playing');
		mainEl.classList.add('image-loaded');
		spCanvas.init(img);
	});

	const stop = () => {
		mainEl.classList.remove('image-loaded');
		mainEl.classList.remove('playing');
		mainEl.classList.add('done');
		spCanvas.stop();
		audioPlayer && audioPlayer.stop();
		recorder && recorder.stop();
		downloadBtn.classList.add('show');
	};
	
	startBtn.addEventListener('click', () => {
		audioPlayer = new AudioPlayer();
		recorder = new Recorder(spCanvas.stream, audioPlayer);
		audioPlayer.start().then(recorder.start.bind(recorder));
		mainEl.classList.remove('image-loaded');
		mainEl.classList.remove('done');
		mainEl.classList.add('playing');
		spCanvas.start().then(stop);
		downloadBtn.classList.remove('show');
	});


	stopBtn.addEventListener('click', stop);

	downloadBtn.addEventListener('click', () => {
		recorder.download();
	});
};


const registerWorker = () => {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('/star-plus/worker.js');
	}
};

init();
registerWorker();