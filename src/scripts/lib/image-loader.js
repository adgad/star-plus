export default function(el, onLoadFn) {
	const img = new Image();

	el.addEventListener('change', (e) => {
		const reader = new FileReader();
		reader.onload = function(event){

			img.onload = function(){
				onLoadFn(img);
			};
			img.src = event.target.result;
		};
		reader.readAsDataURL(e.target.files[0]);   
	}, false);
}