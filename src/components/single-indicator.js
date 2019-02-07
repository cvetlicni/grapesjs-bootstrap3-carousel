import {compBaseName, compSlideName} from "../consts";

export default (editor, config = {}) => {
    const domc = editor.DomComponents;
    const defaultType = domc.getType(compBaseName);

    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;

    const TYPE = 'indicator-point';
    var model = defaultModel.extend({
        defaults: {
            ...defaultModel.prototype.defaults,
            selectable: false,
            hoverable: false
        },
    }, {
        isComponent(el) {
            if (el.className && el.className.includes) {
                if (el.tagName === 'div' && el.className.includes('indicator-point')) {
                    return {type: TYPE};
                }
                return '';
            }

        }
    });
    var view = defaultView;

    domc.addType(TYPE, {

        model: model,

        view: view
    });
}
