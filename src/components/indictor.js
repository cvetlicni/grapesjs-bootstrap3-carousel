export default (editor, config = {}) => {
    const domc = editor.DomComponents;
    const defaultType = domc.getType('default');

    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;

    const TYPE = 'carousel-indicator';
    
    var model = defaultModel.extend({
        defaults: {
            ...defaultModel.prototype.defaults,
            droppable: false,
            traits: []
        }
    }, {
        isComponent(el) {

            if (el.tagName === 'OL' && el.className.includes('carousel-indicators') && el.getAttribute && el.getAttribute('data-type') === `${config.prefixName}-indicators`) {
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
