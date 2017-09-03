//声明并初始化有个数组变量 board ，这个变量用于存放游戏数据；
//此时的 board 是一个一维数组；
var board = new Array();

// 声明并初始化一个为变量 score，初始化为零；
var score = 0;
/****** 以上两个变量用于控制游戏的数据 ******/

// 声明一个变量，这个变量也是一个二维数组，对应每一个小格子；
// 用来记录每一个小格子是否已经发生过了碰撞；
var hasConflicted = new Array();

// 为屏幕触控声明并初始化变量；
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

// 主函数：游戏开始时要做的事情（也就是点击开始按钮时要做的事情）；
$(document).ready(function(){
    //再移动端游戏进行前要进行的一些准备工作；
    prepareForMobile();
    newgame();
});

function prepareForMobile(){

    // 如果设备宽度（即可使用宽度）大于 500 的话，就设置一个固定值；
    if( documentWidth > 500 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    // 对大方框这个容器进行调整；
    $('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    // 对小方块进行调整；
    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
};

// 初始化函数：游戏开始时要做的事情（也就是点击开始按钮时要做的事情）；
function newgame(){
    //初始化棋盘格
    init();

    //在随机两个格子生成数字(要生成两个数字);
    generateOneNumber();
    generateOneNumber();
};

function init(){

    //用一个嵌套的 for 循环求出每个单元格的位置；
    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 0 ; j < 4 ; j ++ ){

            //声明并初始化一个变量，用来表示每个单元格；
            var gridCell = $('#grid-cell-'+i+"-"+j);

            //每个单元格所在的位置；
            gridCell.css('top', getPosTop( i , j ) );
            gridCell.css('left', getPosLeft( i , j ) );
        }
    }

    for( var i = 0 ; i < 4 ; i ++ ){
        //此时的 board 就是一个二维数组了；
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for( var j = 0 ; j < 4 ; j ++ ){
            board[i][j] = -1;

            // 将它组成一个二维数组，并将它初始化，表示每一个位置都还没有进行过碰撞；
            hasConflicted[i][j] = false;
        }
    }

    //初始化完毕之后调用 updateBoardView 函数以通知前端，需要对 NumberCell 里面的元素进行显示上的设定；
    updateBoardView();

    score = 0;
};

//updateBoardView 函数的作用：根据 board 这个变量的值，对前端的 NumberCell 里面的元素进行操作；
function updateBoardView(){

    //如果当前的游戏里已经有了 .number-cell 元素，那么就要把这些元素全都删除掉；
    //之后根据当前 board 的值来添加新的 .number-cell 元素；
    $(".number-cell").remove();

    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 0 ; j < 4 ; j ++ ){
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if( board[i][j] == -1 ){
                //此时的 NumberCell 还不显示，故宽和高设为零；
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                //将 NumberCell 放在 grid-cell 的中心；
                theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2 );
                theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2 );
            } else{
                //此时的 NumberCell 的位置和 grid-cell 的一样；
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
                theNumberCell.css('color',getNumberColor( board[i][j] ) );
                theNumberCell.text( board[i][j] );
            }

            // 新一轮开始，所以要初始化；
            hasConflicted[i][j] = false;
        }
    }

    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');
};

