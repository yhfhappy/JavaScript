
# JavaScript性能-DOM优化

标签： JavaScript

---

## 什么是DOM？

- 用于操作XML和HTML文档的应用程序
    - DOM节点
    - DOM树
    - DOM API
        - getElementById
        - childNodes
        - appendChild
        - innerHTML

## DOM与JavaScript

- 浏览器会把DOM与JS独立实现
    - 像两个独立的小岛
- js操作DOM
    - 从一个岛到另一个岛
- DOM的性能
    - 岛与岛之间的桥，每次通过收取“过桥费”
    - 尽量减少过桥的次数
- innerHTML与DOM方法对比

```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">

<script>

    window.onload = function (){
        var oDiv = document.getElementById('div1');
        //先声明并初始化一个空字符串变量；
        var str = '';

        /*
        //300ms左右；
        //交互次数太多，极大的降低了性能；
        console.time('hello');
        for(var i=0;i<5000;i++){
            oDiv.innerHTML += 'a';
        }
        console.timeEnd('hello');
        */


        //一毫秒都不到；
        //只进行了一次 DOM 交互，
        console.time('hello');
        //先在 ECMA 中做这5000次的添加操作，并把操作的结果赋值给变量；
        for(var i=0;i<5000;i++){
            str += 'a';
        }
        //将这5000次操作的结果一次性添加到 DOM 中，减少过桥次数；
        oDiv.innerHTML = str;
        console.timeEnd('hello');
    };

</script>

</head>
<body>
    <div id="div1"></div>
</body>
</html>
```

```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Document</title>
<script>

	window.onload = function (){
		var oUl = document.getElementById('ul1');
		var str = '';
	
		//在控制台打印出来的时间在 10ms 左右；
		console.time('hello');
		for(var i=0;i<5000;i++){
			var oLi = document.createElement('li');
			oUl.appendChild(oLi);
		}
		console.timeEnd('hello');


		//比上面的方法少个一两毫秒；
		//但在 Chrome 下性能反而不太好；
		console.time('hello');
		for(var i=0;i<5000;i++){
			str +='<li></li>';
		}

		oUl.innerHTML = str;
		console.timeEnd('hello');
	};

/*
总结：
	1.Chrome ：DOM方法要比 innerHTML 性能要好，所以要根据用户使用量来做选择；
*/

</script>
</head>
<body>
<ul id="ul1"></ul>	
</body>
</html>
```

## DOM优化

- 减少DOM操作
    - 节点克隆：cloneNode
    - 访问元素集合：尽量用局部变量
    - 元素节点：尽量用只获取元素的节点方法
    - 选择器API：利用querySelector、querySelectorAll

**cloneNode**

```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>减少DOM操作</title>
<script>

	window.onload = function (){
		var oUl = document.getElementById('ul1');
		var str = '';
	
		//在控制台打印出来的时间在 50ms 左右；
		console.time('hello');

		for(var i=0;i<5000;i++){
			var oLi = document.createElement('li');
			oLi.innerHTML = 'li';
			oUl.appendChild(oLi);
		}

		console.timeEnd('hello');


		//在控制台打印出来的时间在 5ms 左右；
		//比上面的方法快10倍；
		//复制节点比创建节点性能要好一些；
		console.time('hello');

		var oLi = document.createElement('li');
		oLi.innerHtml = 'li';
		for(var i=0;i<5000;i++){
			var newLi = oLi.cloneNode(true);
			oUl.appendChild(newLi);
		}

		console.timeEnd('hello');
	};

</script>
</head>
<body>
<ul id="ul1"></ul>	
</body>
</html>
```

**尽量使用局部变量**

```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>访问元素集合：尽量用局部变量</title>
<script>

window.onload = function (){
	var oUl = document.getElementById('ul1');
	var aLi = oUl.getElementsByTagName('li');

	for(var i=0;i<5000;i++){
		var aLi = document.createElement('li');

		oUl.appendChild(aLi);
	}

	
	console.time('hello');
	for(var i=0;i<aLi.length;i++){
		aLi[i].innerHTML = 'li';
	}
	console.timeEnd('hello');
	


	console.time('hello');
	//将 Li 的长度赋值给一个变量，那循环就只在 JS 一个岛上进行，性能就会高；
	//循环的时候，长度尽量用一个已经计算好的值，或者是常量；
	//原则：永远要想着“减少过桥次数”；
	var oLen = aLi.length;
	for(var i=0;i<oLen;i++){
		aLi[i].innerHTML = 'li';
	}
	console.timeEnd('hello');

	/*
	用局部变量，性能要好；
		例如：
		var doc = document;
		var oDiv = doc.getElementById();
		var oInput = doc.getElementById();
		var oUl = doc.getElementById();
	*/
};

</script>
</head>
<body>
<ul id="ul1"></ul>
</body>
</html>
```

## 尽量用只获取元素的节点方法

**例如：**

