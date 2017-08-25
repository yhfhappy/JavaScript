# JavaScript：正则表达式

标签： JavaScript

---

## 找出字符串中的所有数字
- 用传统字符串操作完成

```
<script>
    var str='12 fff 87 er334 233 -=-=fa80';
    var arr=[];
    var tmp='';
    
    for(var i=0;i<str.length;i++){
    	if(str.charAt(i)>='0' && str.charAt(i)<='9'){
    		tmp+=str.charAt(i);
    	}else{
    		if(tmp){
    			arr.push(tmp);
    			tmp='';
    		}
    	}
    }
    
    if(tmp){
    	arr.push(tmp);
    	tmp='';
    }
    
    alert(arr);
</script>
```

- 用正则表达式完成
```
<script>
    var str='12 fff 87 er334 233 -=-=fa80';

    alert(str.match(/\d+/g));
</script>
```

## 什么是正则表达式？

### 什么叫“正则”？
1. 定义：规则、模式；
2. 作用：强大的字符串匹配工具；
3. 火星文：是一种正常人类很难读懂的文字；
4. 台湾：规则表达式；

### RegExp对象
1. JS风格：new RegExp(“a”, “i”)
2. perl风格：/a/i
```
<script>
    var reg=new RegExp('b', 'i');
    var str='abcdef';

    alert(str.search(reg));
</script>
```

```
<script>
    var str='adsf 03 23 vcxzxcv';
    var re=/\d/;

    alert(str.search(re));
</script>
```

### 字符串搜索
1. 语法：str.search();
2. 返回出现的位置
3. 忽略大小写：i——ignore
4. 判断浏览器类型

### 获取匹配的项目
1. 语法：match
2. 量词：+
3. 量词变化：\d、\d\d和\d+
4. 全局匹配：g——global
5. 例子：找出所有数字

```
<script>
    var str='12 fff 87 er334 233 -=-=fa80';

    alert(str.match(/\d+/g));
</script>
```

### 字符串与正则配合
1. 语法：str.replace();
2. 替换所有匹配；
3. 返回替换后的字符串；
4. 例子：敏感词过滤；

```
<script>
	window.onload=function (){
		var oTxt1=document.getElementById('txt1');
		var oTxt2=document.getElementById('txt2');
		var oBtn=document.getElementById('btn1');
		
		oBtn.onclick=function (){
			var re=/北京|百度|淘宝/g;
			
			oTxt2.value=oTxt1.value.replace(re, '***');
		};
	};
</script>
```

### 字符串
1. 任意字符：[abc]
    - 例子：o[usb]t——obt、ost、out
2. 范围：[a-z]、[0-9]
    - 例子：id[0-9]——id0、id5
3. 排除：[^a]
    - 例子：o[^0-9]t——oat、o?t、o t
4. 组合：[a-z0-9A-Z]
    - 实例：偷小说
    - 过滤HTML标签：自定义innerText方法
5. 转义字符
    - .（点）——任意字符
    - \d、\w、\s
    - \D、\W、\S （除了）

> \d：表示数字[0-9]
\w：英文、数字、下划线[a-z0-9_]
\s：空白字符

```
<script>
	window.onload=function (){
		var oTxt1=document.getElementById('txt1');
		var oTxt2=document.getElementById('txt2');
		var oBtn=document.getElementById('btn1');
		
		oBtn.onclick=function (){
			var re=/<[^<>]+>/g;
			
			oTxt2.value=oTxt1.value.replace(re, '');
		};
	};
</script>
```

## 量词

1. 什么是量词？
2. 出现的次数：{n,m}，至少出现n次，最多m次；
3. 例子：查找QQ号

### 常用量词

> 
{n,} 至少n次，最多不限
*	 任意次：{0,}
？	 零次或一次：{0,1}
+	 一次或任意次：{1,}
{n}	 正好n次

## 常用正则例子

### 表单校验实例
- 校验邮箱
    - 行首行尾
    - Reg.test(str);
    - 检验字符串是否符合正则要求；
    - 返回布尔值；
    - 只要一部分符合要求就返回true；
    - ^$：以什么开始什么结束；

```
<script>
	window.onload=function (){
		var oTxt=document.getElementById('txt1');
		var oBtn=document.getElementById('btn1');
		
		oBtn.onclick=function (){
			var re=/^\w+@[a-z0-9]+\.[a-z]+$/i;
			
			if(re.test(oTxt.value)){
				alert('合法的邮箱');
			}else{
				alert('你丫写错了');
			}
		};
	};
</script>
```


## 拓展
### 四种常见字符串操作
1. 查找：str.search('a');
    - 结果：正常找到返回位置；
    - 没找到返回-1；
2. 获取子字符串：str.substring();
    - 语法：str.substring(起点, 终点)；
    - 注意：不包括结束位置；
    - 如果只有一个参数，则取起点后面的所有；
3. 获取某个字符：str.charAt(一个位置);
    - 语法：str.charAt(一个位置);
    - 结果：找到并返回相应的字符；
4. 分割字符串，获得数组：str.split();
    - 语法：str.split('以什么分');
    - 用途：用来做字符串切分；