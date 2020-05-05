/**
 * A meta namespace containing structural contracts of anonymous objects.
 *
 * @namespace Schema
 */

/**
 * The arguments which can be used with {@link AlertManager#retrieveAlert}.
 *
 * @typedef AlertQuery
 * @type Object
 * @memberOf Schema
 * @property {String=} user_id - The identifier of the authenticated user.
 * @property {String=} alert_system - The domain of the authenticated user.
 */

/**
 * An "alert" consists of one or more {@link Condition} objects and one or more
 * {@link Publisher} objects.
 *
 * @typedef Alert
 * @type Object
 * @memberOf Schema
 * @property {String} alert_id - The alert's unique identifier.
 * @property {String} alert_system
 * @property {String} alert_system_key
 * @property {String} user_id
 * @property {String=} user_notes
 * @property {Enums.AlertState=} alert_state
 * @property {Enums.AlertBehaviour=} alert_behaviour - Used to control what happens after an alert's conditions are met.
 * @property {String=} alert_type - Used to classify the alert, controlling "default" publishing rules, if no publishers have been explicitly specified. This happens by matching the "active_alert_type" property of a {@link PublisherTypeDefault}.
 * @property {Boolean=} automatic_reset
 * @property {String=} create_date
 * @property {Publisher[]} effectivePublishers
 * @property {String} last_start_date
 * @property {String} last_trigger_date
 * @property {String} name
 * @property {Condition[]} conditions
 * @property {Publisher[]} publishers
 * @property {AlertResetSchedule[]} schedules
 * @property {String} tracking_server_id
 */