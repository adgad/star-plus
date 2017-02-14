import StarPlusCanvas from './star-plus-canvas';
import AudioPlayer from './audio-player';
import imageLoader from './image-loader';

const init = () => {

	const canvasEl = document.getElementById('c');
	const audioEl = document.getElementById('a');
	const imageLoaderEl =  document.getElementById('imageLoader');
	const startBtn = document.getElementById('start');
	const stopBtn = document.getElementById('stop');

	const spCanvas = new StarPlusCanvas(canvasEl);
	const audioPlayer = new AudioPlayer(audioEl);

	imageLoader(imageLoaderEl, spCanvas.init.bind(spCanvas));

	startBtn.addEventListener('click', () => {
		spCanvas.start();
		audioPlayer.start();
	});
	stopBtn.addEventListener('click', () => {
		spCanvas.stop();
		audioPlayer.stop();
	});
};

init();