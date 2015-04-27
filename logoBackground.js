;(function($) {

    var pluginName = 'logoBackground',
        defaults = {
            borderSize : 5,
            variance   : .2,
        };

    var _ = {
        max: function(obj, iteratee) {
            var current, max = -Infinity, index = -1;

            for(var i in obj) {
                current = iteratee(obj[i]);

                if(current > max) {
                    index = i;
                    max = current;
                }
            }

            return obj[index];
        },

        groupBy: function(obj, iteratee) {
            var index, groups = {};

            for(var i in obj) {
                index = iteratee(obj[i]);
                groups[index] = groups[index] || [];
                groups[index].push(obj[i]);
            }

            return groups;
        },

        reduce: function(obj, iteratee, memo) {
            for(var i in obj)
                memo = iteratee(memo, obj[i]);

            return memo;
        }
    };

    function LogoBackgroundPlugin( element, options ) {
        this.element = element;
        this.options = $.extend({}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    LogoBackgroundPlugin.prototype = {
        init: function() {
            this.getImage(this.element, this.options);
        },

        getImage: function(el, options) {
            var $el = $(el);

            $('<img>', { src: $el.data('src') })
            .bind('load error', function(event) {
                if(event.type=='error') return;

                setLogoBackgroundImage();
                setLogoBackgroundColor(this);
            });

            function setLogoBackgroundImage() {
                $el.css('background-image', 'url('+$el.data('src')+')');
            }

            function setLogoBackgroundColor(img) {
                var $canvas = $('<canvas>')
                    .attr('width', img.width)
                    .attr('height', img.height)
                    .appendTo($el);

                var context = $canvas[0].getContext('2d');
                context.drawImage(img, 0, 0 );

                var borderPixels = [];
                var imageData = context.getImageData(0, 0, img.width, img.height);

                for(var x=0; x<imageData.width; x++)
                    for(var y=0; y<imageData.height; y++)
                        if(isBorderPosition(x, y)) {
                            var index = (y * imageData.width + x) * 4;

                            borderPixels.push({
                                r: imageData.data[index],
                                g: imageData.data[index + 1],
                                b: imageData.data[index + 2],
                                a: imageData.data[index + 3]
                            });
                        }

                var groups = groupColors(borderPixels);
                var mostRepited = _.max(groups, function(group) { return group.length; });
                var bgc = colorMedia(mostRepited);
                $el.css('background-color', 'rgba('+bgc.r+', '+bgc.g+', '+bgc.b+', '+bgc.a+')');

                $canvas.remove();

                function isBorderPosition(x, y) {
                    var isBorder = x < options.borderSize;
                    isBorder = isBorder || y < options.borderSize;
                    isBorder = isBorder || x > imageData.width - options.borderSize;
                    isBorder = isBorder || y > imageData.height - options.borderSize;

                    return isBorder;
                }
            }

            function groupColors(colors) {
                var variance = options.variance * 100;

                return _.groupBy(colors, function(pixel) {
                    var r = Math.round( ( normalize(pixel.r) * 100 ) / variance ) * variance;
                    var g = Math.round( ( normalize(pixel.g) * 100 ) / variance ) * variance;
                    var b = Math.round( ( normalize(pixel.b) * 100 ) / variance ) * variance;
                    var a = Math.round( ( normalize(pixel.a) * 100 ) / variance ) * variance;

                    return 'r'+r+'g'+g+'b'+b+'a'+a;
                });

                function normalize(color) {
                    return color / 255;
                }
            }

            function colorMedia(colors) {
                var reduce = _.reduce(colors, function(memo, color) {
                    return {
                        r: memo.r + color.r,
                        g: memo.g + color.g,
                        b: memo.b + color.b,
                        a: memo.a + color.a
                    };
                }, { r: 0, g: 0, b: 0, a: 0 });

                return {
                    r: Math.round(reduce.r / colors.length),
                    g: Math.round(reduce.g / colors.length),
                    b: Math.round(reduce.b / colors.length),
                    a: Math.round(reduce.a / colors.length)
                };
            }
        },
    };

    $.fn[pluginName] = function(options) {
        return this.each(function () {
            $.data(this, 'plugin_' + pluginName) || $.data(
                this, 'plugin_' + pluginName,
                new LogoBackgroundPlugin(this, options)
            );
        });
    };

})(jQuery);