- childNodes => 可以获取到元素节点和文本节点
- children => 只会获取到元素节点
- firstChild => 元素节点 + 文本节点
- firstElementChild => 元素节点

**选择器API**
- querySelector;
- querySelectorAll('#ul1 li');

```
//第一种获取ul1下面所有li的方法；
var oUl = document.getElementById('ul1');
var aLi = oUl.getElementsByTagName('li');

//第二种获取ul1下面所有li的方法，仅仅一句话就成；
//注意：目前 IE8 以下的版本还是不支持，其它浏览器支持的很好，特别是移动端；
var aLi = document.querySelectorAll('#ul1 li');
```

## DOM与浏览器

- 重排：改变页面的内容
- 重绘：浏览器显示内容
- 添加顺序 
    - 尽量在appendChild前添加操作
- 合并 DOM 操作 
- 利用cssText
- 缓存布局信息
- 文档碎片 
    - createDocumentFragment()

**尽量在appendChild前添加操作**

```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Javascript性能-DOM优化</title>
<script>
    window.onload = function(){
        var oUl = document.getElementById('ul1');

        //appendChild 已经将内容添加到页面当中了，如果再添加，
        //就形成了重排重绘，必然对对页面造成很大影响，性能自然就不好；
        console.time('hello');
        for(var i=0; i<5000; i++){
            var oLi = document.createElement('li');
            oUl.appendChild(oLi);
            oLi.innerHTML = 'li';
        }
        console.timeEnd('hello');


        //这种写法，性能上要好很多；
        console.time('hello');
        for(var i=0; i<5000; i++){
            var oLi = document.createElement('li');
            oLi.innerHTML = 'li';
            oUl.appendChild(oLi);
        }
        console.timeEnd('hello');
    };
</script>
</head>
<body>
    <ul id="ul1"></ul>
</body>
</html>
```

**用cssText**

```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>用cssText</title>
<script>

    window.onload = function(){
        var oUl = document.getElementById('ul1');

        console.time('hello');
        for(var i=0; i<5000; i++){
            var oLi = document.createElement('li');
            oLi.style.width = '100px';
            oLi.style.height = '100px';
            oLi.style.background = 'red';
            oUl.appendChild(oLi);
        }
        console.timeEnd('hello');


        //cssText：可以进行多次样式添加；
        //一句话实现了多种操作，原本要多行代码才能实现；
        console.time('hello');
        for(var i=0; i<5000; i++){
            var oLi = document.createElement('li');
            oLi.style.cssText = 'width: 100px; height: 100px; background: red';
            oUl.appendChild(oLi);
        }
        console.timeEnd('hello');
    };

</script>
</head>
<body>
    <ul id="ul1"></ul>
</body>
</html>
```

**缓存布局信息**

```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>缓存布局信息</title>
<style>
    #div1 {width: 100px; height: 100px; background: red; position: absolute;top: 0;left: 0;}
</style>

<script>
    window.onload = function(){
        var oDiv = document.getElementById('div1');

        //通过变量缓存信息，提升性能；
        //一般情况下，相同的信息，尽量用变量缓存起来；
        var L = oDiv.offsetLeft;
        var T = oDiv.offsetTop;

        //每次 offsetLeft\offsetTop 都要重新获取一次，很影响性能；
        console.time('hello');
        setInterval(function(){
            oDiv.style.left = oDiv.offsetLeft + 1 + 'px';
            oDiv.style.top = oDiv.offsetTop + 1 + 'px';
        }, 30);
        console.timeEnd('hello');


        console.time('hello');
        setInterval(function(){
            L++;
            T++;

            oDiv.style.left = L + 'px';
            oDiv.style.top = T + 'px';
        }, 30);
        console.timeEnd('hello');
    };
</script>

</head>
<body>
    <div id="div1"></div>
</body>
</html>
```

**文档碎片**

```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>文档碎片</title>
<style>
    #div1 {width: 100px; height: 100px; background: red; position: absolute;top: 0;left: 0;}
</style>

<script>
    window.onload = function(){
        var oUl = document.getElementById('ul1');

        //先创建一个文档碎片，相当于一个袋子；
        var oFrag = document.createDocumentFragment();

        //相当于做了 5000 次的重排重绘过程；
        console.time('hello');
        for(var i=0; i<5000; i++){
            var oLi = document.createElement('li');
            oUl.appendChild(oLi);
        }
        console.timeEnd('hello');


        //将 oLi 先添加到 oFrag 这个袋子中，然后再一次性的添加给 oUl；
        console.time('hello');
        for(var i=0; i<5000; i++){
            var oLi = document.createElement('li');
            oFrag.appendChild(oLi);
        }
        oUl.appendChild(oFrag);
        console.timeEnd('hello');
    };
</script>

</head>
<body>
    <ul id="ul1"></ul>
</body>
</html>
```

## DOM与事件

- 事件委托

## DOM与前端模板

- 能更好的对逻辑和视图分离，MVC架构的基础;
- jQuery API：[api.jquery.com](http://api.jquery.com/) ；