import {compCarouselName, slideImgOne, slideImgThree, slideImgTwo, styleGen} from '../consts';

export default (editor, config = {}) => {
    const style = styleGen(config.prefixName);
    let shortStyle = JSON.stringify(style);
    shortStyle = shortStyle.replace(/\\n/g, '');
    shortStyle = shortStyle.replace(/  /g, '');
    console.log(shortStyle);

    const domc = editor.DomComponents;
    const defaultType = domc.getType('default');

    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;

    var model = defaultModel.extend({
        defaults: {
            ...defaultModel.prototype.defaults,
            interval: config.interval,
            droppable: false,

            attributes: {
                class: `${config.prefixName} carousel slide`,
                'data-ride': 'carousel',
                'data-type': `${config.prefixName}`
            },

            slides: config.slides,
            autoplay: config.autoplay,
            showCaptions: config.showCaptions,
            showIndicator: config.showIndicator,
            // hasGradient: config.hasGradient,

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
            }/*, {
                label: 'Gradient on controls',
                name: 'hasGradient',
                changeProp: 1,
                type: 'checkbox'
            }*/],
            script: function () {
                var interval = this.getAttribute('data-interval') || '5000';
                var autoplay = this.getAttribute('data-autoplay') || false;
                var moveTo = this.getAttribute('data-moveto') || '';
                // Set the ID
                var id = this.id;

                // Set the indicators.
                var indicators = document.querySelectorAll(`#${id} .carousel-indicators li`);
                for (var indicator of indicators) {
                    indicator.setAttribute('data-target', `#${id}`);
                }

                var controls = document.querySelectorAll(`#${id} .ch-carousel-control`);
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
                                interval: interval,
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
                                let activeIndex = this.$items.index(item || this.$active)
                                let counter = this.$items.parent().parent().children()[0]
                                if (counter && counter.innerText) counter.innerText = `${activeIndex + 1} of ${this.$items.length}`
                                return activeIndex;
                            }

                            Carousel.prototype.getItemForDirection = function (direction, active) {
                                var activeIndex = this.getItemIndex(active)
                                var willWrap = (direction == 'prev' && activeIndex === 0)
                                    || (direction == 'next' && activeIndex == (this.$items.length - 1))
                                if (willWrap && !this.options.wrap)
                                    return active
                                var delta = direction == 'prev' ? -1 : 1
                                var itemIndex = (activeIndex + delta) % this.$items.length
                                return itemIndex;
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
                                return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos), this.$element.find('.captions-container').children().eq(pos))
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

                            Carousel.prototype.slide = function (type, next, nextCaption) {
                                this.$indicators = this.$element.find('.carousel-indicators');
                                var $active = this.$element.find('.item.active')
                                var nextIndex = this.getItemForDirection(type, $active)
                                var $next = next || this.$items.eq(nextIndex);

                                var $captions = this.$element.find('.captions-container');
                                var $activeCaption = this.$element.find('.ch-carousel-caption.active')
                                var $nextCaption = nextCaption || $captions.children().eq(nextIndex);


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
                                    $nextCaption.addClass(type)
                                    $next[0].offsetWidth // force reflow
                                    $active.addClass(direction)
                                    $activeCaption.addClass(direction)
                                    $next.addClass(direction)
                                    $nextCaption.addClass(direction)
                                    $active
                                        .one('bsTransitionEnd', function () {
                                            $next.removeClass([type, direction].join(' ')).addClass('active')
                                            $nextCaption.removeClass([type, direction].join(' ')).addClass('active')
                                            $active.removeClass(['active', direction].join(' '))
                                            $activeCaption.removeClass(['active', direction].join(' '))
                                            that.sliding = false
                                            setTimeout(function () {
                                                that.$element.trigger(slidEvent)
                                            }, 0)
                                        })
                                        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
                                } else {
                                    $active.removeClass('active')
                                    $activeCaption.removeClass('active')
                                    $next.addClass('active')
                                    $nextCaption.addClass('active')
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
                    jQuery(`#${id}`).carousel(parseInt(interval));
                    jQuery(`#${id}`).carousel('pause');

                    let autoPlay = Boolean(autoplay);
                    if (true === autoPlay) {
                        // The carousel is moving by default.
                        jQuery(`#${id}`).carousel('cycle');
                    }

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
            this.model.set('slides', parseInt(this.model.get('slides')) + 1);
        },

        removeSlide() {
            this.model.set('slides', parseInt(this.model.get('slides')) - 1);
        },

        updatePage() {
            this.model.setAttributes({
                ...this.model.getAttributes(),
                'data-interval': this.model.get('interval'),
                'data-autoplay': this.model.get('autoplay'),
                'data-moveto': this.model.get('moveTo')
            });
            this.updateScript();

            setTimeout(() => {
                this.model.set('moveTo', null);
                this.updateScript();
            }, 600);
        },

        init() {
            this.model.setAttributes({
                'data-interval': this.model.get('interval'),
                'data-autoplay': this.model.get('autoplay'),
                'data-moveto': this.model.get('moveTo'),
                ...this.model.getAttributes()
            });

            this.listenTo(this.model, 'change:autoplay change:moveTo change:interval', this.updatePage);

            const comps = this.model.components();

            // Add a basic template if it's not yet initialized
            if (!comps.length) {
                comps.add(
                    `
                    <div class="carousel-page-counter">1 of 3</div>

                    <!-- Indicators -->
                    <ol class="carousel-indicators" data-type="${config.prefixName}-indicators">
                        <li data-target="#" data-slide-to="0" class="active" data-gjs-type="indicator"></li>
                        <li data-target="#" data-slide-to="1" data-gjs-type="indicator"></li>
                        <li data-target="#" data-slide-to="2" data-gjs-type="indicator"></li>
                    </ol>

                    <!-- Wrapper for slides -->
                    <div class="ch-carousel-inner" role="listbox" data-type="${config.prefixName}-slides">
                        <div class="item carousel-item active" data-gjs-type="slide">
                           
                        </div>
                        <div class="item carousel-item" data-gjs-type="slide">
                           
                        </div>
                        <div class="item carousel-item" data-gjs-type="slide">
                            
                        </div>
                    </div>
                    
                    <div class="captions-container">
                        <div class="ch-carousel-caption active" data-gjs-type="text">
                            Slide 1
                        </div>
                        <div class="ch-carousel-caption" data-gjs-type="text">
                            Slide 2
                        </div>
                        <div class="ch-carousel-caption" data-gjs-type="text">
                            Slide 3
                        </div>
                    </div>

                    <!-- Controls -->
                    <a class="${config.prefixName} left ch-carousel-control" href="#" role="button" data-slide="prev">
                        <svg width="12" height="21" viewBox="0 0 12 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.8281 20.7948C10.7344 20.8885 10.5938 20.9354 10.4531 20.9354C10.2656 20.9354 10.125 20.8885 10.0312 20.7948L0.234375 10.951C0.09375 10.8573 0.046875 10.7635 0.046875 10.576C0.046875 10.4354 0.09375 10.2948 0.234375 10.201L10.0312 0.3573C10.125 0.26355 10.2656 0.216675 10.4531 0.216675C10.5938 0.216675 10.7344 0.26355 10.8281 0.3573L11.7656 1.2948C11.8594 1.38855 11.9531 1.52917 11.9531 1.6698C11.9531 1.8573 11.8594 1.99792 11.7656 2.09167L3.28125 10.576L11.7656 19.0604C11.8594 19.201 11.9531 19.3417 11.9531 19.4823C11.9531 19.6698 11.8594 19.7635 11.7656 19.8573L10.8281 20.7948Z" fill="#6F6F6F"/>
                        </svg>
                    </a>
                    <a class="${config.prefixName} right ch-carousel-control" href="#" role="button" data-slide="next">
                        <svg width="12" height="21" viewBox="0 0 12 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.17188 0.3573C1.26562 0.26355 1.35938 0.216675 1.54688 0.216675C1.6875 0.216675 1.82812 0.26355 1.96875 0.3573L11.7656 10.201C11.8594 10.2948 11.9531 10.4354 11.9531 10.576C11.9531 10.7635 11.8594 10.8573 11.7656 10.951L1.96875 20.7948C1.82812 20.8885 1.6875 20.9354 1.54688 20.9354C1.35938 20.9354 1.26562 20.8885 1.17188 20.7948L0.234375 19.8573C0.09375 19.7635 0.046875 19.6698 0.046875 19.4823C0.046875 19.3417 0.09375 19.201 0.234375 19.0604L8.71875 10.576L0.234375 2.09167C0.09375 1.99792 0.046875 1.8573 0.046875 1.6698C0.046875 1.52917 0.09375 1.38855 0.234375 1.2948L1.17188 0.3573Z" fill="#6F6F6F"/>
                        </svg>
                    </a>
                    ${style}
                    `
                );
            }
        },

        /*handleGradient() {
            if (this.model.get('hasGradient')) {
                this.model.removeClass('no-gradient-control');
            } else {
                this.model.addClass('no-gradient-control');
            }
        },*/

        click(event) {
            const _class = event.target.getAttribute('class') ? event.target.getAttribute('class').split(' ') : [];

            if (_class.includes('carousel-indicators') || _class.includes('ch-carousel-control')) {
                event.preventDefault();
                event.stopPropagation();

                editor.select(this.model);
            }

            if (_class.includes('ch-carousel-control') && _class.includes('left')) {
                // Move left
                this.model.set('moveTo', 'prev');
            }

            if (_class.includes('ch-carousel-control') && _class.includes('right')) {
                // Move right
                this.model.set('moveTo', 'next');
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
