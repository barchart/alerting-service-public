module.exports = (() => {
	/**
	 * An "alert" is the system's **primary** data structure.
	 *
	 * @public
	 * @ignore
	 * @param {String|null} name - The name of the alert (if not provided, the backend will attempt to generate a name).
	 * @param {String} userId - The alert owner's unique identifier.
	 * @param {String} alertSystem - The alert owner's domain.
	 * @param {String} alertType - Used to classify the alert, controlling "default" publishing rules, if no publishers have been explicitly specified. This happens by matching the "active_alert_type" property of a {@link PublisherTypeDefault}.
	 * @param {Boolean} automaticReset - allow to reset alert automatically
	 * @param {String} userNotes - Ad hoc text.
	 * @param {Enums.AlertBehaviour} alertBehavior - The alert's strategy for handling state changes after its conditions are met —```terminate``` is the default value.
	 * @param {Array<Condition>} conditions - The conditions which cause an the alert to be triggered. If multiple conditions are present, they must all be satisfied before the alert will be triggered.
	 * @param {Alert<Publisher>} publishers - The rules for sending notifications when the alert is triggered. This is optional. In most cases, it's best to rely on the default rules bound to the alert's owner.
	 * @param {Alert<Schedule>} schedules - An array of schedules
	 */
	class Alert {
		constructor(alertId, name, userId, alertSystem, alertType, alertBehavior, conditions, publishers, schedules, automaticReset, userNotes) {
			this._alert_id = alertId || null;
			this._name = name || null;
			this._user_id = userId || null;
			this._alert_system = alertSystem || null;
			this._alert_type = alertType || null;
			this._automatic_reset = automaticReset || false;
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

		get automatic_reset() {
			return this._automatic_reset;
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

		/**
		 * Returns a JSON object representing {@link Alert}
		 *
		 * @returns {Object<Alert>}
		 */
		toJSON() {
			const alertJson = {
				name: this._name,
				user_id: this._user_id,
				alert_system: this._alert_system,
				alert_type: this._alert_type,
				alert_behavior: this._alert_behavior,
				automatic_reset: this._automatic_reset,
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