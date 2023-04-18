const assert = require('@barchart/common-js/lang/assert');

const ConditionBuilder = require('./ConditionBuilder'),
	PublisherBuilder = require('./PublisherBuilder'),
	ScheduleBuilder = require('./ScheduleBuilder');

const Alert = require('./../data/Alert');

module.exports = (() => {
	/**
	 * @public
	 * @ignore
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

		withAlertId(alertId) {
			assert.argumentIsRequired(alertId, 'alertId', String);

			this._alert = new Alert(alertId, this._alert.name, this._alert.user_id, this._alert.alert_system, this._alert.alert_type, this._alert.alert_behavior, this._alert.conditions, this._alert.publishers, this._alert.schedules, this._alert.user_notes);

			return this;
		}

		withName(name) {
			assert.argumentIsRequired(name, 'name', String);

			this._alert = new Alert(this._alert.alert_id, name, this._alert.user_id, this._alert.alert_system, this._alert.alert_type, this._alert.alert_behavior, this._alert.conditions, this._alert.publishers, this._alert.schedules, this._alert.user_notes);

			return this;
		}

		withAlertSystem(alertSystem) {
			assert.argumentIsRequired(alertSystem, 'alertSystem', String);

			this._alert = new Alert(this._alert.alert_id, this._alert.name, this._alert.user_id, alertSystem, this._alert.alert_type, this._alert.alert_behavior, this._alert.conditions, this._alert.publishers, this._alert.schedules, this._alert.user_notes);

			return this;
		}

		withUserId(userId) {
			assert.argumentIsRequired(userId, 'userId', String);

			this._alert = new Alert(this._alert.alert_id, this._alert.name, userId, this._alert.alert_system, this._alert.alert_type, this._alert.alert_behavior, this._alert.conditions, this._alert.publishers, this._alert.schedules, this._alert.user_notes);

			return this;
		}

		withUserNotes(userNotes) {
			assert.argumentIsRequired(userNotes, 'userNotes', String);

			this._alert = new Alert(this._alert.alert_id, this._alert.name, this._alert.user_id, this._alert.alert_system, this._alert.alert_type, this._alert.alert_behavior, this._alert.conditions, this._alert.publishers, this._alert.schedules, userNotes);

			return this;
		}

		withAlertBehavior(alertBehavior) {
			assert.argumentIsRequired(alertBehavior, 'alertBehavior', String);

			this._alert = new Alert(this._alert.alert_id, this._alert.name, this._alert.user_id, this._alert.alert_system, this._alert.alert_type, alertBehavior, this._alert.conditions, this._alert.publishers, this._alert.schedules, this._alert.user_notes);

			return this;
		}

		withAlertType(alertType) {
			assert.argumentIsRequired(alertType, 'alertType', String);

			this._alert = new Alert(this._alert.alert_id, this._alert.name, this._alert.user_id, this._alert.alert_system, alertType, this._alert.alert_behavior, this._alert.conditions, this._alert.publishers, this._alert.schedules, this._alert.user_notes);

			return this;
		}

		withConditionBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const cb = new ConditionBuilder(this._operators, this._properties);

			callback(cb);

			const condition = cb.build();

			this._alert = new Alert(this._alert.alert_id, this._alert.name, this._alert.user_id, this._alert.alert_system, this._alert.alert_type, this._alert.alert_behavior, [...this._alert.conditions, condition], this._alert.publishers, this._alert.schedules, this._alert.user_notes);

			return this;
		}

		withPublisherBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const pb = new PublisherBuilder(this._publishersType);

			callback(pb);

			const publisher = pb.build();

			this._alert = new Alert(this._alert.alert_id, this._alert.name, this._alert.user_id, this._alert.alert_system, this._alert.alert_type, this._alert.alert_behavior, this._alert.conditions, [...this._alert.publishers, publisher], this._alert.schedules, this._alert.user_notes);

			return this;
		}

		withScheduleBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const sb = new ScheduleBuilder(this._publishersType);

			callback(sb);

			const schedule = sb.build();

			this._alert = new Alert(this._alert.alert_id, this._alert.name, this._alert.user_id, this._alert.alert_system, this._alert.alert_type, this._alert.alert_behavior, this._alert.conditions, this._alert.publishers, [...this._alert.schedules, schedule], this._alert.user_notes);

			return this;
		}


		build() {
			return this._alert.toJSON();
		}

		static fromJSON(json, operators, properties, publishersType) {
			const alertBuilder = new AlertBuilder(operators, properties, publishersType);

			alertBuilder._alert = new Alert(json.alert_id, json.name, json.user_id, json.alert_system, json.alert_type, json.alert_behavior, json.conditions, json.publishers, json.schedules, json.user_notes);

			return alertBuilder;
		}

		toString() {
			return '[AlertBuilder]';
		}
	}

	return AlertBuilder;
})();