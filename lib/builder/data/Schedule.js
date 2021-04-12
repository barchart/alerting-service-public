module.exports = (() => {
	/**
	 *
	 * @public
	 * @param {String} day - The day when alert should trigger.
	 * @param {String} time - Time when alert should trigger.
	 * @param {String} timezone - The timezone of scheduled time.
	 */
	class Schedule {
		constructor(day, time, timezone) {
			this._day = day || null;
			this._time = time || null;
			this._timezone = timezone || null;
		}

		get day() {
			return this._day;
		}

		get time() {
			return this._time;
		}

		get timezone() {
			return this._timezone;
		}

		/**
		 * Returns a JSON object representing property class
		 *
		 * @returns {Object<Schedule>}
		 */
		toJSON() {
			return {
				day: this._day,
				time: this._time,
				timezone: this._timezone,
			};
		}

		toString() {
			return '[Schedule]';
		}
	}

	return Schedule;
})();