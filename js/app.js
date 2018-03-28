(function() {
  'use strict';

  angular
    .module('GridPuzzle', ['hljs'])
    .controller('AppController', AppController);

  function AppController($scope, $timeout) {

    var emptyCell = null;

    $scope.cols = 5;
    $scope.rows = 5;
    $scope.size = 80; //px
    $scope.file = null;
    $scope.image = '/img/fox.png';
    $scope.cells = [];
    $scope.shuffleDisabled = false;
    $scope.wrapperStyle = null;
    $scope.cellStyle = '(move your cursor onto the puzzle)';

    $scope.init = init;
    $scope.shuffle = shuffle;
    $scope.switchCell = switchCell;
    $scope.getWrapperStyle = getWrapperStyle;
    $scope.getCellStyle = getCellStyle;
    $scope.onDimensionChange = onDimensionChange;
    $scope.onKeyPress = onKeyPress;
    $scope.onCellClick = onCellClick;
    $scope.onCellHover = onCellHover;

    $scope.init();

    function init() {
      $scope.onDimensionChange();
      $scope.shuffle();

      var fileDOM = document.getElementById('imageFile');
      fileDOM.addEventListener('change', function() {
        $scope.file = this.files[0];
        var fr = new FileReader();
        fr.onload = function () {
          $scope.image = fr.result;
          $scope.onDimensionChange();
          $scope.$apply();
        }
        fr.readAsDataURL(this.files[0]);
      });
    }


    function shuffle() {
      var n = 2000;
      $scope.shuffleDisabled = true;
      for (let i = 1; i <= n; i++) {
        (function(index) {
          $timeout(function() {
            var code = 37 + Math.floor(Math.random() * 4);
            $scope.onKeyPress({ keyCode: code });
            if (index === n) {
              $scope.shuffleDisabled = false;
            }
          }, 1 * index);
        })(i);
      }
    }

    function switchCell(x, y) {
      var targetCell = $scope.cells.find(function(ele) { return ele.posX === x && ele.posY === y; });
      targetCell.posX = emptyCell.posX;
      targetCell.posY = emptyCell.posY;
      emptyCell.posX = x;
      emptyCell.posY = y;
    }

    function getWrapperStyle() {
      $scope.wrapperStyle = 'grid-template-columns: repeat(' + $scope.cols + ', 1fr);\n' +
        'grid-template-rows: repeat(' + $scope.rows + ', 1fr);';
      return {
        gridTemplateColumns: 'repeat(' + $scope.cols + ', 1fr)',
        gridTemplateRows: 'repeat(' + $scope.rows + ', 1fr)',
        width: $scope.cols * $scope.size + 'px',
        height: $scope.rows * $scope.size + 'px'
      };
    }

    function getCellStyle(cell) {
      return {
        backgroundSize: $scope.cols * $scope.size + 'px ' + $scope.rows * $scope.size + 'px',
        backgroundImage: 'url(' + $scope.image + ')',
        backgroundPosition: cell.x * $scope.size * -1 + 'px ' + cell.y * $scope.size * -1 + 'px',
        gridColumn: cell.posX + 1,
        gridRow: cell.posY + 1
      };
    }

    function onDimensionChange() {
      $scope.cells = Array.from({ length: $scope.rows * $scope.cols }, function(v, i) {
        var x = i % $scope.cols;
        var y = Math.floor(i / $scope.cols);
        return {
          id: i,
          x: x,
          y: y,
          posX: x,
          posY: y
        };
      });
      emptyCell = $scope.cells[$scope.cells.length - 1];
    }

    function onKeyPress(event) {
      if (event.keyCode == 37) { // on key left stroke
        if (emptyCell.posX > 0) {
          $scope.switchCell(emptyCell.posX - 1, emptyCell.posY);
        }
      } else if (event.keyCode == 38) { // on key up stroke
        if (emptyCell.posY > 0) {
          $scope.switchCell(emptyCell.posX, emptyCell.posY - 1);
        }
      } else if (event.keyCode == 39) { // on key right stroke
        if (emptyCell.posX < $scope.cols - 1) {
          $scope.switchCell(emptyCell.posX + 1, emptyCell.posY);
        }
      } else if (event.keyCode == 40) { // on key down stroke
        if (emptyCell.posY < $scope.rows - 1) {
          $scope.switchCell(emptyCell.posX, emptyCell.posY + 1);
        }
      }
    }

    function onCellClick(cell) {
      if (cell.posX !== emptyCell.posX && cell.posY !== emptyCell.posY) { return; }
      var code;
      if (cell.posX === emptyCell.posX - 1) { code = 37; }
      else if (cell.posY === emptyCell.posY - 1) { code = 38; }
      else if (cell.posX === emptyCell.posX + 1) { code = 39; }
      else if (cell.posY === emptyCell.posY + 1) { code = 40; }
      if (code) { $scope.onKeyPress({ keyCode: code }); }
    }

    function onCellHover(event) {
      $scope.cellStyle = 'grid-area: ' + event.target.style.gridArea + ';';
    }
  }
})();