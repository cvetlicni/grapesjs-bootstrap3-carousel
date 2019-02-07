import {compCarouselName} from './consts';

export default (editor, config = {}) => {
    const blockManager = editor.BlockManager;

    blockManager.add(`${config.prefixName}-carousel`, {
        label: `Slider`,
        content: {type: compCarouselName},
        attributes: {class: 'fa fa-sliders'},
        ...config.carouselBlock
    });

    /*Material Photo Gallery*/
    blockManager.add(`${config.prefixName}-mpg`, {
        label: `Material Photo Gallery`,
        content: `
                <div class="${config.prefixName}-m-p-g" data-type="mpg-gallery" style="display: block;overflow: auto;">
			<div class="m-p-g__thumbs" data-google-image-layout data-max-height="350" style="display: block;overflow: auto;">
				<img src="http://unsplash.it/600/400?image=940" data-full="http://unsplash.it/1200/800?image=940" class="m-p-g__thumbs-img" />
				<img src="http://unsplash.it/640/450?image=906" data-full="http://unsplash.it/1280/900?image=906" class="m-p-g__thumbs-img" />
				<img src="http://unsplash.it/550/420?image=885" data-full="http://unsplash.it/1100/840?image=885" class="m-p-g__thumbs-img" />
				<img src="http://unsplash.it/650/450?image=823" data-full="http://unsplash.it/1300/900?image=823" class="m-p-g__thumbs-img" />
				<img src="http://unsplash.it/600/350?image=815" data-full="http://unsplash.it/1200/700?image=815" class="m-p-g__thumbs-img" />
				<img src="http://unsplash.it/560/500?image=677" data-full="http://unsplash.it/1120/1000?image=677" class="m-p-g__thumbs-img" />
				<img src="http://unsplash.it/600/400?image=940" data-full="http://unsplash.it/1200/800?image=940" class="m-p-g__thumbs-img" />
				<img src="http://unsplash.it/670/410?image=401" data-full="http://unsplash.it/1340/820?image=401" class="m-p-g__thumbs-img" />
				<img src="http://unsplash.it/620/340?image=623" data-full="http://unsplash.it/1240/680?image=623" class="m-p-g__thumbs-img" />
				<img src="http://unsplash.it/790/390?image=339" data-full="http://unsplash.it/1580/780?image=339" class="m-p-g__thumbs-img" />
			</div>

			<div class="m-p-g__fullscreen"></div>
		</div>
            `,
        attributes: {class: 'fa fa-th-large'},
        ...config.mpgBlock
    });
}
