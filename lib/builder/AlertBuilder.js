const assert = require('@barchart/common-js/lang/assert');

const Alert = require('./data/Alert');
const ConditionBuilder = require('./builders/ConditionBuilder');
const PublisherBuilder = require('./builders/PublisherBuilder');
const ScheduleBuilder = require('./builders/ScheduleBuilder');

module.exports = (() => {
	/**
	 * Alert builder responsible for building an {@link Alert} object by using provided API functions.
	 *
	 * @public
	 * @exported
	 * @param {Array} operators - An array of possible operators.
	 * @param {Array} properties - An array of possible properties.
	 * @param {Array} publishersType - An array of possible publishers types.
	 */
	class AlertBuilder {
		constructor(operators, properties, publishersType) {
			this._alert = new Alert();
			this._operators = operators;
			this._properties = properties;
			this._publishersType = publishersType;
		}

		get operators() {
			return this._operators;
		}

		get properties() {
			return this._properties;
		}

		get publishersType() {
			return this._publishersType;
		}

		/**
		 * Adds an alert ID then returns the current instance.
		 *
		 * @param {String} alertId - An alert ID
		 * @returns {AlertBuilder}
		 */
		withAlertId(alertId) {
			assert.argumentIsRequired(alertId, 'alertId', String);

			this._alert = new Alert(alertId, this._alert.name, this._alert.user_id, this._alert.alert_system, this._alert.alert_type, this._alert.alert_behavior, this._alert.conditions, this._alert.publishers, this._alert.schedules, this._alert.automatic_reset, this._alert.user_notes);

			return this;
		}

		/**
		 * Adds an alert name then returns the current instance.
		 *
		 * @param {String} name - An alert name
		 * @returns {AlertBuilder}
		 */
		withName(name) {
			assert.argumentIsRequired(name, 'name', String);

			this._alert = new Alert(this._alert.alert_id, name, this._alert.user_id, this._alert.alert_system, this._alert.alert_type, this._alert.alert_behavior, this._alert.conditions, this._alert.publishers, this._alert.schedules, this._alert.automatic_reset, this._alert.user_notes);

			return this;
		}

		/**
		 * Adds an alert system then returns the current instance.
		 *
		 * @param {String} alertSystem - An alert system.
		 * @returns {AlertBuilder}
		 */
		withAlertSystem(alertSystem) {
			assert.argumentIsRequired(alertSystem, 'alertSystem', String);

			this._alert = new Alert(this._alert.alert_id, this._alert.name, this._alert.user_id, alertSystem, this._alert.alert_type, this._alert.alert_behavior, this._alert.conditions, this._alert.publishers, this._alert.schedules, this._alert.automatic_reset, this._alert.user_notes);

			return this;
		}

		/**
		 * Adds a user id then returns the current instance.
		 *
		 * @param {String} userId - A user id in the alert service.
		 * @returns {AlertBuilder}
		 */
		withUserId(userId) {
			assert.argumentIsRequired(userId, 'userId', String);

			this._alert = new Alert(this._alert.alert_id, this._alert.name, userId, this._alert.alert_system, this._alert.alert_type, this._alert.alert_behavior, this._alert.conditions, this._alert.publishers, this._alert.schedules, this._alert.automatic_reset, this._alert.user_notes);

			return this;
		}

		/**
		 * Adds user notes then returns the current instance.
		 *
		 * @param {String} userNotes - A user notes.
		 * @returns {AlertBuilder}
		 */
		withUserNotes(userNotes) {
			assert.argumentIsRequired(userNotes, 'userNotes', String);

			this._alert = new Alert(this._alert.alert_id, this._alert.name, this._alert.user_id, this._alert.alert_system, this._alert.alert_type, this._alert.alert_behavior, this._alert.conditions, this._alert.publishers, this._alert.schedules, this._alert.automatic_reset, userNotes);

			return this;
		}

		/**
		 * Adds alert behavior then returns the current instance.
		 *
		 * @param {String} alertBehavior - An alert behavior.
		 * @returns {AlertBuilder}
		 */
		withAlertBehavior(alertBehavior) {
			assert.argumentIsRequired(alertBehavior, 'alertBehavior', String);

			this._alert = new Alert(this._alert.alert_id, this._alert.name, this._alert.user_id, this._alert.alert_system, this._alert.alert_type, alertBehavior, this._alert.conditions, this._alert.publishers, this._alert.schedules, this._alert.automatic_reset, this._alert.user_notes);

			return this;
		}

		/**
		 * Sets automatic reset to true then returns the current instance.
		 *
		 * @returns {AlertBuilder}
		 */
		withAutomaticReset() {
			this._alert = new Alert(this._alert.alert_id, this._alert.name, this._alert.user_id, this._alert.alert_system, this._alert.alert_type, this._alert.alert_behavior, this._alert.conditions, this._alert.publishers, this._alert.schedules, true, this._alert.user_notes);

			return this;
		}

		/**
		 * Sets automatic reset to true then returns the current instance.
		 *
		 * @returns {AlertBuilder}
		 */
		withAlertType(alertType) {
			assert.argumentIsRequired(alertType, 'alertType', String);

			this._alert = new Alert(this._alert.alert_id, this._alert.name, this._alert.user_id, this._alert.alert_system, alertType, this._alert.alert_behavior, this._alert.conditions, this._alert.publishers, this._alert.schedules, this._alert.automatic_reset, this._alert.user_notes);

			return this;
		}

		/**
		 * Adds {@link Condition} by ConditionBuilder. Uses a callback to provides the consumer with a {@link ConditionBuilder}.
		 *
		 * @returns {AlertBuilder}
		 */
		withConditionBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const cb = new ConditionBuilder(this._operators, this._properties);

			callback(cb);

			const condition = cb.build();

			this._alert = new Alert(this._alert.alert_id, this._alert.name, this._alert.user_id, this._alert.alert_system, this._alert.alert_type, this._alert.alert_behavior, [...this._alert.conditions, condition], this._alert.publishers, this._alert.schedules, this._alert.automatic_reset, this._alert.user_notes);

			return this;
		}

		/**
		 * Adds {@link Publisher} by PublisherBuilder Uses a callback to provides the consumer with a {@link PublisherBuilder}.
		 *
		 * @returns {AlertBuilder}
		 */
		withPublisherBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const pb = new PublisherBuilder(this._publishersType);

			callback(pb);

			const publisher = pb.build();

			this._alert = new Alert(this._alert.alert_id, this._alert.name, this._alert.user_id, this._alert.alert_system, this._alert.alert_type, this._alert.alert_behavior, this._alert.conditions, [...this._alert.publishers, publisher], this._alert.schedules, this._alert.automatic_reset, this._alert.user_notes);

			return this;
		}

		/**
		 * Adds {@link Schedule} by ScheduleBuilder Uses a callback to provides the consumer with a {@link ScheduleBuilder}.
		 *
		 * @returns {AlertBuilder}
		 */
		withScheduleBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const sb = new ScheduleBuilder(this._publishersType);

			callback(sb);

			const schedule = sb.build();

			this._alert = new Alert(this._alert.alert_id, this._alert.name, this._alert.user_id, this._alert.alert_system, this._alert.alert_type, this._alert.alert_behavior, this._alert.conditions, this._alert.publishers, [...this._alert.schedules, schedule], this._alert.automatic_reset, this._alert.user_notes);

			return this;
		}

		/**
		 * Returns an JSON object representing {@link Alert}.
		 *
		 * @returns {Object<Alert>}
		 */
		build() {
			return this._alert.toJSON();
		}

		/**
		 * Generates instance of {@link AlertBuilder} from the JSON.
		 *
		 * @param {Object} json - A json representation of an alert.
		 * @param operators - An array of possible operators.
		 * @param properties - An array of possible properties.
		 * @param publishersType - An array of possible publisher types.
		 * @returns {AlertBuilder}
		 */
		static fromJSON(json, operators, properties, publishersType) {
			const alertBuilder = new AlertBuilder(operators, properties, publishersType);

			alertBuilder._alert = new Alert(json.alert_id, json.name, json.user_id, json.alert_system, json.alert_type, json.alert_behavior, json.conditions, json.publishers, json.schedules, json.automatic_reset, json.user_notes);

			return alertBuilder;
		}

		toString() {
			return '[AlertBuilder]';
		}
	}

	return AlertBuilder;
})();