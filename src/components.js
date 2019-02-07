import base from './components/base';
import indicator from './components/indictor';
import slide from './components/slide';
import control from './components/control';
import carousel from './components/carousel';
import singleSlide from './components/single-slides';
// import svg from './components/svg';
import singleIndicator from './components/single-indicator';
// mpg gallery
import mpgGallery from './components/mpg';

export default (editor, config = {}) => {

    base(editor, config);
    indicator(editor, config);
    slide(editor, config);
    control(editor, config);
    carousel(editor, config);
    singleSlide(editor, config);
    // svg(editor, config);
    singleIndicator(editor, config);

    // MPG Gallery
    mpgGallery(editor, config);
}
