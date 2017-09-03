function showNumberWithAnimation( i , j , randNumber ){

    var numberCell = $('#number-cell-' + i + "-" + j );

    numberCell.css('background-color',getNumberBackgroundColor( randNumber ) );
    numberCell.css('color',getNumberColor( randNumber ) );
    numberCell.text( randNumber );

    numberCell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top:getPosTop( i , j ),
        left:getPosLeft( i , j )
    },50);
};

// 数字移动动画；
function showMoveAnimation( fromx , fromy , tox, toy ){
    // 获取要移动的那个数字的DIV；
    var numberCell = $('#number-cell-' + fromx + '-' + fromy );

    numberCell.animate({
        top:getPosTop( tox , toy ),
        left:getPosLeft( tox , toy )
    },200);
};

//得分统计；
function updateScore( score ){
    $('#score').text( score );
};