var RT = {};

RT.config = { 
	warmupDuration : 5,
	cooldownDuration : 5
};

RT.View = {};
RT.View.displayRunHeading = function(week, day) {
	$('.runSetup').hide();
	$('.runDisplay h1').text('Week ' + week + ', Day ' + day);
	$('.runDisplay').show();
};
		
RT.View.restart = function() {
	location.reload();
};
		
RT.View.readSetup = function() {
	return {
		week : $('#ddlWeek').val(),
		day : $('input:radio[name=radDay]:checked').val(),
		includeWarmup : $('#chkWarmup:checked').val() !== undefined
	};
};
		
RT.View.walk = function() {
	RT.View.showWalk();
}

RT.View.run = function() {
	RT.View.showRun();
}
		
RT.View.warmup = function() {
	RT.View.showWalk('Warm Up');
}
		
RT.View.cooldown = function() {
	RT.View.showWalk('Cool Down');
}
		
RT.View.done = function() {
	RT.View.showWalk('Done!');
}
		
RT.View.transition = function(callback) {
	var indicatorDiv = $('.runCountdown');
	var body = $(document.body);
	RT.View.transitionBlink(6, indicatorDiv, body, callback);
};
		
RT.View.transitionBlink = function(transitionStage, indicatorDiv, body, callback) {
	if (transitionStage > 0) {
		if (transitionStage % 2 === 0) {
			body.attr('class', 'transitionA');
			indicatorDiv.text(transitionStage / 2 + '...');
		} else {
			body.attr('class', 'transitionB');
		}
		window.setTimeout(function() { RT.View.transitionBlink(transitionStage - 1, indicatorDiv, body, callback) }, 500);
	} else {
		indicatorDiv.text('');
		window.setTimeout(callback(), 500);
	}
};
		
RT.View.showWalk = function() {
	var walkText = arguments[0] || 'Walk';
	$(document.body).attr('class', 'walk');
	$('.runIndicator').text(walkText);
};
		
RT.View.showRun = function() {
	$(document.body).attr('class', 'run');
	$('.runIndicator').text('Run');
};

RT.runProgram = function() { 
	var setup = RT.View.readSetup();
	RT.View.displayRunHeading(setup.week, setup.day);
	RT.warmup(setup);
};
		
RT.restartProgram = function() {
	RT.View.restart();
};
		
RT.warmup = function(setup) {
	if (setup.includeWarmup) {
		RT.View.transition(function() { RT.View.warmup(); });
		window.setTimeout(function() {RT.View.transition(function() { RT.exercise(setup); })}, RT.minToMilli(RT.config.warmupDuration));
	} else {
		RT.View.transition(function() { RT.exercise(setup); });
	}
};
		
RT.exercise = function(setup) {
	var workout = RT.getWorkout(setup.week, setup.day);
	RT.doExercise(workout, 0);
};
		
RT.cooldown = function() {
	RT.View.cooldown();
	window.setTimeout(function() { RT.View.transition(function() { RT.View.done(); })}, RT.minToMilli(RT.config.cooldownDuration));
};
		
RT.doExercise = function(workout, i) {
	workout[i].mode();
	if (i === workout.length - 1) {
		window.setTimeout(function() { RT.View.transition(cooldown) }, RT.minToMilli(workout[i].minutes));
	} else {
		window.setTimeout(function() { RT.View.transition(function() { RT.doExercise(workout, i + 1); })}, RT.minToMilli(workout[i].minutes));
	}
};
		
RT.getWorkout = function(week, day) {
	var wd = week + day; //concatenate as a two-digit number.
	return C25K[wd];
};
			
RT.minToMilli = function(minutes) {
	return minutes * 60 * 1000;
};
