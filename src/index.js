import loadComponents from './components';
import loadBlocks from './blocks';

export default grapesjs.plugins.add('grapesjs-plugin-carousel', (editor, opts = {}) => {

    const options = {...{
                blocks: ['carousel', 'mpg'],

                prefixName: 'bst-carousel',

                gridsCategory: 'Extra',

                autoplay: true,

                interval: 5000,

                slides: 3,

                mpgCss: 'https://ettrics.github.io/material-photo-gallery/dist/css/material-photo-gallery.css',

                mpgJs: 'https://ettrics.github.io/material-photo-gallery/dist/js/material-photo-gallery.min.js'
        }, ...opts};

    // Add components
    loadComponents(editor, options);

    // Add blocks
    loadBlocks(editor, options);
});
