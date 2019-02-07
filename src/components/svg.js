import {compBaseName, compSlideName} from "../consts";

export default (editor, config = {}) => {
    const domc = editor.DomComponents;
    const defaultType = domc.getType(compBaseName);

    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;

    const TYPE = 'svg';
    var model = defaultModel.extend({
        defaults: {
            ...defaultModel.prototype.defaults,
            selectable: false
        },
    }, {
        isComponent(el) {
            if (el.className && el.className.includes) {
                if (el.tagName === 'svg' && el.className.includes('carousel-svg')) {
                    return {type: TYPE};
                }
            }

        }
    });
    var view = defaultView;

    domc.addType(TYPE, {

        model: model,

        view: view
    });
}
