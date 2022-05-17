const assert = require('@barchart/common-js/lang/assert');

const Schedule = require('../data/Schedule');

module.exports = (() => {
	/**
	 * @public
	 * @ignore
	 */
	class ScheduleBuilder {
		constructor() {
			this._schedule = new Schedule(null, null, null);
		}

		withDay(day) {
			assert.argumentIsRequired(day, 'day', String);
			
			this._schedule = new Schedule(day, this._schedule.time, this._schedule.timezone);

			return this;
		}

		withTime(time) {
			assert.argumentIsRequired(time, 'time', String);

			this._schedule = new Schedule(this._schedule.day, time, this._schedule.timezone);

			return this;
		}

		withTimezone(timezone) {
			assert.argumentIsRequired(timezone, 'timezone', String);

			this._schedule = new Schedule(this._schedule.day, this._schedule.time, timezone);

			return this;
		}

		get schedule() {
			return this._schedule;
		}

		build() {
			return this._schedule.toJSON();
		}

		toString() {
			return '[ScheduleBuilder]';
		}
	}

	return ScheduleBuilder;
})();