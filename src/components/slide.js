import {compSlideName, compBaseName, slideImgOne} from '../consts';

export default (editor, config = {}) => {
    const domc = editor.DomComponents;
    const defaultType = domc.getType(compBaseName);

    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;

    const TYPE = compSlideName;
    var model = defaultModel.extend({
        defaults: {
            ...defaultModel.prototype.defaults,
            traits: [],
            orderId: []
        },

    }, {
        isComponent(el) {

            if (el.tagName === 'DIV' && el.className.includes('ch-carousel-inner') && el.getAttribute && el.getAttribute('data-type') === `${config.prefixName}-slides`) {
                return {type: TYPE};
            }
            return '';
        }
    });


    var view = defaultView.extend({
        init() {
            this.listenTo(this.model.components(), 'add', this.addSlide);
            this.listenTo(this.model.components(), 'remove', this.removeSlide);
            this.listenTo(this.model.parent(), 'change:slides', this.handleSlidesNumChange);
            this.listenTo(this.model.parent(), 'change:showCaptions', this.toggleCaptions);
            this.orderIds();
        },

        orderIds() {
            this.model.set('orderId', this.model.get('components').map(e => e.cid));
        },

        toggleCaptions() {
            if (this.model.parent().get('showCaptions')) {
                this.model.parent().removeClass('caption-none');
            } else {
                this.model.parent().addClass('caption-none');
            }
        },

        addSlide(e) {
            this.orderIds();
            if (this.model.get('shouldRefresh')) {
                if (e.changed.status === '') {
                    this.model.parent().view.addSlide();
                    return;
                }
                let position = this.model.components().models.findIndex(f => f.cid === e.cid);
                let captionComponents = this.model.get('components').parent.parent().components().models[3].components();
                captionComponents.models[position - 1].removeClass('active');
                let cloned = captionComponents.models[position - 1].clone();
                captionComponents.models[0].addClass('active');
                captionComponents.set(captionComponents.models.slice(0, position).concat([cloned], captionComponents.models.slice(position)));
                this.model.parent().view.addSlide();
            }
        },

        removeSlide(e) {
            if (this.model.get('shouldRefresh')) {
                let position = this.model.get('orderId').findIndex(cid => cid === e.cid);
                let captionComponents = this.model.get('components').parent.parent().components().models[3].components();
                captionComponents.set(captionComponents.models.slice(0, position).concat(captionComponents.models.slice(position + 1)));
                captionComponents.models[0].addClass('active');
                this.resetActive(this.model.get('components'));
                this.model.parent().view.removeSlide();
            }
            this.orderIds();
        },

        handleSlidesNumChange() {
            this.model.set('shouldRefresh', false);
            this.model.set('carouselSlides', this.model.parent().get('slides'));
            this.updateSlides();
            this.model.parent().view.updateNumSlides();
            this.model.set('shouldRefresh', true);
        },

        updateSlides() {
            var comps = this.model.get('components');

            const n = parseInt(this.model.get('carouselSlides'));

            const id = this.el.id;

            const diff = (n - comps.length);

            const l = Math.abs(diff);

            if (diff < 0) {
                this.reduce(comps, l);
            } else if (diff > 0) {
                this.increse(comps, l);
            }

            this.resetActive(comps);
        },

        reduce(comps, n) {
            [...Array(n).keys()].forEach((i) => {
                comps.pop();
                comps.parent.parent().components().models[3].components().pop();
            });
        },

        increse(comps, n) {
            [...Array(n).keys()].forEach((i) => {
                let output = `<div class="item carousel-item" data-gjs-type="slide"></div>`;
                let outputCaption = `<div class="ch-carousel-caption" data-gjs-type="text">New Slide</div>`;
                comps.add(output);
                comps.parent.parent().components().models[3].components().add(outputCaption);
            });
        },

        resetActive(comps){
            [...Array(comps.length).keys()].forEach((i) => {
                comps.at(i).setClass('item');
            });

            comps.at(0).addClass('active');
        }
    });

    domc.addType(TYPE, {

        model: model,

        view: view
    });
}
