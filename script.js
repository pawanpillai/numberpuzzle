angular.module('myApp', [])
  .controller('GameController', function($timeout) {
    
	var scope = this;
	scope.ModelData = {};
	scope.ModelData.OriginalNumbers = [1,2,3,4,5,6,7,8,''];
	scope.ModelData.TargetNumbers = [1,2,3,4,5,6,7,8,''];
	scope.HiddenData = {};
	scope.HiddenData.GridSize = 3;
	scope.HiddenData.IntervalId = 0;
	
	scope.CountdownTimer = function(duration, display) {
		var timer = duration, minutes, seconds;
		scope.HiddenData.IntervalId = setInterval(function () {
			minutes = parseInt(timer / 60, 10)
			seconds = parseInt(timer % 60, 10);

			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			display.text(minutes + ":" + seconds);

			if (--timer < 0) {
				timer = duration;
			}
			
			if(minutes == 0 && seconds == 0){
				clearInterval(scope.HiddenData.IntervalId);
				scope.TimeUp = true;
				scope.ModelData.SimpleModalMessage = 'Sorry, Time Over !!';
				$timeout(function(){
					$('#SimpleModal').modal({
						keyboard: false
					});
				},1);
			}
		}, 1000);
		
		
		scope.Shuffled = true;
	}
	
	//This function handles number click on the UI
	scope.HandleNumberClick = function(){
		
		//if not shuffled or time is up, then return
		if(scope.Shuffled == false || scope.TimeUp === true){
			return;
		}
		
		$('.main').children().removeClass('invalidmove');	//reset previous invalid move color if any
		
		var $Cell;
		if($(event.target).is('h1')){
			$Cell = $(event.target.parentElement);	//h1 clicked	
		}else{
			$Cell = $(event.target);				//div clicked
		}
		
		var CurrentIndex = 	parseInt($Cell.attr('data-index')) + 1;
		var NeighborIndex = scope.FindNeighborIndex($Cell);
		
		if(scope.Move(CurrentIndex, NeighborIndex) == false){
			$Cell.addClass('invalidmove');
		}
		else{
			$Cell.removeClass('invalidmove');
			$timeout(function(){
				scope.CheckWinStatus();	
			},100);
		}
	};
	
	
	//This function checks if you win or not.
	scope.CheckWinStatus = function(){
		if(scope.ModelData.TargetNumbers.toString() == scope.ModelData.OriginalNumbers.toString()){
			scope.TimeUp = true;
			clearInterval(scope.HiddenData.IntervalId);
			scope.ModelData.SimpleModalMessage = 'Congrats! You Win!!';
			$timeout(function(){
				$('#SimpleModal').modal({
					keyboard: false
				});
			},1);
		}
	};
	
	//This function finds cells neighbors
	scope.FindNeighborIndex = function($Cell){
		//var CurrentIndex = 	$Cell.data('index') + 1;
		var CurrentIndex = 	parseInt($Cell.attr('data-index')) + 1;
		var NeighborIndex = {};
		NeighborIndex.Top = 	(CurrentIndex - scope.HiddenData.GridSize) < 1 ? null: CurrentIndex - scope.HiddenData.GridSize;
		NeighborIndex.Bottom = 	(CurrentIndex + scope.HiddenData.GridSize) > (scope.HiddenData.GridSize * scope.HiddenData.GridSize) ? null: CurrentIndex + scope.HiddenData.GridSize;
		NeighborIndex.Left = 	(CurrentIndex - 1) % scope.HiddenData.GridSize == 0 ? null: CurrentIndex - 1;;
		NeighborIndex.Right = 	(CurrentIndex) % scope.HiddenData.GridSize == 0 ? null: CurrentIndex + 1;
		
		return NeighborIndex;
	};
	
	//Main move function
	scope.Move = function(CurrentIndex, NeighborIndex){
		//1. First check if any neighbor is blank
		if(scope.ModelData.OriginalNumbers[NeighborIndex.Top - 1] == ''){
			scope.ModelData.OriginalNumbers[NeighborIndex.Top - 1] = scope.ModelData.OriginalNumbers[CurrentIndex - 1];
		}
		else if(scope.ModelData.OriginalNumbers[NeighborIndex.Bottom - 1] == ''){
			scope.ModelData.OriginalNumbers[NeighborIndex.Bottom - 1] = scope.ModelData.OriginalNumbers[CurrentIndex - 1];
		}
		else if(scope.ModelData.OriginalNumbers[NeighborIndex.Left - 1] == ''){
			scope.ModelData.OriginalNumbers[NeighborIndex.Left - 1] = scope.ModelData.OriginalNumbers[CurrentIndex - 1];
		}
		else if(scope.ModelData.OriginalNumbers[NeighborIndex.Right - 1] == ''){
			scope.ModelData.OriginalNumbers[NeighborIndex.Right - 1] = scope.ModelData.OriginalNumbers[CurrentIndex - 1];
		}
		else{
			//no move present
			return false;
		}
		scope.ModelData.OriginalNumbers[CurrentIndex - 1] = '';
		return true;		
	};
	
	//Shuffle Function
	scope.Shuffle = function(){
		clearInterval(scope.HiddenData.IntervalId);
		scope.Shuffled = true;
		scope.TimeUp = false;
		scope.ModelData.OriginalNumbers = [1,2,3,4,5,6,7,8,''];
		var loopCount = 5000;
		var RandomIndex, $RandomCell;
		for(index = 0; index < loopCount; index++){
			RandomIndex = Math.floor((Math.random() * scope.HiddenData.GridSize * scope.HiddenData.GridSize));
			$RandomCell = $('.main').children().eq(RandomIndex);
			var NeighborIndex = scope.FindNeighborIndex($RandomCell);
			scope.Move(RandomIndex, NeighborIndex);
		}
		
		var time = 60 * 3;	//3 minutes
		var	countdown = $('#countdown');
		scope.CountdownTimer(time, countdown);
	};
	
	//Main Init() function
	scope.init = function(){
		scope.Shuffled = false;
		$('.author').text('Pawan Pillai');
		$('.author').attr('href', 'http://pawanpillai.com/');
	};
	
	//start the controller
	scope.init();
  });
