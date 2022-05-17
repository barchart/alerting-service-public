module.exports = (() => {
	/**
	 * @public
	 * @ignore
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