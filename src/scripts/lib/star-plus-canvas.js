/* globals FaceDetector */
import getOffset from '../utils/get-offset';

class StarPlusCanvas {

	constructor (el) {
		this.canvas = el;
		this.ctx = this.canvas.getContext('2d');
		this.img = null;
	}

	init(img) {
		this.focalPoints = [];
		this.isPlaying = false;
		this.canvas.width = window.innerWidth - 20;
		this.canvas.height = this.canvas.width / img.width * img.height;
 
		this.img = img;
		img.style.display = 'none';

		this.canvas.addEventListener('click', this.addPoint.bind(this));

		this.drawImage(img);

		this.detectFaces();
	}

	addPoint(e) {
		this.ctx.strokeText('x',e.layerX,e.layerY);
		this.focalPoints.push(getOffset(e));
	}

	drawImage() {
		this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.canvas.width, this.canvas.height);
	}

	get stream() {
		return typeof this.canvas.captureStream !== 'undefined' ? this.canvas.captureStream() : null;
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

		return this.zoom(zConf[0])
			.then(() => this.filter('brightness(10)', 100))
			.then(() => this.zoom(zConf[1]))
			.then(() => {
				this.filter('hue-rotate(50deg)', 400);
				return this.shake(zConf[2]);
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
			.then(() => this.shake(zConf[6]))
			.then(() => {
				this.filter('brightness(1.2)', 400);
				return this.zoom(zConf[7]);
			})
			.then(() => this.filter('invert(100%);blur(2px)', 2000))
			.then(() => this.zoom(zConf[8]))
			.then(() => {
				this.filter('hue-rotate(120deg)', 400);
				return this.zoom(zConf[9]);
			});
	}

	stop() {
		this.isPlaying = false;
		this.ctx.restore();
	}

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

	shake (opts, iterations) {
		this.ctx.save();
		iterations = iterations || 0;
		var doShake = () => {
			if(!this.isPlaying) return;
			return new Promise((resolve) => {
				if(iterations++ < opts.maxIterations) {
					var dx = Math.random()*10 - 5;
					var dy = Math.random()*10 - 5;
					this.ctx.translate(dx, dy);
					this.drawImage();
				} else {
					this.ctx.restore();
					return resolve();
				}
				
				
				requestAnimationFrame(() => {
					resolve(doShake(opts, iterations));
				});
			});
		};

		return Promise.resolve(doShake());
		
	}

	detectFaces() {
		if (window.FaceDetector == undefined) {
			console.error('Face Detection not supported');
			return;
		}

		const faceDetector = new FaceDetector();
		const scale = this.canvas.width / this.img.width;
		faceDetector.detect(this.img)
			.then(faces => {
			// Draw the faces on the <canvas>.
				this.ctx.lineWidth = 2;
				this.ctx.strokeStyle = 'red';
				for(let face of faces) {
					const box = face.boundingBox;
					this.ctx.rect(Math.floor(box.x * scale),
						Math.floor(box.y * scale),
						Math.floor(box.width * scale),
						Math.floor(box.height * scale));
					this.ctx.stroke();
					this.focalPoints.push({
						x: box.x * scale,
						y: box.y * scale
					});
				}
			})
		.catch((e) => {
			console.error('Boo, Face Detection failed: ' + e);
		});
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
			}, duration);
		});
	}
}




export default StarPlusCanvas;