import loadComponents from './components';
import loadBlocks from './blocks';

export default grapesjs.plugins.add('grapesjs-simple-lp', (editor, opts = {}) => {

    const options = {...{
                prefixName: 'bst-carousel',
                
                gridsCategory: 'Extra'
        }, ...opts};

    // Add components
    loadComponents(editor, options);

    // Add blocks
    loadBlocks(editor, options);
});
