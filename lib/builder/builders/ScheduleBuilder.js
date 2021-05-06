const assert = require('@barchart/common-js/lang/assert');

const Schedule = require('../data/Schedule');

module.exports = (() => {
	/**
	 * Schedule builder responsible for building a {@link Schedule} object by using provided API functions.
	 *
	 * @public
	 * @exported
	 * @ignore
	 */
	class SchedulesBuilder {
		constructor() {
			this._schedule = new Schedule(null, null, null);
		}

		/**
		 * Sets a day then return current instance.
		 *
		 * @param {String} day - a day of week
		 * @returns {SchedulesBuilder}
		 */
		withDay(day) {
			assert.argumentIsRequired(day, 'day', String);
			
			this._schedule = new Schedule(day, this._schedule.time, this._schedule.timezone);

			return this;
		}

		/**
		 * Adds time then returns the current instance.
		 *
		 * @param {String} time
		 * @returns {SchedulesBuilder}
		 */
		withTime(time) {
			assert.argumentIsRequired(time, 'time', String);

			this._schedule = new Schedule(this._schedule.day, time, this._schedule.timezone);

			return this;
		}

		/**
		 * Adds timezone then returns the current instance.
		 *
		 * @param {String} timezone
		 * @returns {SchedulesBuilder}
		 */
		withTimezone(timezone) {
			assert.argumentIsRequired(timezone, 'timezone', String);

			this._schedule = new Schedule(this._schedule.day, this._schedule.time, timezone);

			return this;
		}

		get schedule() {
			return this._schedule;
		}

		/**
		 * Returns a JSON object representing {@link Schedule}.
		 *
		 * @returns {Object<Schedule>}
		 */
		build() {
			return this._schedule.toJSON();
		}

		toString() {
			return '[SchedulesBuilder]';
		}
	}

	return SchedulesBuilder;
})();