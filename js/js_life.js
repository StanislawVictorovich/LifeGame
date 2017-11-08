var intervalID = 0; var LifeMatrix; 
var inputCols = "input[name='cols']";
var inputRows = "input[name='rows']";
var inputTimer = "input[name='timer']";
var tableName = '#workTable';

var run = function () { 
        LifeMatrix.gridScan($(inputCols).val(), $(inputRows).val()); 
    };

$(document).ready(function() {
    $('#controlBlock').hide();
    $('#buttonStart').click(function() {
        if (this.innerHTML == 'Start') {
            intervalID = setInterval(run,$(inputTimer).val());
            this.innerHTML = 'Pause';
            statusBarWrite('Program working...');
            $(this).fadeTo(3000, 0.3);
        } else {
            clearInterval(intervalID);
            this.innerHTML = 'Start';
            statusBarWrite('Fill the grid and press "Start" button.');
            $(this).fadeTo(1000, 1);
        }
    });

    $('#buttonClear').click(function() {
        LifeMatrix.gridClear();
        statusBarWrite('Clearing success!');
    });

    $('#buttonGosperGun').click(function() {
        gridFillGosperGun();
        $('#statusText').html('The Gosper Gun automat has successfuly generated!');
        if ($(inputRows).val() < 40 && $(inputCols).val() < 40) {
            statusBarWrite('For properly workig the Gosper Gun automat the grid must be at least 40x40!');
        };
    });

    $('#buttonNineTeen').click(function() {
        gridFillNineTeen();
        $('#statusText').html('The 90 automat has successfuly generated!');
        if ($(inputRows).val() < 40 && $(inputCols).val() < 40) {
            statusBarWrite('For properly workig the 90 automat the grid must be at least 30x30!');
        };
    });

    $('#buttonSet').click(function() {
        if ($.isNumeric($(inputRows).val()) && $.isNumeric($(inputCols).val()) 
            && $.isNumeric($(inputTimer).val())) {
                $('#optionsBlock').hide('slow');
                $('#controlBlock').show('slow');
                LifeMatrix = new Life($(inputRows).val() ,$(inputCols).val());
                statusBarWrite('Fill the grid and press "Start" button.');  
        } else {
            statusBarWrite('Check input, please!');
        }
    });

    $('#buttonRandom').click(function() {
        LifeMatrix.gridRandom();
        statusBarWrite('Random numbers has been generated!');
    });

    $('#buttonInvert').click(function() {
        LifeMatrix.gridInvert();
        statusBarWrite('The grid has successfuly inverted!');
    });
});

