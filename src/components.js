import indicator from './components/indictor';
import slide from './components/slide';
import carousel from './components/carousel';

export default (editor, config = {}) => {
    
    indicator(editor, config);
    slide(editor, config);
    carousel(editor, config);
    
}
