import {compBaseName} from '../consts';

export default (editor, config = {}) => {
    const domc = editor.DomComponents;
    const defaultType = domc.getType('default');

    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;

    const TYPE = compBaseName;

    var model = defaultModel.extend({
        defaults: {
            ...defaultModel.prototype.defaults,
            droppable: false,
            draggable: false,

            copyable: false,
            selectable: false,
            removable: false,
            stylable: false,
            layerable: false,

            carouselSlides: 3
        },

    }, {
        isComponent(el) {
            return '';
        }
    });

    var view = defaultView.extend({

    });

    domc.addType(TYPE, {

        model: model,

        view: defaultView
    });
}
