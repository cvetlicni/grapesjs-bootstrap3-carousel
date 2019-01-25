import {compCarouselName, slideImgOne, slideImgThree, slideImgTwo, styleGen} from '../consts';

export default (editor, config = {}) => {
    const style = styleGen(config.prefixName);

    const domc = editor.DomComponents;
    const defaultType = domc.getType('default');

    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;

    var model = defaultModel.extend({
        defaults: {
            ...defaultModel.prototype.defaults,
            interval: config.interval,
            droppable: false,

            //  <div class="${config.prefixName} carousel slide" data-ride="carousel" data-type="${config.prefixName}">
            attributes: {
                class: `${config.prefixName} carousel slide`,
                'data-ride': 'carousel',
                'data-type': `${config.prefixName}`
            },

            slides: config.slides,
            autoplay: config.autoplay,
            showCaptions: config.showCaptions,
            showIndicator: config.showIndicator,
            flexVertical: config.flexVertical,
            hasGradient: config.hasGradient,

            moveTo: null, // To move left or right

            traits: [{
                label: 'Auto play',
                name: 'autoplay',
                changeProp: 1,
                type: 'checkbox'
            }, {
                label: 'Interval',
                name: 'interval',
                changeProp: 1,
                type: 'number'
            }, {
                label: '# Slides',
                name: 'slides',
                changeProp: 1,
                type: 'number'
            }, {
                label: 'Captions',
                name: 'showCaptions',
                changeProp: 1,
                type: 'checkbox'
            }, {
                label: 'Indicators',
                name: 'showIndicator',
                changeProp: 1,
                type: 'checkbox'
            }, {
                label: 'V-align flexbox',
                name: 'flexVertical',
                changeProp: 1,
                type: 'checkbox'
            }, {
                label: 'Gradient on controls',
                name: 'hasGradient',
                changeProp: 1,
                type: 'checkbox'
            }],
            script: function () {
                // Set the ID
                var id = this.id;

                // Set the indicators.
                var indicators = document.querySelectorAll(`#${id} .carousel-indicators li`);
                for (var indicator of indicators) {
                    indicator.setAttribute('data-target', `#${id}`);
                }

                var controls = document.querySelectorAll(`#${id} .carousel-control`);
                for (var control of controls) {
                    control.setAttribute('href', `#${id}`);
                }

                var init = function () {

                    if (!jQuery.fn.carousel) {
                        // Bootstrap carousel
                        (function ($) {
                            'use strict';

                            // CAROUSEL CLASS DEFINITION
                            // =========================

                            var Carousel = function (element, options) {
                                this.$element = $(element)
                                this.$indicators = this.$element.find('.carousel-indicators')
                                this.options = options
                                this.paused = null
                                this.sliding = null
                                this.interval = null
                                this.$active = null
                                this.$items = null

                                this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

                                this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
                                    .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
                                    .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
                            }

                            Carousel.VERSION = '3.3.7'

                            Carousel.TRANSITION_DURATION = 600

                            Carousel.DEFAULTS = {
                                interval: '{[ interval ]}',
                                pause: 'hover',
                                wrap: true,
                                keyboard: false
                            }

                            Carousel.prototype.keydown = function (e) {
                                if (/input|textarea/i.test(e.target.tagName))
                                    return
                                switch (e.which) {
                                    case 37:
                                        this.prev();
                                        break
                                    case 39:
                                        this.next();
                                        break
                                    default:
                                        return
                                }

                                e.preventDefault()
                            }

                            Carousel.prototype.cycle = function (e, interval) {
                                e || (this.paused = false)

                                this.interval && clearInterval(this.interval)

                                this.options.interval = interval || this.options.interval;

                                this.options.interval
                                && !this.paused
                                && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

                                return this
                            }

                            Carousel.prototype.getItemIndex = function (item) {
                                this.$items = item.parent().children('.item')
                                return this.$items.index(item || this.$active)
                            }

                            Carousel.prototype.getItemForDirection = function (direction, active) {
                                var activeIndex = this.getItemIndex(active)
                                var willWrap = (direction == 'prev' && activeIndex === 0)
                                    || (direction == 'next' && activeIndex == (this.$items.length - 1))
                                if (willWrap && !this.options.wrap)
                                    return active
                                var delta = direction == 'prev' ? -1 : 1
                                var itemIndex = (activeIndex + delta) % this.$items.length
                                return this.$items.eq(itemIndex)
                            }

                            Carousel.prototype.setInterval = function (i) {
                                this.cycle(null, i);
                            }

                            Carousel.prototype.to = function (pos) {
                                var that = this
                                var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

                                if (pos > (this.$items.length - 1) || pos < 0)
                                    return

                                if (this.sliding)
                                    return this.$element.one('slid.bs.carousel', function () {
                                        that.to(pos)
                                    }) // yes, "slid"
                                if (activeIndex == pos)
                                    return this.pause().cycle()

                                return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
                            }

                            Carousel.prototype.pause = function (e) {
                                e || (this.paused = true)

                                if (this.$element.find('.next, .prev').length && $.support.transition) {
                                    this.$element.trigger($.support.transition.end)
                                    this.cycle(true)
                                }

                                this.interval = clearInterval(this.interval)

                                return this
                            }

                            Carousel.prototype.next = function () {
                                if (this.sliding)
                                    return
                                return this.slide('next')
                            }

                            Carousel.prototype.prev = function () {
                                if (this.sliding)
                                    return
                                return this.slide('prev')
                            }

                            Carousel.prototype.slide = function (type, next) {
                                var $active = this.$element.find('.item.active')
                                var $next = next || this.getItemForDirection(type, $active)
                                var isCycling = this.interval
                                var direction = type == 'next' ? 'left' : 'right'
                                var that = this

                                if ($next.hasClass('active'))
                                    return (this.sliding = false)

                                var relatedTarget = $next[0]
                                var slideEvent = $.Event('slide.bs.carousel', {
                                    relatedTarget: relatedTarget,
                                    direction: direction
                                })
                                this.$element.trigger(slideEvent)
                                if (slideEvent.isDefaultPrevented())
                                    return

                                this.sliding = true

                                isCycling && this.pause()

                                if (this.$indicators.length) {
                                    this.$indicators.find('.active').removeClass('active')
                                    var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
                                    $nextIndicator && $nextIndicator.addClass('active')
                                }

                                var slidEvent = $.Event('slid.bs.carousel', {
                                    relatedTarget: relatedTarget,
                                    direction: direction
                                }) // yes, "slid"
                                if ($.support.transition && this.$element.hasClass('slide')) {
                                    $next.addClass(type)
                                    $next[0].offsetWidth // force reflow
                                    $active.addClass(direction)
                                    $next.addClass(direction)
                                    $active
                                        .one('bsTransitionEnd', function () {
                                            $next.removeClass([type, direction].join(' ')).addClass('active')
                                            $active.removeClass(['active', direction].join(' '))
                                            that.sliding = false
                                            setTimeout(function () {
                                                that.$element.trigger(slidEvent)
                                            }, 0)
                                        })
                                        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
                                } else {
                                    $active.removeClass('active')
                                    $next.addClass('active')
                                    this.sliding = false
                                    this.$element.trigger(slidEvent)
                                }

                                isCycling && this.cycle()

                                return this
                            }


                            // CAROUSEL PLUGIN DEFINITION
                            // ==========================

                            function Plugin(option) {
                                return this.each(function () {
                                    var $this = $(this)
                                    var data = $this.data('bs.carousel')
//                                    var options = Carousel.DEFAULTS
                                    var options = $.extend({}, Carousel.DEFAULTS, $this.data(), option);
                                    var action = typeof option === 'string' ? option : options.slide;

                                    if (!data)
                                        $this.data('bs.carousel', (data = new Carousel(this, options)));
                                    if (typeof option === 'number')
                                        data.setInterval(option);
                                    else if (typeof action === 'string')
                                        data[action] && data[action]();
                                    else if (options.interval)
                                        data.pause().cycle();
                                })
                            }

                            var old = $.fn.carousel;

                            $.fn.carousel = Plugin;
                            $.fn.carousel.Constructor = Carousel;


                            // CAROUSEL NO CONFLICT
                            // ====================

                            $.fn.carousel.noConflict = function () {
                                $.fn.carousel = old
                                return this
                            }


                            // CAROUSEL DATA-API
                            // =================

                            var clickHandler = function (e) {
                                var href
                                var $this = $(this)
                                var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
                                if (!$target.hasClass('carousel'))
                                    return
                                var options = $.extend({}, $target.data(), $this.data())
                                var slideIndex = $this.attr('data-slide-to')
                                if (slideIndex)
                                    options.interval = false

                                Plugin.call($target, options)

                                if (slideIndex) {
                                    $target.data('bs.carousel').to(slideIndex)
                                }

                                e.preventDefault()
                            }

                            $(document)
                                .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
                                .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

                            $(window).on('load', function () {
                                $('[data-ride="carousel"]').each(function () {
                                    var $carousel = $(this)
                                    Plugin.call($carousel, $carousel.data())
                                })
                            })

                        })(jQuery);

                        (function ($) {
                            'use strict';

                            // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
                            // ============================================================

                            function transitionEnd() {
                                var el = document.createElement('bootstrap')

                                var transEndEventNames = {
                                    WebkitTransition: 'webkitTransitionEnd',
                                    MozTransition: 'transitionend',
                                    OTransition: 'oTransitionEnd otransitionend',
                                    transition: 'transitionend'
                                }

                                for (var name in transEndEventNames) {
                                    if (el.style[name] !== undefined) {
                                        return {end: transEndEventNames[name]}
                                    }
                                }

                                return false // explicit for ie8 (  ._.)
                            }

                            // http://blog.alexmaccaw.com/css-transitions
                            $.fn.emulateTransitionEnd = function (duration) {
                                var called = false
                                var $el = this
                                $(this).one('bsTransitionEnd', function () {
                                    called = true
                                })
                                var callback = function () {
                                    if (!called)
                                        $($el).trigger($.support.transition.end)
                                }
                                setTimeout(callback, duration)
                                return this
                            }

                            $(function () {
                                $.support.transition = transitionEnd()

                                if (!$.support.transition)
                                    return

                                $.event.special.bsTransitionEnd = {
                                    bindType: $.support.transition.end,
                                    delegateType: $.support.transition.end,
                                    handle: function (e) {
                                        if ($(e.target).is(this))
                                            return e.handleObj.handler.apply(this, arguments)
                                    }
                                }
                            })
                        })(jQuery);
                    }

                    jQuery(`#${id}`).carousel({keyboard: false});
                    jQuery(`#${id}`).carousel(parseInt('{[ interval ]}'));
                    jQuery(`#${id}`).carousel('pause');

                    let autoPlay = Boolean('{[ autoplay ]}');
                    if (true === autoPlay) {
                        // The carousel is moving by default.
                        jQuery(`#${id}`).carousel('cycle');
                    }

                    let moveTo = '{[ moveTo ]}';
                    moveTo && jQuery(`#${id}`).carousel(moveTo);
                };

                if (typeof jQuery === 'undefined') {
                    var script = document.createElement('script');
                    script.onload = init;
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js';
                    document.body.appendChild(script);
                } else {
                    init();
                }
            }
        }
    }, {
        isComponent(el) {
            if (el.getAttribute && el.getAttribute('data-type') === config.prefixName) {
                return {type: compCarouselName};
            }
            return '';
        }
    });


    var view = defaultView.extend({

        events: {
            click: 'click'
        },

        addSlide() {
            this.model.set('slides', parseInt(this.model.get('slides')) + 1)
        },

        removeSlide() {
            this.model.set('slides', parseInt(this.model.get('slides')) - 1)
        },

        init() {
            this.listenTo(this.model, 'change:interval change:autoplay change:moveTo', this.updateScript);
            this.listenTo(this.model, 'change:flexVertical', this.handleVerticalAlign);
            this.listenTo(this.model, 'change:hasGradient', this.handleGradient);

            const comps = this.model.components();

            // Add a basic template if it's not yet initialized
            if (!comps.length) {
                comps.add(
                    `
                    <!-- Indicators -->
                    <ol class="carousel-indicators" data-type="${config.prefixName}-indicators">
                        <li data-target="#" data-slide-to="0" class="active" data-gjs-type="indicator"></li>
                        <li data-target="#" data-slide-to="1" data-gjs-type="indicator"></li>
                        <li data-target="#" data-slide-to="2" data-gjs-type="indicator"></li>
                    </ol>

                    <!-- Wrapper for slides -->
                    <div class="carousel-inner" role="listbox" data-type="${config.prefixName}-slides">
                        <div class="item carousel-item active" data-gjs-type="slide">
                            <img src="${slideImgOne}" alt="..." />
                            <div class="carousel-caption" data-gjs-type="text"> 
                               Slide 1
                            </div>
                        </div>
                        <div class="item carousel-item" data-gjs-type="slide">
                            <img src="${slideImgTwo}" alt="..." />
                            <div class="carousel-caption" data-gjs-type="text">
                                Slide 2
                            </div>
                        </div>
                        <div class="item carousel-item" data-gjs-type="slide">
                            <img src="${slideImgThree}" alt="..." />
                            <div class="carousel-caption" data-gjs-type="text">
                                Slide 3
                            </div>
                        </div>
                    </div>

                    <!-- Controls -->
                    <a class="${config.prefixName} left carousel-control" href="#" role="button" data-slide="prev">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 501.5 501.5" style="position: absolute;left: 40%;z-index: 5;top: calc(50% - 25px);">
                        <g><path fill="#2E435A" d="M302.67 90.877l55.77 55.508L254.575 250.75 358.44 355.116l-55.77 55.506L143.56 250.75z"/></g>
                        </svg>
                    </a>
                    <a class="${config.prefixName} right carousel-control" href="#" role="button" data-slide="next">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 501.5 501.5" style="position: absolute;right: 40%;z-index: 5;top: calc(50% - 25px)">
                        <g><path fill="#2E435A" d="M199.33 410.622l-55.77-55.508L247.425 250.75 143.56 146.384l55.77-55.507L358.44 250.75z"/></g>
                        </svg>
                    </a>
                    ${style}
                    `
                );
            }
        },

        handleVerticalAlign() {
            if (this.model.get('flexVertical')) {
                this.model.removeClass('flex-vertical');
            } else {
                this.model.addClass('flex-vertical');
            }
        },

        handleGradient() {
            if (this.model.get('hasGradient')) {
                this.model.removeClass('no-gradient-control');
            } else {
                this.model.addClass('no-gradient-control');
            }
        },

        click(event) {
            const _class = event.target.getAttribute('class') ? event.target.getAttribute('class').split(' ') : [];

            if (_class.includes('carousel-indicators') || _class.includes('carousel-control')) {
                event.preventDefault();
                event.stopPropagation();

                editor.select(this.model);
            }

            if (_class.includes('carousel-control') && _class.includes('left')) {
                // Move left
                this.model.set('moveTo', 'prev');
                this.model.set('moveTo', null);
            }

            if (_class.includes('carousel-control') && _class.includes('right')) {
                // Move right
                this.model.set('moveTo', 'next');
                this.model.set('moveTo', null);
            }
        },

        updateNumSlides() {
            const comps = this.model.get('components');

            const nSlides = this.model.get('slides');

            const autoplay = this.model.get('autoplay');

            // Stop the carousel.
            autoplay && this.model.set('autoplay', false);

            // Add/Remove slides. Change the active class to 0.
            comps.models.forEach(m => m.set('carouselSlides', nSlides));

            // Start the carousel.
            autoplay && this.model.set('autoplay', true);
        }
    });

    domc.addType(compCarouselName, {

        model: model,

        view: view
    });
}
