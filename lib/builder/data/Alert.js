module.exports = (() => {
	/**
	 * @public
	 * @ignore
	 */
	class Alert {
		constructor(alertId, name, userId, alertSystem, alertType, alertBehavior, conditions, publishers, schedules, userNotes) {
			this._alert_id = alertId || null;
			this._name = name || null;
			this._user_id = userId || null;
			this._alert_system = alertSystem || null;
			this._alert_type = alertType || null;
			this._user_notes = userNotes || null;
			this._alert_behavior = alertBehavior || 'terminate';

			this._conditions = conditions || [];
			this._publishers = publishers || [];
			this._schedules = schedules || [];
		}
		
		get alert_id() {
			return this._alert_id;
		}

		get user_id() {
			return this._user_id;
		}

		get name() {
			return this._name;
		}

		get alert_system() {
			return this._alert_system;
		}

		get alert_type() {
			return this._alert_type;
		}

		get user_notes() {
			return this._user_notes;
		}

		get alert_behavior() {
			return this._alert_behavior;
		}

		get conditions() {
			return this._conditions;
		}

		get publishers() {
			return this._publishers;
		}

		get schedules() {
			return this._schedules;
		}

		toJSON() {
			const alertJson = {
				name: this._name,
				user_id: this._user_id,
				alert_system: this._alert_system,
				alert_type: this._alert_type,
				alert_behavior: this._alert_behavior,
				user_notes: this._user_notes,
				conditions: [],
				publishers: [],
				schedules: []
			};
			
			if (this._alert_id) {
				alertJson.alert_id = this._alert_id;
			}

			if (this._conditions.length > 0) {
				alertJson.conditions = this._conditions.map((condition) => {
					return condition;
				});
			}

			if (this._publishers.length > 0) {
				alertJson.publishers = this._publishers.map((publisher) => {
					return publisher;
				});
			}

			if (this._schedules.length > 0) {
				alertJson.schedules = this._schedules.map((schedule) => {
					return schedule;
				});
			}

			return alertJson;
		}

		toString() {
			return '[Alert]';
		}
	}

	return Alert;
})();