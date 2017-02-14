import getOffset from './utils/get-offset';

class StarPlusCanvas {

	constructor (el) {
		this.canvas = el;
		this.ctx = this.canvas.getContext('2d');
		this.focalPoints = [];
		this.isPlaying = false;
		this.img = null;
	}

	init(img) {
		this.canvas.width = Math.min(window.innerWidth, 600);
		this.canvas.height = this.canvas.width / img.width * img.height;
 
		this.img = img;
		img.style.display = 'none';

		this.canvas.addEventListener('click', this.addPoint.bind(this));

		this.drawImage(img);
	}

	addPoint(e) {
		this.ctx.strokeText('x',e.layerX,e.layerY);
		this.focalPoints.push(getOffset(e));
	}

	drawImage() {
		this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.canvas.width, this.canvas.height);
	}

	padFocalPoints() {
		if(this.focalPoints.length < 10) {
			for(var i = this.focalPoints.length; i<10; i++) {
				this.focalPoints.push({
					x: Math.random() * this.canvas.width,
					y: Math.random() * this.canvas.height
				});
			}
		}
		return this.focalPoints;
	}

	start() {
		this.isPlaying = true;
		const zConf = this.padFocalPoints().map((pt) => ({
			ctx: this.ctx,
			start: pt,
			maxIterations: (Math.random() * 150) + 100,
			factor: (Math.random() * 0.02) + 1.005
		}));

		this.zoom(zConf[0])
			.then(() => this.filter('brightness(10)', 100))
			.then(() => this.zoom(zConf[1]))
			.then(() => {
				this.filter('hue-rotate(50deg)', 400);
				return this.zoom(zConf[2]);
			})
			.then(() => {
				this.filter('hue-rotate(-50deg)', 400);
				return this.zoom(zConf[3]);
			})
			.then(() => this.zoom(zConf[4]))
			.then(() => {
				this.filter('invert(100%)', 300);
				return this.zoom(zConf[5]);
			})
			.then(() => this.zoom(zConf[6]))
			.then(() => {
				this.filter('brightness(1.2)', 400);
				return this.zoom(zConf[7]);
			})
			.then(() => this.filter('invert(100%);blur(2px)', 2000))
			.then(() => this.zoom(zConf[8]))
			.then(function() {
				this.filter('hue-rotate(120deg)', 400);
				return this.zoom(zConf[9]);
			})
	}

	stop() {
		this.isPlaying = false;
		this.ctx.restore();
	}
// 	isStopped = true;
// 	ctx.restore();
// 	stopRecording();
// 	download();
// 	a.pause();
// 	a.currentTime = 0;
// }

	zoom (opts, iterations) {
		this.ctx.save();
		iterations = iterations || 0;
		var doZoom = () => {
			if(!this.isPlaying) return;
			return new Promise((resolve) => {
				this.ctx.translate(opts.start.x,opts.start.y);
				if(iterations++ < opts.maxIterations / 2) {
					this.ctx.scale(opts.factor, opts.factor);
				} else if (iterations < opts.maxIterations) {
					this.ctx.scale(1/opts.factor,1/opts.factor);
				} else {
					this.ctx.restore();
					return resolve('asda');
				}
				
				this.ctx.translate(-opts.start.x,-opts.start.y);
				this.drawImage();
				requestAnimationFrame(() => {
					resolve(doZoom(opts, iterations));
				});
			});
		};

		return Promise.resolve(doZoom());
		
	}

	filter(effect, duration) {
		if(!this.isPlaying) return;

		return new Promise((resolve) => {
			this.ctx.filter = effect;
			this.drawImage();
			setTimeout(() => {
				this.ctx.filter = 'none';
				this.drawImage();
				return resolve();
			}, duration)
		})
	}
}




export default StarPlusCanvas;