import base from './components/base';
import indicator from './components/indictor';
import slide from './components/slide';
import control from './components/control';
import carousel from './components/carousel';
// mpg gallery
import mpgGallery from './components/mpg';

export default (editor, config = {}) => {
    
    base(editor, config);
    indicator(editor, config);
    slide(editor, config);
    control(editor, config);
    carousel(editor, config);
    
    // MPG Gallery
    mpgGallery(editor, config);
}
