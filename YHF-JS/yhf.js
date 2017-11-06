(function(window,undefined) {

var $ = function(args) {
    return new Yin.prototype.init(args);
};

var Yin = function(){};

Yin.prototype = {
    constructor: $,

    init: function(args) {

        this.elements = [];
    
        if (typeof args == 'string') {
            //css模拟
            if (args.indexOf(' ') != -1) {
                var elements = args.split(' '); 
                var childElements = [];
                var node = []; 
                for (var i = 0; i < elements.length; i ++) {
                    if (node.length == 0) node.push(document);
                    switch (elements[i].charAt(0)) {
                        case '#' :
                            childElements = [];
                            childElements.push(this.getId(elements[i].substring(1)));
                            node = childElements;
                            break;
                        case '.' : 
                            childElements = [];
                            for (var j = 0; j < node.length; j ++) {
                                var temps = this.getClass(elements[i].substring(1), node[j]);
                                for (var k = 0; k < temps.length; k ++) {
                                    childElements.push(temps[k]);
                                }
                            }
                            node = childElements;
                            break;
                        default : 
                            childElements = [];
                            for (var j = 0; j < node.length; j ++) {
                                var temps = this.getTagName(elements[i], node[j]);
                                for (var k = 0; k < temps.length; k ++) {
                                    childElements.push(temps[k]);
                                }
                            }
                            node = childElements;
                    }
                }
                this.elements = childElements;
            } else {
                //find模拟
                switch (args.charAt(0)) {
                    case '#' :
                        this.elements.push(this.getId(args.substring(1)));
                        break;
                    case '.' : 
                        this.elements = this.getClass(args.substring(1));
                        break;
                    default : 
                        this.elements = this.getTagName(args);
                }
            }
        } else if (typeof args == 'object') {
            if (args != undefined) {
                this.elements[0] = args;
            }
        } else if (typeof args == 'function') {
            this.ready(args);
        }
    },

    ready:function (fn) {
        addDomLoaded(fn);
    },

    getId:function (id) {
        return document.getElementById(id);
    },

    getTagName:function (tag, parentNode) {
        var node = null;
        var temps = [];
        if (parentNode != undefined) {
            node = parentNode;
        } else {
            node = document;
        }
        var tags = node.getElementsByTagName(tag);
        for (var i = 0; i < tags.length; i ++) {
            temps.push(tags[i]);
        }
        return temps;
    },

    getClass:function (className, parentNode) {
        var node = null;
        var temps = [];

        if (parentNode != undefined) {
            node = parentNode;
        } else {
            node = document;
        }

        var all = node.getElementsByTagName('*');
        for (var i = 0; i < all.length; i ++) {
            if ((new RegExp('(\\s|^)' +className +'(\\s|$)')).test(all[i].className)) {
                temps.push(all[i]);
            }
        }

        return temps;
    },

    find:function (str) {
        var childElements = [];
        for (var i = 0; i < this.elements.length; i ++) {
            switch (str.charAt(0)) {
                case '#' :
                    childElements.push(this.getId(str.substring(1)));
                    break;
                case '.' : 
                    var temps = this.getClass(str.substring(1), this.elements[i]);
                    for (var j = 0; j < temps.length; j ++) {
                        childElements.push(temps[j]);
                    }
                    break;
                default : 
                    var temps = this.getTagName(str, this.elements[i]);
                    for (var j = 0; j < temps.length; j ++) {
                        childElements.push(temps[j]);
                    }
            }
        }
        this.elements = childElements;
        
        return this;
    },

    get:function (num) {   
        return this.elements[num];
    },

    first:function () {
        return this.elements[0];
    },

    last:function () {
        return this.elements[this.elements.length - 1];
    },

    length:function () {
        return this.elements.length;
    },

    attr:function (attr, value) {
        for (var i = 0; i < this.elements.length; i ++) {
            if (arguments.length == 1) {
                return this.elements[i].getAttribute(attr);
            } else if (arguments.length == 2) {
                this.elements[i].setAttribute(attr, value);
            }
        }
        return this;
    },

    index:function () {
        var children = this.elements[0].parentNode.children;
        for (var i = 0; i < children.length; i ++) {
            if (this.elements[0] == children[i]) return i;
        }
    },

    opacity:function (num) {
        for (var i = 0; i < this.elements.length; i ++) {
            this.elements[i].style.opacity = num / 100;
            this.elements[i].style.filter = 'alpha(opacity=' + num + ')';
        }
        return this;
    },

    eq:function (num) {
        var element = this.elements[num];
        this.elements = [];
        this.elements[0] = element;
        return this;
    },

    next:function () {
        for (var i = 0; i < this.elements.length; i ++) {
            this.elements[i] = this.elements[i].nextSibling;
            if (this.elements[i] == null) throw new Error('找不到下一个同级元素节点！');
            if (this.elements[i].nodeType == 3) this.next();
        }
        return this;
    },

    prev:function () {
        for (var i = 0; i < this.elements.length; i ++) {
            this.elements[i] = this.elements[i].previousSibling;
            if (this.elements[i] == null) throw new Error('找不到上一个同级元素节点！');
            if (this.elements[i].nodeType == 3) this.prev();
        }
        return this;
    },

    css:function (attr, value) {
        for (var i = 0; i < this.elements.length; i ++) {
            if (arguments.length == 1) {
                return getStyle(this.elements[i], attr);
            }
            this.elements[i].style[attr] = value;
        }

        return this;
    },

    addClass:function (className) {
        for (var i = 0; i < this.elements.length; i ++) {
            if (!hasClass(this.elements[i], className)) {
                // 加个空格，防止添加的多个class相连；
                // 这样就可以添加多个class了；
                this.elements[i].className += ' ' + className;
            }
        }

        return this;
    },

    removeClass:function (className) {
        for (var i = 0; i < this.elements.length; i ++) {
            if (hasClass(this.elements[i], className)) {
                this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ');
            }
        }

        return this;
    },

    html:function (str) {
        for (var i = 0; i < this.elements.length; i ++) {
            if (arguments.length == 0) {
                return this.elements[i].innerHTML;
            }
            this.elements[i].innerHTML = str;
        }

        return this;
    },

    text:function (str) {
        for (var i = 0; i < this.elements.length; i ++) {
            if (arguments.length == 0) {
                return getInnerText(this.elements[i]);
            }

            setInnerText(this.elements[i], text);
        }

        return this;
    },

    bind:function (event, fn) {
        for (var i = 0; i < this.elements.length; i ++) {
            addEvent(this.elements[i], event, fn);
        }
        return this;
    },

    hover:function (over, out) {
        for (var i = 0; i < this.elements.length; i ++) {
            addEvent(this.elements[i], 'mouseover', over);
            addEvent(this.elements[i], 'mouseout', out);
        }

        return this;
    },

    click:function (fn) {
        for (var i = 0; i < this.elements.length; i ++) {
            this.elements[i].onclick = fn;
        }
        return this;
    },

    hasClass:function(element, className) {
        return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    }

};

$.fn = Yin.prototype.init.prototype = Yin.prototype;

window.$ = $;

})(window,undefined);