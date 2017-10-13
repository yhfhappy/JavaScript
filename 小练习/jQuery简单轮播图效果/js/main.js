// 定义一个全局变量，默认为0；
var index = 0;
var timer = null;

$(function(){
    //自动轮播
    timer = setInterval(autoFn,2000);

    //鼠标移入停止播放
    $('#slideWrap').on('mouseover',function(){
        clearInterval(timer);
    });

    //鼠标移出开始播放
    $('#slideWrap').on('mouseout',function(){
        timer = setInterval(autoFn,2000);
    });

    //轮播自动执行函数；
    function autoFn(){
        changePic();
        index ++;

        if(index == pics.length){
            index = 0;
        }
    };

    //元素获取
    //找到所有图片
    var pics = $(".imgWrap li");

    //找到所有小圆点；
    var lis = $(".indicator li");

    //找到上下点击按钮；
    var arrows = $(".arrow span");

    //事件函数：点击要执行的函数；
    function changePic(){
        //控制li的class可以实现换图
        pics.eq(index)
            .animate({'opacity':'show'})
            .addClass('current')
            .siblings()
            .animate({'opacity':'hide'})
            .removeClass('current');

        //控制li的class可以实现小圆点切换
        lis.eq(index)
            .addClass('current')
            .siblings()
            .removeClass('current');
    };

    //点击换图（小圆点或箭头等）
    lis.on('click',function(){
        //改变index的值
        index = $(this).index();

        //调用事件处理函数
        changePic();
    });

    //左右按钮点击切换
    arrows.on('click',function(){
        //改变index的值
        arrowIndex = $(this).index();

        if(arrowIndex == 0){
            index --;

            if(index == -1){
                index = pics.length-1;
            }
        } else if(arrowIndex == 1){
            index ++;

            if(index == pics.length){
                index = 0;
            }
        }

        //调用事件处理函数
        changePic();
    });
});