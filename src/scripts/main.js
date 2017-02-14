import StarPlusCanvas from './star-plus-canvas';
import imageLoader from './image-loader';

const init = () => {

	const canvasEl = document.getElementById('c');
	const imageLoaderEl =  document.getElementById('imageLoader');
	const startBtn = document.getElementById('start');
	const stopBtn = document.getElementById('stop');

	const spCanvas = new StarPlusCanvas(canvasEl);

	imageLoader(imageLoaderEl, spCanvas.init.bind(spCanvas));

	startBtn.addEventListener('click', () => {
		console.log('starting');
		spCanvas.start();
	});
	stopBtn.addEventListener('click', () => {
		console.log('stop');
		spCanvas.stop();
	});
};

init();