function generateOneNumber(){
    // nospace( board )的执行结果如果为 True，表示已经没有空间再生成数字了；
    if( nospace( board ) ){
        return false;
    }

    //随机一个位置
    var randx = parseInt( Math.floor( Math.random()  * 4 ) );
    var randy = parseInt( Math.floor( Math.random()  * 4 ) );

    // 如果只剩下了一个空格了，计算机要花很长时间才能生成这个位置，这样程序的性能就会很差；
    // 所以设置了让计算机只循环50次；
    var times = 0;
    while( times < 50 ){
        if( board[randx][randy] ==-1 )
            break;

        randx = parseInt( Math.floor( Math.random()  * 4 ) );
        randy = parseInt( Math.floor( Math.random()  * 4 ) );

        times ++;
    }
    
    // 如果超过了50次循环，那我们就人为的把这个位置的数字生成出来；
    if( times == 50 ){
        for( var i = 0 ; i < 4 ; i ++ )
            for( var j = 0 ; j < 4 ; j ++ ){
                if( board[i][j] == -1 ){
                    randx = i;
                    randy = j;
                }
            }
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 0 : 1;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation( randx , randy , randNumber );

    return true;
};

// JavaScipr采用的是事件响应机制；
$(document).keydown( function( event ){
    // 阻止 keydown 发生时的默认事件：会把所有的按键行为等全部阻止掉；；
    event.preventDefault();
    switch( event.keyCode ){
        case 37: //left
            //event.preventDefault();
            if( moveLeft() ){
                //如果不加定时器，那moveleft这个动画还没结束就执行下面的操作了；
                setTimeout("generateOneNumber()",210);

                // 判断游戏是否结束；
                setTimeout("isgameover()",300);
            }
            break;

        case 38: //up
            //event.preventDefault();
            if( moveUp() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;

        case 39: //right
            //event.preventDefault();
            if( moveRight() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;

        case 40: //down
            //event.preventDefault();
            if( moveDown() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;

        default: //default
            break;
    }
});

// 为 touchstart 添加一个事件监听器；
document.addEventListener('touchstart',function(event){
    startx = event.touches[0].pageX;    //event.touches：是一个数组；
    starty = event.touches[0].pageY;
});

// 为 touchend 添加一个事件监听器；
document.addEventListener('touchend',function(event){
    endx = event.changedTouches[0].pageX;   //event.changedTouches：是一个数组；
    endy = event.changedTouches[0].pageY;

    // 判断是否是在 X，Y 轴方向滑动（包括点击行为）；
    var deltax = endx - startx;
    var deltay = endy - starty;

    // 防止点击操作也发上滑动；
    // 表示：如果在某个方向的滑动（即类似点击操作）的范围小于某个值，直接把这个函数返回出去；
    if( Math.abs( deltax ) < 0.1*documentWidth && Math.abs( deltay ) < 0.1*documentWidth ){
        return;
    }

    if( Math.abs( deltax ) >= Math.abs( deltay ) ){

        if( deltax > 0 ){
            //move right
            if( moveRight() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        } else{
            //move left
            if( moveLeft() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    } else{
        if( deltay > 0 ){
            //move down
            if( moveDown() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
        else{
            //move up
            if( moveUp() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
});

// 判断游戏是否结束；
//  1.整个棋盘格已经没有空间了；
//  2.整个游戏已经不能进行任何移动操作了；
function isgameover(){
    if( nospace( board ) && nomove( board ) ){
        gameover();
    }
};

// 游戏结束；
function gameover(){
    alert('Game Over!');
};

// 向左移动；
function moveLeft(){

    // 判断是否可以向左移动，如果不可以，返回 false 停止事件；
    if( !canMoveLeft( board ) ){
        return false;
    }

    //moveLeft
    //  对每个数字的左侧位置进行判断，看是否可能为落脚点？
    //      1.落脚位置是否为空？
    //      2.落脚位置的数字与待定元素的数字是否相等？
    //      3.移动的路径中是否有障碍物？
    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 1 ; j < 4 ; j ++ ){
            if( board[i][j] != -1 ){

                for( var k = 0 ; k < j ; k ++ ){
                    if( board[i][k] == -1 && noBlockHorizontal( i , k , j , board ) ){
                        //move
                        showMoveAnimation( i , j , i , k ); //从(i,j)这个位置移动到(i,k)这个位置；
                        board[i][k] = board[i][j];
                        board[i][j] = -1;
                        continue;
                    } else{
                        
                        if( board[i][k] ==0&& board[i][j]==0 && noBlockHorizontal( i , k , j , board ) && !hasConflicted[i][k] ){
                            //move
                            showMoveAnimation( i , j , i , k );
                            //add
                            board[i][k] = board[i][j]=-1;
                            hasConflicted[i][k] = true;
                            continue;
                        }

                        if( board[i][k] ==board[i][j] && noBlockHorizontal( i , k , j , board ) && !hasConflicted[i][k] ){
                            //move
                            showMoveAnimation( i , j , i , k );
                            //add
                            board[i][k] += board[i][j];
                            board[i][j] = -1;
                            //add score
                            score += board[i][k];
                            updateScore( score );

                            hasConflicted[i][k] = true;}
                        continue;
                    }
                }
            }
        }
    }

    //虽然 showMoveAnimation 这个动画是200毫秒，但是整个 for 循环可能几毫秒就结束了，所以我们几乎看不出效果；
    //因此，给 updateBoardView 这个函数延迟 200 毫秒在执行，等动画执行完，这样才能很好的看到效果；
    setTimeout("updateBoardView()",200);

    //整个 moveLeft 函数返回真，才能继续之后的操作，事件才能继续进行；
    return true;
};

function moveRight(){
    if( !canMoveRight( board ) )
        return false;

    //moveRight
    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 2 ; j >= 0 ; j -- ){
            if( board[i][j] != -1 ){
                for( var k = 3 ; k > j ; k -- ){

                    if( board[i][k] == -1 && noBlockHorizontal( i , j , k , board ) ){
                        //move
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = -1;
                        continue;
                    }
                    else{
                        if( board[i][k] ==0&& board[i][j]==0 && noBlockHorizontal( i , j , k , board ) && !hasConflicted[i][k] ){
                            //move
                            showMoveAnimation( i , j , i , k);
                            //add
                            board[i][k] = board[i][j]=-1;
                            hasConflicted[i][k] = true;
                            continue;
                        }
                        if( board[i][k] == board[i][j] && noBlockHorizontal( i , j , k , board ) && !hasConflicted[i][k] ){
                            //move
                            showMoveAnimation( i , j , i , k);
                            //add
                            board[i][k] += board[i][j];
                            board[i][j] = -1;
                            //add score
                            score += board[i][k];
                            updateScore( score );

                            hasConflicted[i][k] = true;
                            continue;
                        }
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
};

function moveUp(){

    if( !canMoveUp( board ) )
        return false;

    //moveUp
    for( var j = 0 ; j < 4 ; j ++ ){
        for( var i = 1 ; i < 4 ; i ++ ){
            if( board[i][j] != -1 ){
                for( var k = 0 ; k < i ; k ++ ){

                    if( board[k][j] == -1 && noBlockVertical( j , k , i , board ) ){
                        //move
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = -1;
                        continue;
                    } else{

                        if( board[k][j] ==0&& board[i][j]==0 && noBlockVertical( j , k , i , board ) && !hasConflicted[k][j] ){
                            //move
                            showMoveAnimation( i , j , k , j );
                            //add
                            board[k][j]= board[i][j]=-1;
                            hasConflicted[k][j] = true;
                            continue;
                        }

                        if( board[k][j] == board[i][j] && noBlockVertical( j , k , i , board ) && !hasConflicted[k][j] ){
                            //move
                            showMoveAnimation( i , j , k , j );
                            //add
                            board[k][j] += board[i][j];
                            board[i][j] = -1;
                            //add score
                            score += board[k][j];
                            updateScore( score );

                            hasConflicted[k][j] = true;
                            continue;
                        }
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
};

function moveDown(event){
    if( !canMoveDown( board ) )
        return false;

    //moveDown
    for( var j = 0 ; j < 4 ; j ++ ){
        for( var i = 2 ; i >= 0 ; i -- ){
            if( board[i][j] != -1 ){
                for( var k = 3 ; k > i ; k -- ){

                    if( board[k][j] == -1 && noBlockVertical( j , i , k , board ) ){
                        //move
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = -1;
                        continue;
                    } else {

                        if( board[k][j] ==0&& board[i][j]==0 && noBlockVertical( j , i , k , board ) && !hasConflicted[k][j] ) {
                            //move
                            showMoveAnimation(i, j, k, j);
                            //add
                            board[k][j] = board[i][j]=-1;
                            hasConflicted[k][j] = true;
                            continue;
                        }

                        if( board[k][j] == board[i][j] && noBlockVertical( j , i , k , board ) && !hasConflicted[k][j] ) {
                            //move
                            showMoveAnimation(i, j, k, j);
                            //add
                            board[k][j] += board[i][j];
                            board[i][j] = -1;
                            //add score
                            score += board[k][j];
                            updateScore(score);

                            hasConflicted[k][j] = true;
                            continue;
                        }

                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
};