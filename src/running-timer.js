RunningTimer = (function() {
	var Timer = function() {
		var config = {
			warmupDuration : 5,
			cooldownDuration : 5
		};
		var ui = new UI();
		var timerHelper = new TimerHelper(ui, config);
		this.runProgram = timerHelper.runProgram;
		this.restartProgram = timerHelper.restartProgram;
	}
	
	var UI = function() {
		this.displayRunHeading = function(week, day) {
			$('.runSetup').hide();
			$('.runDisplay h1').text('Week ' + week + ', Day ' + day);
			$('.runDisplay').show();
		};
		
		this.restart = function() {
			location.reload();
		};
		
		this.readSetup = function() {
			return {
				week : $('#ddlWeek').val(),
				day : $('input:radio[name=radDay]:checked').val(),
				includeWarmup : $('#chkWarmup:checked').val() !== undefined
			};
		};
		
		this.walk = function() {
			showWalk();
		}
		
		this.run = function() {
			showRun();
		}
		
		this.warmup = function() {
			showWalk('Warm Up');
		}
		
		this.cooldown = function() {
			showWalk('Cool Down');
		}
		
		this.done = function() {
			showWalk('Done!');
		}
		
		this.transition = function(callback) {
			var indicatorDiv = $('.runCountdown');
			var body = $(document.body);
			transitionBlink(6, indicatorDiv, body, callback);
		};
		
		var transitionBlink = function(transitionStage, indicatorDiv, body, callback) {
			if (transitionStage > 0) {
				if (transitionStage % 2 === 0) {
					body.attr('class', 'transitionA');
					indicatorDiv.text(transitionStage / 2 + '...');
				} else {
					body.attr('class', 'transitionB');
				}
				window.setTimeout(function() { transitionBlink(transitionStage - 1, indicatorDiv, body, callback) }, 500);
			} else {
				indicatorDiv.text('');
				window.setTimeout(callback(), 500);
			}
		};
		
		var showWalk = function() {
			var walkText = arguments[0] || 'Walk';
			$(document.body).attr('class', 'walk');
			$('.runIndicator').text(walkText);
		};
		
		var showRun = function() {
			$(document.body).attr('class', 'run');
			$('.runIndicator').text('Run');
		};
	}
	
	var TimerHelper = function(UI, config) {
	
		this.runProgram = function() { 
			var setup = UI.readSetup();
			UI.displayRunHeading(setup.week, setup.day);
			warmup(setup);
		};
		
		this.restartProgram = function() {
			UI.restart();
		}
		
		var warmup = function(setup) {
			if (setup.includeWarmup) {
				UI.transition(function() { UI.warmup(); });
				window.setTimeout(function() {UI.transition(function() { exercise(setup); })}, minToMilli(config.warmupDuration));
			} else {
				UI.transition(function() { exercise(setup); });
			}
		}
		
		var exercise = function(setup) {
			var workout = getWorkout(setup.week, setup.day);
			doExercise(workout, 0);
		}
		
		var cooldown = function() {
			UI.cooldown();
			window.setTimeout(function() { UI.transition(function() { UI.done(); })}, minToMilli(config.cooldownDuration));
		}
		
		var doExercise = function(workout, i) {
			workout[i].mode();
			if (i === workout.length - 1) {
				window.setTimeout(function() { UI.transition(cooldown) }, minToMilli(workout[i].minutes));
			} else {
				window.setTimeout(function() { UI.transition(function() { doExercise(workout, i + 1); })}, minToMilli(workout[i].minutes));
			}
		}
		
		var getWorkout = function(week, day) {
			var wd = week + day; //concatenate as a two-digit number.
			return C25K[wd];
		}
			
		var minToMilli = function(minutes) {
			return minutes * 60 * 1000;
		}
	}
	return Timer;
})();