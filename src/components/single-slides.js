import {compBaseName, compSlideName} from "../consts";

export default (editor, config = {}) => {
    const domc = editor.DomComponents;
    const defaultType = domc.getType(compBaseName);

    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;

    const TYPE = 'slide';
    var model = defaultModel.extend({
        defaults: {
            ...defaultModel.prototype.defaults,
            draggable: false,
            selectable: true,
            removable: true,
            copyable: true,
            toolbar: [{attributes: {class: 'far fa-trash-alt'}, command: 'tlb-delete'},
                {attributes: {class: 'far fa-clone'}, command: 'tlb-clone'},
                {attributes: {class: 'far fa-arrow-up'}, command: 'select-parent'}],
            stylable: ['border-color', 'border-width', 'border-radius', 'border-style', 'background-color', 'opacity', 'margin', 'margin-left', 'margin-right', 'margin-bottom', 'margin-top',
        'padding', 'padding-left', 'padding-right', 'padding-bottom', 'padding-top', 'min-width', 'max-width', 'min-height', 'max-height'],
        },
    }, {
        isComponent(el) {
            if (el.className && el.className.includes) {
                if (el.tagName === 'DIV' && el.className.includes('item')) {
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
