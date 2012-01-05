describe("RunningTimer", function() {
	var timer;
	
	beforeEach(function() {
		timer = new RunningTimer();
	});
	
	it("should initialize a running timer", function() {
		expect(timer).not.toBeUndefined();
	});
});