import base from './components/base';
import indicator from './components/indictor';
import slide from './components/slide';
import control from './components/control';
import carousel from './components/carousel';

export default (editor, config = {}) => {
    
    base(editor, config);
    indicator(editor, config);
    slide(editor, config);
    control(editor, config);
    carousel(editor, config);
}
