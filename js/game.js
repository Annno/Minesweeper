$(document).ready(function() {
    document.oncontextmenu = function() {
        return false;
    };
    $('.modal').modal();

    function Board(size) {
        this.size = size;
        this.boardSize = 0;
        this.boardV = [];
        this.bombs = [];
        this.checked = [];
        this.createBoardSize = function() {
            this.boardSize = size * 40 + (size * 2 - 2);
        }
        this.createBoard = function() {
            for (var i = 0; i < size; i++) {
                this.boardV.push([]);
                for (var j = 0; j < size; j++) {
                    this.boardV[i].push(0);
                }
            }
        }

        this.renderBoard = function() {
            var sizeW = this.boardSize.toString();
            $('.gameContainer').css({ "width": sizeW + "px", "height": sizeW + "px" });
            for (var i = 0; i < size; i++) {

                // $()
                for (var j = 0; j < size; j++) {
                    if (this.boardV[i][j] == 0 || this.boardV[i][j] == 'bomb') $('.gameContainer').append("<div class='square z-depth-3 line" + i + "' id='item" + i + "s" + j + "'>" + "<span class='contentB'>" + "&nbsp" + "</span" + "</div>");
                    else $('.gameContainer').append("<div class='square z-depth-3 line" + i + "' id='item" + i + "s" + j + "'>" + "<span class='contentB'>" + this.boardV[i][j] + "</span" + "</div>");
                    // this.boardV[i].push("&nbsp");
                    if (this.boardV[i][j] == 1) $('#item' + i + 's' + j).css({ "color": "#2ecc71" });
                    else if (this.boardV[i][j] == 2) $('#item' + i + 's' + j).css({ "color": "#f39c12" });
                    else if (this.boardV[i][j] == 3) $('#item' + i + 's' + j).css({ "color": "#e67e22" });
                    else $('#item' + i + 's' + j).css({ "color": "#c0392b" });

                    if (this.boardV[i][j] == 'bomb') $('#item' + i + 's' + j).html("<span class='contentB'><img src='mine.png' class='bomb'></span>");
                }
                $('.line' + i + ':last-child').css({ "margin-right": "0px" });

            }
        }

        this.generateBombs = function() {
            for (var i = 0; i < size; i++) {
                var line = Math.floor((Math.random() * size));
                var col = Math.floor((Math.random() * size));
                this.bombs[i] = [line, col];

                while ($.inArray(this.bombs[i], this.bombs) == -1) {
                    line = Math.floor((Math.random() * 10) + 1);
                    col = Math.floor((Math.random() * 10) + 1)
                };
                this.bombs[i] = [line, col];

                this.boardV[line][col] = "bomb";
            }
        }

        this.generateNumbers = function() {
            for (var i = 0; i < this.bombs.length; i++) {
                var line = this.bombs[i][0];
                var col = this.bombs[i][1];
                if (!(line - 1 < 0 || col - 1 < 0 || this.boardV[line - 1][col - 1] == "bomb")) this.boardV[line - 1][col - 1] += 1;
                if (!(line - 1 < 0 || this.boardV[line - 1][col] == "bomb")) this.boardV[line - 1][col] += 1;
                if (!(line - 1 < 0 || col + 1 >= size || this.boardV[line - 1][col + 1] == "bomb")) this.boardV[line - 1][col + 1] += 1;
                if (!(col - 1 < 0 || this.boardV[line][col - 1] == "bomb")) this.boardV[line][col - 1] += 1;
                if (!(col + 1 >= size || this.boardV[line][col + 1] == "bomb")) this.boardV[line][col + 1] += 1;
                if (!(line + 1 >= size || col - 1 < 0 || this.boardV[line + 1][col - 1] == "bomb")) this.boardV[line + 1][col - 1] += 1;
                if (!(line + 1 >= size || this.boardV[line + 1][col] == "bomb")) this.boardV[line + 1][col] += 1;
                if (!(line + 1 >= size || col + 1 >= size || this.boardV[line + 1][col + 1] == "bomb")) this.boardV[line + 1][col + 1] += 1;
            }
        }

        this.clearNull = function(itemID) {

            checkNull(this.boardV, this.size, itemID);
        }
    };

    function checkWin(bombs, checked) {
        var flag = 0;
        console.log(checked);
        for (var i = 0; i < bombs.length; i++) {
            for (var j = 0; j < checked.length; j++) {
                // console.log(JSON.stringify(checked[j]));
                //console.log(JSON.stringify(bombs[i]));
                if (JSON.stringify(checked[j]) == JSON.stringify(bombs[i])) {
                    flag++;
                    //console.log(flag);
                    break;
                }
            }
        }
        //console.log(flag);
        if (flag == bombs.length - 1) {
            $('#modal1').modal('open');
            $('.modal-content').append("<h4>You won in <span class='timer'></span></h4>   <h5> Wanna go again? </h5>");
            $('.timer').html(counter + ' seconds');
        }
    }

    function checkNull(boardCopy, sizeCopy, lineAndCol) {
        var flag = 0;
        console.log(lineAndCol);
        var i = lineAndCol[0];
        var j = lineAndCol[1];

        $('#item' + i + 's' + j).find('span').removeClass('contentB');
        $('#item' + i + 's' + j).css({ 'background-color': '#ecf0f1' });
        boardCopy[i][j] = 'next';
        if (i + 1 < sizeCopy)
            if (boardCopy[i + 1][j] == 0) checkNull(boardCopy, sizeCopy, [i + 1, j]);
            else flag += 1;
        if (j + 1 < sizeCopy)
            if (boardCopy[i][j + 1] == 0) checkNull(boardCopy, sizeCopy, [i, j + 1]);
            else flag += 1;
        if (i - 1 >= 0)
            if (boardCopy[i - 1][j] == 0) checkNull(boardCopy, sizeCopy, [i - 1, j]);
            else flag += 1;
        if (j - 1 >= 0)
            if (boardCopy[i][j - 1] == 0) checkNull(boardCopy, sizeCopy, [i, j - 1]);
            else flag += 1;


    }
    var boardInput = 0

    function reset() {
        $('.gameContainer').html(" ");
    }

    $('.buttons').click(function(event) {
        var counter = 0;
        var myInterval = setInterval(function() {
            $('#counter').html(counter + " seconds");
            ++counter;
        }, 1000);
        //myInterval();

        if ($(this).attr("id") == '8x8') boardInput = 8;
        else if ($(this).attr("id") == '10x10') boardInput = 10;
        else boardInput = 16;
        reset();
        var board1 = new Board(boardInput);
        board1.createBoardSize();
        board1.createBoard();
        board1.generateBombs();
        board1.generateNumbers();
        board1.renderBoard();

        $('.ans').click(function(event) {
            window.location.reload(true);
        })
        $('.square').contextmenu(function(event) {
            var reg = /\d+/g;
            var lineAndCol = $(this).attr('id').match(reg);
            var i = parseInt(lineAndCol[0]);
            var j = parseInt(lineAndCol[1]);
            var index1 = -1;
            if ($(this).css('background-color') == 'rgb(192, 57, 43)') {
                for (var index = 0; index < board1.checked.length; index++) {
                    if (board1.checked[index] == [i, j]) index1 = index;
                }
                if (index > -1) board1.checked.splice(index1, 1);
                $(this).css({ 'background-color': '#3498db' });
            } else {
                $(this).css({ 'background-color': '#c0392b' });
                board1.checked.push([i, j]);
            }
            checkWin(board1.bombs, board1.checked);
        });

        $('.square').click(function(event) {

            var reg = /\d+/g;
            var lineAndCol = $(this).attr('id').match(reg);
            var i = parseInt(lineAndCol[0]);
            var j = parseInt(lineAndCol[1]);

            if (board1.boardV[i][j] == 0) board1.clearNull([i, j]);
            else {
                $(this).find('span').removeClass('contentB');
                $(this).css({ 'background-color': '#ecf0f1' });
                if (board1.boardV[i][j] == "bomb") {
                    clearInterval(myInterval);
                    $('span').removeClass('contentB');
                    $('.square').css({ 'background-color': '#ecf0f1' });
                    $('#modal1').modal('open');
                    $('.modal-content').append("<h4>You lost in <span class='timer'></span></h4>   <h5> Wanna go again? </h5>");
                    $('.timer').html(counter + ' seconds');
                }
            }

        })
    })


})
