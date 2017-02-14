import StarPlusCanvas from './star-plus-canvas';
import AudioPlayer from './audio-player';
import Recorder from './recorder';
import imageLoader from './image-loader';

const init = () => {

	const canvasEl = document.getElementById('c');
	const imageLoaderEl =  document.getElementById('imageLoader');
	const startBtn = document.getElementById('start');
	const stopBtn = document.getElementById('stop');
	const downloadBtn = document.getElementById('download');

	const spCanvas = new StarPlusCanvas(canvasEl);
	const audioPlayer = new AudioPlayer();
	const recorder = new Recorder(spCanvas.stream, audioPlayer);

	imageLoader(imageLoaderEl, spCanvas.init.bind(spCanvas));

	const stop = () => {
		spCanvas.stop();
		audioPlayer.stop();
		recorder.stop();
		downloadBtn.classList.add('show');
	};
	
	startBtn.addEventListener('click', () => {
		spCanvas.start().then(stop);
		audioPlayer.start();
		recorder.start();
		downloadBtn.classList.remove('show');
	});


	stopBtn.addEventListener('click', stop);

	downloadBtn.addEventListener('click', () => {
		recorder.download();
	});
};

init();