function Life(cols,rows) {
    var life = this;
    var tableCreate = function() { // construct class method
        life.cols = cols;
        life.rows = rows;
        life.live_cell = 'live_cell';
        life.dead_cell = 'dead_cell';
        life.cellPrefix = 'a';
        life.cellJQueryPrefix = '#a';
        life.cellXYDivider = '_';
        life.trBlock = 'tr';
        life.tdBlock = 'td';
        $(tableName).hide();
        for (var i = 0; i < life.cols; i++) {
            var trBlock = document.createElement(life.trBlock);
            $(tableName).append(trBlock);
                for (var j = 0; j < life.rows; j++) {
                    var tdBlock = document.createElement(life.tdBlock);
                    tdBlock.className = life.dead_cell;
                    tdBlock.id = life.cellPrefix + i + life.cellXYDivider + j;
                    $(trBlock).append(tdBlock);  
                } 
            }
            $(tableName).fadeTo(5000, 1);
    }

    var matrixCreate = function() {
        var arr = new Array();
        for (var i = 0; i < life.cols; i++) {
                arr[i] = new Array();
            for (var j = 0; j < life.rows; j++) {
                arr[i][j] = 0;
            }
        }

        return arr;
    }

    var matrixScan = function(arr) {
        for (var i = 0; i < life.cols; i++) { // copying the interface matrix into the logic matrix
            for (var j = 0; j < life.rows; j++) {
                if ($(cellStringFormating(i,j)).attr('class') == life.dead_cell){
                        arr[i][j] = 0; 
                    } else {
                        arr[i][j] = 1;
                    }
            }
        }   

        return arr; 
    }

    var matrixCalculate = function(arr) {
        var outputArr = matrixCreate(); //= new Array();
        for (var i = 0; i < life.cols; i++) { // mirroring grids
            for (var j = 0; j < life.rows; j++) {
                outputArr[i][j] = arr[i][j];
            }
        }
        for (var i = 0; i < life.cols; i++) {    // live / dead calculating algorithm
            for (var j = 0; j < life.rows; j++) {
                var cellsCounter=0;
                for (var m = i-1; m <= i+1; m++) {
                    for (var n = j-1; n <= j+1; n++) {
                        if (m < cols && n < rows && m >= 0 && n >= 0) {
                            if (arr[m][n] == 1) {
                                cellsCounter++;                 
                            }
                            if (m == i && n == j && arr[i][j] == 1 && cellsCounter > 0) { //excluding central cell 
                                cellsCounter--;
                            }
                        }
                    }
                }
                switch (cellsCounter) {
                    case 3 :
                        if (!arr[i][j]) {
                            outputArr[i][j] = 1; 
                        }
                    break;
                    default:
                        if (arr[i][j] == 1 && cellsCounter != 2) {
                            outputArr[i][j] = 0;
                        }
                    break;
                }
            }
        }

        return outputArr;
    }

    var cellStringFormating = function(x, y) {        
        return life.cellJQueryPrefix+x+life.cellXYDivider+y;
    }

    this.cellChange = function(element, number) {
        !number? $(element).addClass(life.dead_cell).removeClass(life.live_cell)
               : $(element).addClass(life.live_cell).removeClass(life.dead_cell);
    }

    var matrixSynchronize = function(arr) { // copying the interface matrix into the logic matrix
        for (var i = 0; i < life.cols; i++) { 
            for (var j = 0; j < life.rows; j++) {
                var str = cellStringFormating(i, j);
                !arr[i][j] ? life.cellChange(str, 0) 
                           : life.cellChange(str, 1); 
            }
        } 
    }

    this.gridScan = function() {
        var dataElements = matrixCreate();
        dataElements = matrixScan(dataElements);
        dataElements = matrixCalculate(dataElements);
        matrixSynchronize(dataElements);
    }

    this.gridClear = function() {
        for (var i = 0; i < life.cols; i++) { 
            for (var j = 0; j < life.rows; j++) {
                life.cellChange(cellStringFormating(i,j),0);
            }
        }
    }

    this.gridInvert = function() {
        for (var i = 0; i < life.cols; i++) {
            for (var j = 0; j < life.rows; j++) {
                $(cellStringFormating(i, j)).toggleClass(life.dead_cell+' '+life.live_cell); 
            }
        }
    }

    this.gridRandom = function() {
        this.gridClear();
        for (var i = 0; i < life.cols; i++) { 
            for (var j = 0; j < life.rows; j++) {
                life.cellChange(cellStringFormating(i, j),!Math.floor(Math.random()*2));
            }
        }
    }

    tableCreate(); // construct method - initializing table [x, y]
}

var statusBarWrite = function(str) {
    $('#statusText').html(str);
}

var cellToggleFade = function(element) {
    $(element).hide();
    LifeMatrix.cellChange(element, 1);
    $(element).fadeTo('slow', 1);    
}

var gridFillGosperGun = function() { // Gosper Gun pattern automat
    var arr = ['#a5_33','#a5_34','#a6_34','#a6_35','#a7_33','#a14_23','#a14_24','#a15_25',
    ,'#a16_12','#a16_13','#a16_26','#a16_35','#a17_12','#a17_26','#a17_35','#a17_36','#a18_9','#a18_10',
    '#a18_26','#a19_1','#a19_8','#a19_9','#a19_10','#a19_25','#a20_1','#a20_2','#a20_9',
    '#a20_10','#a20_23','#a20_24','#a21_12','#a21_13','#a22_12'];
    arr.forEach(function(item, i, arr) {
        cellToggleFade(item);
    });
}

var gridFillNineTeen = function() {  // 90 pattern automat
    var arr = ['#a18_18','#a18_19','#a18_20','#a18_22','#a18_23','#a18_24','#a19_18','#a19_20','#a19_22',
        '#a19_24','#a20_18','#a20_19','#a20_20','#a20_22','#a20_24','#a21_20','#a21_22','#a21_24',
        '#a22_18','#a22_19','#a22_20','#a22_22','#a22_23','#a22_24'];
    arr.forEach(function(item, i, arr) {
        cellToggleFade(item);
    });
}
