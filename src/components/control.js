export default (editor, config = {}) => {
    const domc = editor.DomComponents;
    const defaultType = domc.getType('default');

    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;

    const TYPE = 'carousel-control';

    var model = defaultModel.extend({
        defaults: {
            ...defaultModel.prototype.defaults,
            droppable: false,
            traits: []
        }
    }, {
        isComponent(el) {

            if (el.tagName === 'A' && el.className.includes('carousel-control')) {
                return {type: TYPE};
            }
            return '';
        }
    });


    var view = defaultView.extend({
        init() {
            console.log(TYPE)
        }
    });

    domc.addType(TYPE, {

        model: model,

        view: view
    });
}
