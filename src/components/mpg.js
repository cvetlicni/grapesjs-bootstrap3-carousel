
export default (editor, config = {}) => {
    const domc = editor.DomComponents;
    const defaultType = domc.getType('default');

    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;

    const TYPE = 'mpgGallery';

    var model = defaultModel.extend({

        defaults: {
            ...defaultModel.prototype.defaults,
            droppable: false,

            jsSrc: config.mpgJs,
            cssSrc: config.mpgCss,

            traits: [],
            script: function () {
                // Set the ID
                var id = this.id;

                var init = function () {
                    var elem = document.getElementById(id);
                    try {
                        if (MaterialPhotoGallery && elem) {
                            var gallery = new MaterialPhotoGallery(elem);
                            return;
                        }

                        elem.innerHTML = '<h2>MaterialPhotoGallery is not loaded!</h2>';
                        console.error('MaterialPhotoGallery is not loaded!');

                    } catch (e) {
                        elem.innerHTML = '<h2>MaterialPhotoGallery is not loaded!</h2>';
                        console.error('MaterialPhotoGallery is not loaded!', e);
                    }
                };

                var script = document.querySelector('script[src="{[ jsSrc ]}"]');
                var style = document.querySelector('script[src="{[ cssSrc ]}"]');

                var races = [];

                if (!script) {
                    races.push(new Promise(function (resolve, reject) {
                        var script = document.createElement('script');
                        script.onload = resolve;
                        script.onerror = reject;
                        script.src = '{[ jsSrc ]}';
                        document.body.appendChild(script);
                    }));
                }

                if (!style) {
                    races.push(new Promise(function (resolve, reject) {
                        var link = document.createElement('link');
                        link.onload = resolve;
                        link.onerror = reject;
                        link.rel = 'stylesheet';
                        link.href = '{[ cssSrc ]}';
                        document.head.appendChild(link);
                    }));
                }

                Promise.all(races).then(init);
            }
        }
    }, {
        isComponent(el) {

            if (el.tagName === 'DIV' && el.className.includes(`${config.prefixName}-m-p-g`) && el.getAttribute && el.getAttribute('data-type') === 'mpg-gallery') {
                return {type: TYPE};
            }
            return '';
        }
    });

    /*
     * Events to handle:
     * 
     * component:clone Could be clone one img
     * canvas:drop Could be reorder one img
     * 
     * sorter:drag:start / sorter:drag:end Could be the sort event
     * component:remove Remove an img from the mpg
     * 
     * We should call the scriptUpdated againg to update the MPG library
     * 
     */

    let getDoc = () => {
        var iframes = document.querySelectorAll("iframe.gjs-frame");

        if (iframes.length < 1) {
            return document;
        }

        return iframes[0].contentDocument || iframes[0].contentWindow.document;
    };

    let getWin = (doc) => {
        return doc.parentWindow || doc.defaultView; //  Window
    };

    var view = defaultView.extend({

        events: {
            click: 'click'
        },

        click(event) {
            event.preventDefault();
            event.stopPropagation();

            if (event.target === this.el) {
                return;
            }

            let $ = editor.$;

            let w = getWin(getDoc());

            let width = $(event.target).css('width');
            let height = $(event.target).css('height');

            editor.select(event.target);

            w.onwheel = null;
            w.ontouchmove = null;

            // Set the old sizes
            $(event.target).css('opacity', '1');
            $(event.target).css('width', width);
            $(event.target).css('height', height);
            
            $(this.el).find('.m-p-g__controls').css('display', 'none');
            $(this.el).find('.m-p-g__fullscreen').css('display', 'none');
        }
    });

    domc.addType(TYPE, {

        model: model,

        view: view
    });
}
