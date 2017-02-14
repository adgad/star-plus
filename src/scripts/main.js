import StarPlusCanvas from './star-plus-canvas';
import AudioPlayer from './audio-player';
import Recorder from './recorder';
import imageLoader from './image-loader';

const init = () => {

	const canvasEl = document.getElementById('c');
	const audioEl = document.getElementById('a');
	const imageLoaderEl =  document.getElementById('imageLoader');
	const startBtn = document.getElementById('start');
	const stopBtn = document.getElementById('stop');

	const spCanvas = new StarPlusCanvas(canvasEl);
	const audioPlayer = new AudioPlayer(audioEl);
	const recorder = new Recorder(spCanvas.stream);

	imageLoader(imageLoaderEl, spCanvas.init.bind(spCanvas));

	startBtn.addEventListener('click', () => {
		spCanvas.start();
		audioPlayer.start();
		recorder.start();
	});
	stopBtn.addEventListener('click', () => {
		spCanvas.stop();
		audioPlayer.stop();
		recorder.stop();
		recorder.download();
	});
};

init();