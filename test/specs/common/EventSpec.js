var Event = require('./../../../lib/common/messaging/Event');

describe('When an Event is constructed', function() {
	'use strict';

	var event;

	beforeEach(function() {
		event = new Event();
	});

	describe('and three handlers are registered', function() {
		var eventHandlerOne;
		var eventHandlerTwo;
		var eventHandlerThree;

		beforeEach(function() {
			event.register(eventHandlerOne = jasmine.createSpy('eventHandlerOne'));
			event.register(eventHandlerTwo = jasmine.createSpy('eventHandlerTwo'));
			event.register(eventHandlerThree = jasmine.createSpy('eventHandlerThree'));
		});

		it('should report the event as not empty', function() {
			expect(event.getIsEmpty()).toBe(false);
		});

		describe('and the event fires', function() {
			var eventData;

			beforeEach(function() {
				event.fire(eventData = {});
			});

			it('should notify the first handler', function() {
				expect(eventHandlerOne).toHaveBeenCalledWith(eventData);
			});

			it('should notify the second handler', function() {
				expect(eventHandlerTwo).toHaveBeenCalledWith(eventData);
			});

			it('should notify the third handler', function() {
				expect(eventHandlerThree).toHaveBeenCalledWith(eventData);
			});
		});

		describe('and the second event handler is unregistered', function() {
			beforeEach(function() {
				event.unregister(eventHandlerTwo);
			});

			it('should report the event as not empty', function() {
				expect(event.getIsEmpty()).toBe(false);
			});

			describe('and the event fires', function() {
				var eventData;

				beforeEach(function() {
					event.fire(eventData = {});
				});

				it('should notify the first handler', function() {
					expect(eventHandlerOne).toHaveBeenCalledWith(eventData);
				});

				it('should not notify the second handler', function() {
					expect(eventHandlerTwo).not.toHaveBeenCalledWith(eventData);
				});

				it('should notify the third handler', function() {
					expect(eventHandlerThree).toHaveBeenCalledWith(eventData);
				});
			});
		});

		describe('and all three event handlers are unregistered', function() {
			beforeEach(function() {
				event.unregister(eventHandlerOne);
				event.unregister(eventHandlerTwo);
				event.unregister(eventHandlerThree);
			});

			it('should report the event as empty', function() {
				expect(event.getIsEmpty()).toBe(true);
			});

			describe('and the event fires', function() {
				var eventData;

				beforeEach(function() {
					event.fire(eventData = {});
				});

				it('should not notify the first handler', function() {
					expect(eventHandlerOne).not.toHaveBeenCalledWith(eventData);
				});

				it('should not notify the second handler', function() {
					expect(eventHandlerTwo).not.toHaveBeenCalledWith(eventData);
				});

				it('should not notify the third handler', function() {
					expect(eventHandlerThree).not.toHaveBeenCalledWith(eventData);
				});
			});
		});
	});
});