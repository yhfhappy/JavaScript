// 自适应设置：要通过百分比设置，那就要先找到一个参照物；
documentWidth = window.screen.availWidth;   //参照物：当前设备中可以使用的设备宽度；
gridContainerWidth = 0.92 * documentWidth;
cellSideLength = 0.18 * documentWidth;
cellSpace = 0.04*documentWidth;

function getPosTop( i , j ){
    return cellSpace + i*( cellSpace + cellSideLength );
};

function getPosLeft( i , j ){
    return cellSpace + j*( cellSpace + cellSideLength );
};

// board的背景色：根据传入的数字的不同，返回不同颜色的值；
function getNumberBackgroundColor( number ){
    switch( number ){
        case 0   :return "#eee4da"; break;
        case 1   :return "#ede0c8"; break;
        case 2   :return "#f2b179"; break;
        case 4   :return "#f59563"; break;
        case 8   :return "#f67c5f"; break;
        case 16  :return "#f65e3b"; break;
        case 32  :return "#edcf72"; break;
        case 64  :return "#edcc61"; break;
        case 128 :return "#9c0";    break;
        case 256 :return "#33b5e5"; break;
        case 512 :return "#09c";    break;
        case 1024:return "#a6c";    break;
        case 2048:return "#93c";    break;
    }

    return "black";
};

// 数字的颜色：当数字小于等于 1 的时候返回黑色，否则返回白色；
function getNumberColor( number ){
    if( number <= 1 )
        return "#776e65";

    return "white";
};

// 判断是否有空间添加新元素；
function nospace( board ){
    // 对当前board元素进行二重循环，判断当前board里面有没有为零的元素；
    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 0 ; j < 4 ; j ++ ){
            if( board[i][j] == -1 ){
                return false;
            }
        }
    }

    return true;
};

// 判断是否可以向左移动；
//  1.左边是否没有数字（有空间）；
//  2.左边有数字，且两个数字相等；
function canMoveLeft( board ){

    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 1; j < 4 ; j ++ ){
            if( board[i][j] != -1 ){
                if( board[i][j-1] == -1 || board[i][j-1] == board[i][j] ){
                    return true;
                }
            }
        }
    }

    return false;
};

function canMoveRight( board ){

    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2; j >= 0 ; j -- )
            if( board[i][j] != -1 )
                if( board[i][j+1] == -1 || board[i][j+1] == board[i][j] )
                    return true;

    return false;
};

function canMoveUp( board ){

    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ )
            if( board[i][j] != -1 )
                if( board[i-1][j] == -1 || board[i-1][j] == board[i][j] )
                    return true;

    return false;
};

function canMoveDown( board ){

    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- )
            if( board[i][j] != -1 )
                if( board[i+1][j] == -1 || board[i+1][j] == board[i][j] )
                    return true;

    return false;
};

function noBlockHorizontal( row , col1 , col2 , board ){
    for( var i = col1 + 1 ; i < col2 ; i ++ ){
        if( board[row][i] != -1 ){
            return false;
        }
    }
    
    return true;
};

function noBlockVertical( col , row1 , row2 , board ){
    for( var i = row1 + 1 ; i < row2 ; i ++ )
        if( board[i][col] != -1 )
            return false;
    return true;
};

// 判断整个棋盘格是否还可以移动；
function nomove( board ){
    if( canMoveLeft( board ) ||
        canMoveRight( board ) ||
        canMoveUp( board ) ||
        canMoveDown( board ) ){
        return false;
    }

    return true;
};