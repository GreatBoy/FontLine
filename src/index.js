/*!
 * FontLine.js v1.0.0
 * (c) 2016 GreatBoy
 * Released under the MIT License.
 */
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.FontLine = factory());
}(this, function() {
    'use strict';

    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    function random() {
        if (Math.random() > 0.5) {
            return Math.random() * 1;
        } else {
            return -Math.random() * 1;
        }
    }

    function FontLine(options) {
        this.options = {
            id: '',
            width: 100,
            height: 100,
            str: 'LED NAME LENGT NSND',
            callback: function() {},
            fontSize: 40,
            tween: function(t,b,c,d,s){
                if (s == undefined) s = 1.70158; 
                if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
            },
            frame: 260
        }
        this.init(options);
    }

    FontLine.prototype.init = function(options) {
        Object.assign(this.options, options);
        this.initCanvas();
        this.initCtx();
        this.drawFont();
    }

    FontLine.prototype.initCanvas = function() {
        var options = this.options;
        this.canvas = document.getElementById(this.options.id);
        this.canvas.width = options.width * 2;
        this.canvas.height = options.height * 2;
        this.canvas.style.width = options.width + 'px';
        this.canvas.style.height = options.height + 'px';
    }

    FontLine.prototype.initCtx = function() {
        try {
            this.ctx = canvas.getContext('2d');
        } catch (e) {
            throw new Error('not support canvas');
        }
    }

    FontLine.prototype.getCenterPos = function(width, height, str) {
        var w = (width - str.length * this.options.fontSize) / 2;
        var h = (height - this.options.fontSize) / 2;
        return {
            x: w,
            y: h
        }
    }

    FontLine.prototype.initLine = function(width, height, str) {
        var functionLine = {};
        for (var i = 0; i < str.length; i++) {
            var pos = this.getCenterPos(width, height, str),
                startx = random() * width,
                starty = random() * height,
                endx = (pos.x + i * this.options.fontSize),
                endy = pos.y;
            functionLine[i] = {};
            functionLine[i]['k'] = (endy - starty) / (endx - startx);
            functionLine[i]['b'] = (starty * endx - startx * endy) / (endx - startx);
            functionLine[i]['scope'] = endx - startx;
            functionLine[i]['startx'] = startx;
            functionLine[i]['starty'] = starty;
            functionLine[i]['endx'] = endx;
            functionLine[i]['endy'] = endy;
            functionLine[i]['num'] = 0;
            functionLine[i]['fontsize'] = Math.random() * 100 + 40;
        }
        return functionLine;
    }

    FontLine.prototype.drawFont = function() {
        var self = this,
            canvas = this.canvas,
            width = canvas.width,
            height = canvas.height,
            str = this.options.str,
            ctx = this.ctx,
            functionLine = this.initLine(width, height, str),
            tween = this.options.tween,
            frame = this.options.frame,
            font = this.options.fontSize;

        function draw(name, x, y, fontSize, color) {
            var c = color || '#005d6c';
            // 设置字体
            ctx.font = '' + fontSize + 'px Arial';
            // 设置对齐方式
            ctx.textAlign = "center";
            // 设置填充颜色
            ctx.fillStyle = c;
            // 设置字体内容，以及在画布上的位置
            ctx.fillText(name, x, y);
        }

        function eachDraw(n) {
            ctx.clearRect(0, 0, width, height);
            for (var i = 0; i < str.length; i++) {
                var p = i;
                if (n < frame) {
                    var scape = functionLine[p]['scope'],
                        x = tween(n, functionLine[p]['startx'], functionLine[p]['endx'] - functionLine[p]['startx'], frame),
                        y = functionLine[p]['k'] * x + functionLine[p]['b'],
                        fontSize = functionLine[p]['fontsize'] - ((functionLine[p]['fontsize'] - font) / frame) * n;
                    draw(str[p], x, y, fontSize);
                } else {
                    draw(str[p], functionLine[p]['endx'], functionLine[p]['endy'], font);
                }
            }
        }

        //动画
        var currentFrame = 0;
        var timer = function() {
            if (currentFrame <= frame) {
                eachDraw(currentFrame);
                requestAnimFrame(timer);
            } else {
                setTimeout(function() {
                    self.options.callback();
                }, 500);
            }
            currentFrame++;
        };
        timer();
    }
    return FontLine;

}));
