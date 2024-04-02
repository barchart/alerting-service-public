/* jshint node: true */
/* globals document, ko, toastr, _, $ */

"use strict";

const AlertManager = require('./../../../lib/AlertManager');

const AdapterForHttp = require('./../../../lib/adapters/AdapterForHttp'),
	AdapterForSocketIo = require('./../../../lib/adapters/AdapterForSocketIo');

const JwtProvider = require('./../../../lib/security/JwtProvider'),
	getJwtGenerator = require('./../../../lib/security/demo/getJwtGenerator');

const timezone = require('@barchart/common-js/lang/timezone');

const ComparatorBuilder = require('@barchart/common-js/collections/sorting/ComparatorBuilder'),
	comparators = require('@barchart/common-js/collections/sorting/comparators');

var alertManager;

var utilities = AlertManager;

var targets = ko.observable();
var properties = ko.observable();
var operators = ko.observable();
var modifiers = ko.observable();
var publisherTypes = ko.observable();
var marketDataConfiguration = ko.observable();

var currentSystem = null;
var currentUserId = null;

function PageModel(host, system, userId) {
	var that = this;

	that.host = ko.observable(host || 'alerts-management-demo.barchart.com');
	that.system = ko.observable(system || 'barchart.com');
	that.userId = ko.observable(userId || 'me');
	that.mode = ko.observable('socket.io');

	currentSystem = system;
	currentUserId = userId;

	that.version = ko.observable({ });
	that.authenticatedUser = ko.observable('Unsecure');

	that.connecting = ko.observable(false);
	that.connected = ko.observable(false);

	that.message = ko.observable('Waiting to connect...');

	that.alert = ko.observable();
	that.alerts = ko.observableArray([ ]);
	that.alertsFormatted = ko.computed(function() {
		const models = that.alerts().slice(0);

		models.sort(comparatorForAlerts);

		return models;
	});
	that.publisherSettings = ko.observable();
	that.marketDataSettings = ko.observable();
	that.providerDescription = ko.observable(alertManager !== null ? alertManager.toString() : '');

	that.triggers = ko.observableArray([ ]);
	that.triggersSortOptions = ko.observableArray([ triggersOrderOptions.BY_ALERT, triggersOrderOptions.BY_DATE ]);
	that.triggersSelectedSort = ko.observable(triggersOrderOptions.BY_DATE);
	that.triggersFormatted = ko.computed(function() {
		const models = that.triggers().slice(0);

		let sorted;

		if (that.triggersSelectedSort() === triggersOrderOptions.BY_ALERT) {
			models.sort(comparatorForTriggersByAlert);

			models.forEach((model) => {
				model.display.first(false);
				model.display.rowSpan(1);
			});

			const grouped = models.reduce((accumulator, model) => {
				const group = accumulator.find(a => a.alert_id === model.trigger().alert_id) || null;

				if (group === null) {
					accumulator.push({ alert_id: model.trigger().alert_id, triggers: [ model ] });
				} else {
					group.triggers.push(model);
				}

				return accumulator;
			}, [ ]);

			grouped.forEach((group) => {
				group.triggers[0].display.first(true);
				group.triggers[0].display.rowSpan(group.triggers.length);
			});

			sorted = grouped.reduce((acc, g) => {
				return acc.concat(g.triggers);
			}, [ ]);
		} else if (that.triggersSelectedSort() === triggersOrderOptions.BY_DATE) {
			models.sort(comparatorForTriggersByDate);

			models.forEach((model) => {
				model.display.first(true);
				model.display.rowSpan(1);
			});

			sorted = models;
		} else {
			sorted = models;
		}

		return sorted;
	});
	that.triggersFormatted.extend({ rateLimit: 100 });

	that.activeTemplate = ko.observable('alert-disconnected');

	var getAlertModel = function(alert) {
		return _.find(that.alerts(), function(model) {
			return model.alert().alert_id === alert.alert_id;
		});
	};
	var sortAlertModels = function() {
		that.alerts.sort(function(a, b) {
			return a.alert().name.localeCompare(b.alert().name);
		});
	};
	var getTriggerModel = function(trigger) {
		return _.find(that.triggers(), function(model) {
			return model.trigger().alert_id === trigger.alert_id && model.trigger().trigger_date === trigger.trigger_date;
		});
	};

	that.canConnect = ko.computed(function() {
		return !that.connecting() && !that.connected();
	});
	that.canDisconnect = ko.computed(function() {
		return that.connected();
	});


	that.setSocketTransport = () => {
		that.mode('socket.io');
	};
	that.setRestTransport = () => {
		that.mode('rest');
	};

	that.handleConnectKeypress = function(d, e) {
		if (e.keyCode === 13 && !that.connected()) {
			that.connect();
		}

		return true;
	};
	that.connect = function() {
		if (!that.connected() && !that.connecting()) {
			that.message('Attempting to connect...');

			reset(that.host(), that.system(), that.userId(), that.mode());
		}
	};
	that.disconnect = function() {
		if (that.connected()) {
			that.activeTemplate('alert-disconnected');

			currentSystem = null;
			currentUserId = null;

			that.connected(false);
			that.alerts([ ]);

			alertManager.dispose();
			alertManager = null;
		}
	};

	that.changeToGrid = function() {
		if (!that.connected()) {
			return;
		}

		that.activeTemplate('alert-grid-template');
	};
	that.changeToCreate = function() {
		if (!that.connected()) {
			return;
		}

		that.alert = new AlertEntryModel();

		that.activeTemplate('alert-entry-template');
	};
	that.changeToView = function(alertEntryModel) {
		if (!that.connected()) {
			return;
		}

		that.alert = new AlertEntryModel(alertEntryModel.alert());

		that.activeTemplate('alert-entry-template');
	};
	that.changeToPreferences = function() {
		if (!that.connected()) {
			return;
		}

		that.publisherSettings = new AlertPublisherTypeDefaultsModel(publisherTypes());
		that.marketDataSettings = new MarketDataConfigurationModel(marketDataConfiguration());

		that.activeTemplate('alert-preferences-template');
	};
	that.changeToHistory = function() {
		if (!that.connected()) {
			return;
		}

		that.activeTemplate('trigger-history-template');
	};

	that.deleteAlert = function(alertDisplayModel) {
		alertDisplayModel.processing(true);

		alertManager.deleteAlert(alertDisplayModel.alert())
			.then(function() {
				that.alerts.remove(alertDisplayModel);
			});
	};
	that.enableAlerts = function() {
		alertManager.enableAlerts({ alert_system: currentSystem , user_id: currentUserId });
	};
	that.disableAlerts = function() {
		alertManager.disableAlerts({ alert_system: currentSystem , user_id: currentUserId });
	};

	that.handleAlertCreate = function(createdAlert) {
		var existingModel = getAlertModel(createdAlert);

		if (!existingModel) {
			that.alerts.push(new AlertDisplayModel(createdAlert));

			sortAlertModels();
		}
	};
	that.handleAlertChange = function(changedAlert) {
		var existingModel = getAlertModel(changedAlert);

		if (existingModel) {
			existingModel.alert(changedAlert);
		} else {
			that.alerts.push(new AlertDisplayModel(changedAlert));

			sortAlertModels();
		}
	};
	that.handleAlertTrigger = function(triggeredAlert) {
		that.handleAlertChange(triggeredAlert);
	};
	that.handleAlertDelete = function(deletedAlert) {
		var modelToRemove = getAlertModel(deletedAlert);

		that.alerts.remove(modelToRemove);

		that.triggers.remove(function(triggerModel) {
			return triggerModel.trigger().alert_id === modelToRemove.alert().alert_id;
		});
	};
	that.handleTemplateCreate = function(template) {
		console.log('Template created', template);
	};
	that.handleTemplateChange = function(template) {
		console.log('Template changed', template);
	};
	that.handleTemplateDelete = function(template) {
		console.log('Template deleted', template);
	};
	that.handleTriggersCreate = function(triggers) {
		let model;

		triggers.forEach((trigger) => {
			model = new AlertTriggerModel(trigger);

			that.triggers.push(model);
		});

		if (triggers.length === 1) {
			const onclick = (() => {
				let clicked = false;

				return () => {
					if (!clicked) {
						model.toggle();

						clicked = true;
					}
				};
			})();

			toastr.info(triggers[0].trigger_description, triggers[0].trigger_title, { onclick: onclick, progressBar: true });
		}
	};
	that.handleTriggersChange = function(triggers) {
		triggers.forEach((trigger) => {
			const existingModel = getTriggerModel(trigger);

			if (existingModel) {
				existingModel.trigger(trigger);
			} else {
				that.triggers.push(new AlertTriggerModel(trigger));
			}
		});
	};
	that.handleTriggersDelete = function(triggers) {
		const existingModels = triggers
			.map(t => getTriggerModel(t) || null)
			.filter(t => t !== null);

		that.triggers.removeAll(existingModels);
	};

	that.updateTriggers = function(status) {
		return alertManager.updateTriggers({ user_id: currentUserId, alert_system: currentSystem, trigger_status: status });
	};
}
function AlertTriggerModel(trigger) {
	var that = this;

	that.trigger = ko.observable(trigger);

	that.date = ko.computed(function() { return new Date(parseInt(that.trigger().trigger_date)); });
	that.statusDate = ko.computed(function() { return new Date(parseInt(that.trigger().trigger_status_date)); });

	that.loading = ko.observable(false);

	var formatDate = function(date) {
		var returnRef;

		if (date) {
			returnRef = date.toLocaleString();
		} else {
			returnRef = 'never';
		}

		return returnRef;
	};

	that.display = {
		date: ko.computed(function() { return formatDate(that.date()); }),
		first: ko.observable(1),
		read: ko.computed(function() { return that.trigger().trigger_status === 'Read'; }),
		rowSpan: ko.observable(1),
		statusDate: ko.computed(function() { return formatDate(that.statusDate()); })
	};

	that.news = {
		isExist: false
	};

	if (that.trigger().trigger_additional_data && that.trigger().trigger_additional_data.type === 'news' && that.trigger().trigger_additional_data.data.link) {
		that.news.isExist = true;
	}

	that.toggle = function() {
		that.loading(true);

		const payload = { };

		payload.alert_id = that.trigger().alert_id;
		payload.trigger_date = that.date().getTime().toString();
		payload.trigger_status = getOppositeStatus(that.trigger().trigger_status);

		return alertManager.updateTrigger(payload)
			.then(() => {
				that.loading(false);
			});
	};

	function getOppositeStatus(status) {
		return status === 'Read' ? 'Unread' : 'Read';
	}
}
function AlertDisplayModel(alert) {
	var that = this;

	that.alert = ko.observable(alert);
	that.processing = ko.observable(false);

	that.createDate = ko.computed(function() {
		var alert = that.alert();

		var returnRef;

		if (alert.create_date) {
			returnRef = new Date(parseInt(alert.create_date));
		} else {
			returnRef = new Date(0);
		}

		return returnRef;
	});

	that.createDateDisplay = ko.computed(function() {
		var nullDate = new Date(0);

		var returnRef;

		if (that.createDate().getTime() === nullDate.getTime()) {
			returnRef = 'Undefined';
		} else {
			returnRef = that.createDate().toLocaleString();
		}

		return returnRef;
	});

	that.lastTriggerDateDisplay = ko.computed(function() {
		var alert = that.alert();

		var returnRef;

		if (alert.last_trigger_date) {
			var lastTriggerDate = new Date(parseInt(alert.last_trigger_date));

			returnRef = lastTriggerDate.toLocaleString();
		} else {
			returnRef = 'never';
		}

		return returnRef;
	});

	that.canStart = ko.computed(function() {
		var alert = that.alert();

		return alert.alert_state === 'Inactive' || alert.alert_state === 'Triggered' || alert.alert_state === 'Orphaned' || alert.alert_state === 'Expired';
	});
	that.canPause = ko.computed(function() {
		var alert = that.alert();

		return alert.alert_state === 'Active';
	});
	that.canRefresh = ko.computed(function() {
		return !that.canStart() && !that.canPause();
	});

	that.start = function() {
		alertManager.enableAlert(that.alert());
	};
	that.pause = function() {
		alertManager.disableAlert(that.alert());
	};
	that.refresh = function() {
		alertManager.retrieveAlert(that.alert())
			.then(function(refreshedAlert) {
				that.alert(refreshedAlert);
			});
	};
}
function AlertEntryModel(alert) {
	var that = this;

	that.alert = ko.observable(alert || null);
	that.alertType = ko.observable('none');
	that.alertBehavior = ko.observable('terminate');
	that.name = ko.observable(null);
	that.userNotes = ko.observable(null);
	that.createDate = ko.observable(null);
	that.alertSystemKey = ko.observable(null);
	that.conditions = ko.observableArray([]);
	that.publishers = ko.observableArray([]);
	that.schedules = ko.observableArray([]);

	that.processing = ko.observable(false);
	that.error = ko.observable(null);

	that.alertBehaviors = ko.observable([ 'continue', 'continue_daily', 'schedule', 'schedule_once', 'terminate' ]);
	that.alertTypes = ko.observable([ 'none', 'news', 'price', 'match' ]);

	that.showSchedules = ko.computed(function() {
		var ab = that.alertBehavior();

		return ab === 'schedule' || ab === 'schedule_once';
	});

	that.clearAlert = function() {
		that.alert(null);
		that.alertType('none');
		that.alertBehavior('terminate');
		that.name(null);
		that.userNotes(null);
		that.createDate(null);
		that.alertSystemKey(null);
		that.conditions([]);
		that.publishers([]);
		that.schedules([]);
		that.processing(false);
		that.error(null);
	};
	that.createAlert = function() {
		that.processing(true);
		that.error(null);

		var alertType = that.alertType();

		if (alertType === 'none') {
			alertType = null;
		}

		var alertBehavior = that.alertBehavior();

		if (alertType === 'news' && alertBehavior === 'automatic') {
			alertBehavior = null;
		}

		if (alertBehavior === 'automatic') {
			alertBehavior = 'terminate';
		}

		var schedules;

		if (that.showSchedules()) {
			schedules = _.map(that.schedules(), function(schedule) {
				return {
					time: schedule.time(),
					day: schedule.day(),
					timezone: schedule.timezone()
				};
			});
		} else {
			schedules = [ ];
		}

		var alert = {
			alert_type: alertType,
			user_notes: that.userNotes() || null,
			user_id: currentUserId,
			alert_system: currentSystem,
			conditions: _.map(that.conditions(), function(condition) {
				var property = condition.property();
				var operator = condition.operator();
				var operand = condition.operand();

				if (operator.operand_literal) {
					operand = condition.operand();

					if (operator.operand_type === 'Array' && _.isString(operand)) {
						operand = _.map(operand.split(','), function(item) {
							return _.trim(item);
						});
					}

					if (property.type === 'percent') {
						operand = parseFloat(operand) / 100;
						operand = operand.toString();
					}
				}

				var conditionData = {
					property: {
						property_id: property.property_id,
						target: {
							identifier: condition.targetIdentifier()
						}
					},
					operator: {
						operator_id: operator.operator_id,
						operand: operand
					}
				};

				var modifiers = _.filter(condition.modifiers(), function(modifier) {
					return modifier.modifier() !== null;
				});

				if (_.isArray(modifiers) && modifiers.length > 0) {
					conditionData.operator.modifiers = _.map(modifiers, function(modifier) {
						var value = modifier.value();
						var m = modifier.modifier();

						if (m.type === 'percent') {
							value = parseFloat(value) / 100;
							value = value.toString();
						}

						return {
							modifier_id: m.modifier_id,
							value: value
						};
					});
				}

				var qualifiers = condition.qualifiers();

				if (qualifiers.length > 0) {
					conditionData.property.target.qualifiers = _.map(qualifiers, function(qualifier) {
						return qualifier.qualifierValue();
					});
				}

				return conditionData;
			}),
			publishers: _.map(that.publishers(), function(publisher) {
				return {
					type: {
						publisher_type_id: publisher.publisherType().publisher_type_id
					},
					use_default_recipient: publisher.useDefaultRecipient(),
					recipient: publisher.recipient(),
					format: publisher.format()
				};
			}),
			schedules: schedules
		};

		var name = that.name();

		if (_.isString(name) && name.length !== 0) {
			alert.name = name;
		}

		var alertSystemKey = that.alertSystemKey();

		if (_.isString(alertSystemKey) && alertSystemKey !== 0) {
			alert.alert_system_key = alertSystemKey;
		}

		if (alertBehavior !== null) {
			alert.alert_behavior = alertBehavior;
		}

		var executeValidationPromise = function() {
			return _.reduce(
				_.map(_.filter(that.conditions(), function(condition) {
					var property = condition.property();

					return property.target.type === 'symbol';
				}), function(condition) {
					return alertManager.checkSymbol(condition.targetIdentifier(), currentSystem)
						.then((translatedSymbol) => {
							const userSymbol = condition.targetIdentifier();

							if (userSymbol !== translatedSymbol) {
								_.forEach(alert.conditions, function(condition) {
									if (condition.property.target.identifier === userSymbol) {
										condition.property.target.identifier = translatedSymbol;
									}
								});
							}

							return true;
						});
				}), function(aggregatePromise, symbolPromise) {
					var returnRef;

					if (aggregatePromise) {
						returnRef = aggregatePromise.then(function() {
							return symbolPromise;
						});
					} else  {
						returnRef = symbolPromise;
					}

					return returnRef;
				}, null
			);
		};

		var executeCreatePromise = function() {
			return alertManager.createAlert(alert)
				.then(function(created) {
					that.alert(created);
				});
		};

		var promise = executeValidationPromise();

		if (promise === null) {
			promise = executeCreatePromise();
		} else {
			promise = promise.then(function() {
				return executeCreatePromise();
			});
		}

		promise.catch(function(e) {
			that.error(e);
		}).then(function() {
			that.processing(false);
		});
	};

	that.selectAlertType = function(alertType) {
		that.alertType(alertType);
	};
	that.selectAlertBehavior = function(alertBehavior) {
		that.alertBehavior(alertBehavior);
	};
	that.addCondition = function(conditionToAdd) {
		that.conditions.push(new AlertConditionModel(that.ready, conditionToAdd || null));
	};
	that.removeCondition = function(conditionToRemove) {
		that.conditions.remove(conditionToRemove);
	};
	that.addPublisher = function(publisherToAdd) {
		that.publishers.push(new AlertPublisherModel(that.ready, publisherToAdd || null));
	};
	that.removePublisher = function(publisherToRemove) {
		that.publishers.remove(publisherToRemove);
	};
	that.addSchedule = function(scheduleToAdd) {
		that.schedules.push(new AlertScheduleModel(that.ready, scheduleToAdd || null));
	};
	that.removeSchedule = function(scheduleToRemove) {
		that.schedules.remove(scheduleToRemove);
	};

	that.complete = ko.computed(function() {
		return _.isObject(that.alert());
	});
	that.ready = ko.computed(function() {
		return !that.complete() && !that.processing();
	});
	that.canSave = ko.computed(function() {
		return that.ready();
	});

	if (_.isObject(alert)) {
		that.name(alert.name);

		var alertBehavior = alert.alert_behavior || 'terminate';

		that.alertBehavior(alertBehavior);

		if (_.isString(alert.user_notes)) {
			that.userNotes(alert.user_notes);
		}

		if (_.isString(alert.alert_system_key)) {
			that.alertSystemKey(alert.alert_system_key);
		}

		that.alertType(alert.alert_type || 'none');

		that.createDate(new Date(parseInt(alert.create_date)));

		_.forEach(alert.conditions, function(condition) {
			that.addCondition(condition);
		});
		_.forEach(alert.publishers, function(publisher) {
			that.addPublisher(publisher);
		});
		_.forEach(alert.schedules, function(schedule) {
			that.addSchedule(schedule);
		});
	}
}
function AlertScheduleModel(ready, schedule) {
	var that = this;

	that.time = ko.observable(null);

	that.day = ko.observable('Monday');
	that.days = ko.observable(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);

	that.timezones = ko.observable(timezone.getTimezones());
	that.timezone = ko.observable(timezone.guessTimezone());

	that.selectDay = function(day) {
		that.day(day);
	};
	that.selectTimezone = function(timezone) {
		that.timezone(timezone);
	};

	that.ready = ready;

	if (_.isObject(schedule)) {
		that.time(schedule.time);
		that.day(schedule.day);
		that.timezone(schedule.timezone);
	}
}
function AlertConditionModel(ready, condition) {
	var that = this;

	that.target = ko.observable(null);
	that.targetIdentifier = ko.observable(null);

	that.properties = ko.observableArray([]);
	that.property = ko.observable(null);

	that.operator = ko.observable(null);
	that.operand = ko.observable(null);

	that.modifiers = ko.observableArray([]);

	that.ready = ready;

	that.targets = ko.computed(function() {
		return targets();
	});
	that.operators = ko.computed(function() {
		var p = that.property();
		var o = operators() || [ ];

		var returnRef;

		if (p) {
			returnRef = utilities.getOperatorsForProperty(o, p);
		} else {
			returnRef = [ ];
		}

		that.operator(_.first(returnRef) || null);

		return returnRef;
	});
	that.qualifiers = ko.computed(function() {
		var target = that.target();

		var returnRef;

		if (target) {
			return _.map(target.qualifier_descriptions || [], function (description, index) {
				var value;

				if (_.isObject(condition) && _.isArray(condition.property.target.qualifiers)) {
					value = condition.property.target.qualifiers[index];
				} else {
					value = null;
				}

				return new AlertTargetQualifierModel(ready, description, value);
			});
		} else {
			returnRef = [ ];
		}

		return returnRef;
	});
	that.propertyTree = ko.computed(function() {
		var target = that.target();

		var targetProperties;

		if (target) {
			targetProperties = utilities.getPropertiesForTarget(properties(), that.target());
		} else {
			targetProperties = [ ];
		}

		return utilities.getPropertyTree(targetProperties, true);
	});

	that.selectTarget = function(target) {
		that.target(target);

		that.properties([]);
		that.properties.push(new AlertConditionTreeModel(that, that.propertyTree(), 'Property', 0));

		that.property(null);
		that.operator(null);
	};
	that.selectPropertyTree = function(tree, index) {
		if (tree.items) {
			var next = index + 1;

			that.properties.splice(next);
			that.properties.push(new AlertConditionTreeModel(that, tree.items, 'Property', next));

			that.property(null);
			that.operand(null);
		} else {
			that.property(tree.item);
			that.operand(_.first(that.operator().operand_options) || null);
		}
	};
	that.selectOperator = function(operator) {
		that.operator(operator);
		that.operand(_.first(that.operator().operand_options) || null);

		that.modifiers([]);

		if (!operator.modifiers.length !== 0) {
			var all = modifiers();

			var eligible;

			if (all.length > 0 && operator.modifiers.length > 0) {
				eligible = _.filter(all, function(x) {
					return _.some(operator.modifiers, function(e) {
						return x.modifier_id === e;
					});
				});
			} else {
				eligible = [ ];
			}

			that.modifiers.push(new AlertConditionModifierModel(that, eligible));
		}
	};
	that.selectOperand = function(operand) {
		that.operand(operand);
	};

	if (_.isObject(condition)) {
		that.target(_.find(targets(), function(target) {
			return target.target_id === condition.property.target.target_id;
		}));
		that.property(_.find(properties(), function(property) {
			return property.property_id === condition.property.property_id;
		}));
		that.operator(_.find(operators(), function(operator) {
			return operator.operator_id === condition.operator.operator_id;
		}));

		that.targetIdentifier(condition.property.target.identifier);

		var operand = condition.operator.operand_display || condition.operator.operand;

		if (_.isArray(operand)) {
			operand = operand.join(',');
		}

		var p = that.property();

		if (p && p.type === 'percent') {
			operand = parseFloat(operand) * 100;
		}

		that.operand(operand);

		_.forEach(condition.operator.modifiers || [ ], function(modifier) {
			that.modifiers.push(new AlertConditionModifierModel(that, [ modifier ], modifier));
		});

		var getNode = function(items, description) {
			return _.find(items, function(item) {
				return item.description === description;
			});
		};

		var node = { items: that.propertyTree() };
		var descriptionPath = ([ ]).concat(condition.property.category || [ ]).concat(condition.property.description);

		for (var i = 0; i < descriptionPath.length; i++) {
			var n = getNode(node.items, descriptionPath[i]);

			that.properties.push(new AlertConditionTreeModel(that, node.items, 'Property', i, n));

			node = n;
		}
	} else {
		that.selectTarget(_.first(that.targets()));
	}
}
function AlertConditionModifierModel(parent, eligible, m) {
	var that = this;

	that.parent = parent;

	that.modifiers = ko.observable(eligible);
	that.modifier = ko.observable(null);
	that.value = ko.observable(null);

	if (eligible.length > 0) {
		that.modifier(eligible[0]);
	}

	that.selectModifier = function(modifier) {
		that.modifier(modifier);
	};

	that.modifierDisplay = ko.computed(function() {
		var modifier = that.modifier();

		var returnRef;

		if (modifier) {
			returnRef = modifier.display;
		} else {
			returnRef = '--none--';
		}

		return returnRef;
	});
	that.showValue = ko.computed(function() {
		var modifier = that.modifier();

		return modifier !== null;
	});
	that.showPercent = ko.computed(function() {
		var modifier = that.modifier();

		return modifier !== null && modifier.type === 'percent';
	});

	if (_.isObject(m) && m.value) {
		var v = m.value;

		if (m.type === 'percent') {
			v = parseFloat(v) * 100;
		}

		that.modifier(m);
		that.value(v);
	}
}
function AlertTargetQualifierModel(ready, description, value) {
	var that = this;

	that.ready = ready;

	that.qualifierDescription = ko.observable(description);
	that.qualifierValue = ko.observable(value || null);
}
function AlertConditionTreeModel(parent, tree, description, index, node) {
	var that = this;

	that.parent = parent;

	that.tree = ko.observable(tree);
	that.node = ko.observable(node || null);

	that.description = ko.computed(function() {
		var property = that.node();

		var returnRef;

		if (property) {
			returnRef = property.description;
		} else {
			returnRef = 'Select ' + description;
		}

		return returnRef;
	});

	that.selectTree = function(node) {
		that.node(node);

		that.parent.selectPropertyTree(node, index);
	};

	that.showOperator = ko.computed(function() {
		var node = that.node();

		var property = that.parent.property();
		var operator = that.parent.operator();

		return _.isObject(node) && _.isObject(node.item) && node.item === property && _.isObject(operator) && operator.operator_type === 'binary';
	});
	that.showOptions = ko.computed(function() {
		var operator = that.parent.operator();

		return _.isObject(operator) && _.isArray(operator.operand_options) && operator.operand_options.length > 0;
	});
	that.showModifiers = ko.computed(function() {
		var node = that.node();

		var property = that.parent.property();
		var operator = that.parent.operator();

		return _.isObject(node) && _.isObject(node.item) && node.item === property && _.isObject(operator) && operator.modifiers.length > 0;
	});
	that.showPercent = ko.computed(function() {
		var property = that.parent.property();

		return property !== null && property.type === 'percent';
	});
}
function AlertPublisherModel(ready, publisher) {
	var that = this;

	that.publisherTypes = publisherTypes;
	that.publisherType = ko.observable(_.first(that.publisherTypes()));
	that.useDefaultRecipient = ko.observable(false);
	that.recipient = ko.observable();
	that.format = ko.observable();

	that.ready = ready;

	that.selectPublisherType = function(publisherType) {
		that.publisherType(publisherType);
	};

	that.toggleDefaultRecipient = function() {
		if (!ready() || !_.isString(that.publisherType().default_recipient)) {
			return;
		}

		that.useDefaultRecipient(!that.useDefaultRecipient());

		if (that.useDefaultRecipient()) {
			that.recipient(that.publisherType().default_recipient);
		} else {
			that.recipient('');
		}
	};

	that.recipientReady = ko.computed(function() {
		var ready = that.ready();
		var useDefaultRecipient = that.useDefaultRecipient();

		return ready && !useDefaultRecipient;
	});

	if (_.isObject(publisher)) {
		that.publisherType(_.find(publisherTypes(), function(candidate) {
			return candidate.publisher_type_id === publisher.type.publisher_type_id;
		}));

		that.useDefaultRecipient(publisher.use_default_recipient);
		that.recipient(publisher.recipient);
		that.format(publisher.format);
	}
}
function AlertPublisherTypeDefaultsModel(publisherTypeDefaults) {
	var that = this;

	that.processing = ko.observable(false);

	that.ready = ko.computed(function() {
		return !that.processing();
	});

	that.publisherTypeDefaults = ko.observable(_.map(publisherTypeDefaults, function(publisherTypeDefault) {
		return new AlertPublisherTypeDefaultModel(publisherTypeDefault, that.ready);
	}));

	that.savePreferences = function() {
		var defaultPublisherTypes = that.publisherTypeDefaults();
		var publishersToSave = defaultPublisherTypes.length;

		var checkComplete = function() {
			publishersToSave = publishersToSave - 1;

			if (publishersToSave === 0) {
				alertManager.getPublisherTypeDefaults({ user_id: currentUserId, alert_system: currentSystem })
					.then(function(saved) {

						_.forEach(saved, function(s) {
							_.forEach(that.publisherTypeDefaults(), function(m) {
								if (s.publisher_type_id === m.publisherTypeId()) {
									m.update(s);
								}
							});
						});

						that.processing(false);
					});
			}
		};

		if (publishersToSave.length !== 0) {
			that.processing(true);

			_.forEach(defaultPublisherTypes, function(defaultPublisherType) {
				if (_.isString(defaultPublisherType.defaultRecipient())) {
					var activeAlertTypes = [ ];

					if (defaultPublisherType.priceActive()) {
						activeAlertTypes.push('price');
					}

					if (defaultPublisherType.newsActive()) {
						activeAlertTypes.push('news');
					}

					if (defaultPublisherType.matchActive()) {
						activeAlertTypes.push('match');
					}

					var ptd = {
						publisher_type_id: defaultPublisherType.publisherTypeId(),
						alert_system: currentSystem,
						user_id: currentUserId,
						default_recipient: defaultPublisherType.defaultRecipient(),
						allow_window_timezone: defaultPublisherType.allowTimezone() || null,
						allow_window_start: defaultPublisherType.allowStartTime() || null,
						allow_window_end: defaultPublisherType.allowEndTime() || null,
						active_alert_types: activeAlertTypes
					};

					var hmac = defaultPublisherType.defaultRecipientHmac();

					if (_.isString(hmac) && hmac.length > 0) {
						ptd.default_recipient_hmac = hmac;
					}

					var actionPromise;

					if (ptd.default_recipient) {
						actionPromise = alertManager.assignPublisherTypeDefault(ptd);
					} else {
						actionPromise = alertManager.deletePublisherTypeDefault(ptd);
					}

					actionPromise.then(function(savedPublisherTypeDefault) {
						checkComplete();
					});
				} else {
					checkComplete();
				}
			});
		}
	};
}
function AlertPublisherTypeDefaultModel(publisherTypeDefault, ready) {
	var that = this;

	that.publisherTypeId = ko.observable(publisherTypeDefault.publisher_type_id);
	that.transport = ko.observable(publisherTypeDefault.transport);
	that.provider = ko.observable(publisherTypeDefault.provider);

	that.defaultRecipient = ko.observable();
	that.defaultRecipientHmac = ko.observable();
	that.allowTimezone = ko.observable();
	that.allowStartTime = ko.observable();
	that.allowEndTime = ko.observable();
	that.priceActive = ko.observable();
	that.newsActive = ko.observable();
	that.matchActive = ko.observable();

	that.update = function(ptd) {
		that.defaultRecipient(ptd.default_recipient);
		that.defaultRecipientHmac(ptd.default_recipient_hmac);
		that.allowTimezone(ptd.allow_window_timezone || timezone.guessTimezone());
		that.allowStartTime(ptd.allow_window_start);
		that.allowEndTime(ptd.allow_window_end);
		that.priceActive(_.includes(ptd.active_alert_types, 'price'));
		that.newsActive(_.includes(ptd.active_alert_types, 'news'));
		that.matchActive(_.includes(ptd.active_alert_types, 'match'));
	};

	that.selectTimezone = function(timezone) {
		that.allowTimezone(timezone);
	};

	that.ready = ready;

	that.timezones = ko.observable(timezone.getTimezones());

	that.update(publisherTypeDefault);
}
function MarketDataConfigurationModel(mdc) {
	var that = this;

	that.processing = ko.observable(false);

	that.ready = ko.computed(function() {
		return !that.processing();
	});

	that.userId = ko.observable(currentUserId);
	that.systemId = ko.observable(currentSystem);
	that.marketDataId = ko.observable(null);

	that.savePreferences = function() {
		that.processing(true);

		alertManager.assignMarketDataConfiguration({ user_id: currentUserId, alert_system: currentSystem, market_data_id: that.marketDataId() })
			.then(function(mdc) {
				marketDataConfiguration(mdc);

				that.processing(false);
			});
	};

	if (mdc && mdc.market_data_id) {
		that.marketDataId(mdc.market_data_id);
	}
}

var reset = function(host, system, userId, mode) {
	ko.cleanNode($('body')[0]);

	return Promise.resolve()
		.then(() => {
			let port;
			let secure;

			if (host && host === 'localhost') {
				port = 3010;
				secure = false;
			} else {
				port = 443;
				secure = true;
			}

			let adapterClazz;

			if (mode === 'socket.io') {
				adapterClazz = AdapterForSocketIo;
			} else {
				adapterClazz = AdapterForHttp;
			}

			if (host) {
				alertManager = new AlertManager(host, port, secure, adapterClazz);
			} else {
				alertManager = null;
			}
		}).then(() => {
			var pageModel = new PageModel(host, system, userId);

			if (mode) {
				pageModel.mode(mode);
			}

			var initializePromise;

			if (alertManager) {
				pageModel.connecting(true);

				var jwtGenerator = getJwtGenerator(userId, system);
				var jwtProvider = new JwtProvider(jwtGenerator, 60000);

				alertManager.subscribeConnectionStatus(function(status) {
					console.log('Connection status changed to [', status, ']');
				});

				initializePromise = alertManager.connect(jwtProvider)
					.then(function() {
						if (!(system === 'barchart.com' || system === 'grains.com' || system === 'webstation.barchart.com' || system === 'gos.agricharts.com' || system === 'gbemembers.com' || system === 'cmdtymarketplace.com' || system === 'theglobeandmail.com')) {
							throw 'Invalid system, please re-enter...';
						}

						if (!userId) {
							throw 'Invalid user, please re-enter...';
						}

						var startupPromises = [ ];

						alertManager.subscribeAlerts({ user_id: userId, alert_system: system },
							function(changedAlert) {
								pageModel.handleAlertChange(changedAlert);
							},
							function(deletedAlert) {
								pageModel.handleAlertDelete(deletedAlert);
							},
							function(createdAlert) {
								pageModel.handleAlertCreate(createdAlert);
							},
							function(triggeredAlert) {
								pageModel.handleAlertTrigger(triggeredAlert);
							}
						);

						alertManager.subscribeTemplates({ user_id: userId, alert_system: system },
							function(changedTemplate) {
								pageModel.handleTemplateChange(changedTemplate);
							},
							function(deletedTemplate) {
								pageModel.handleTemplateDelete(deletedTemplate);
							},
							function(createdTemplate) {
								pageModel.handleTemplateCreate(createdTemplate);
							}
						);

						alertManager.subscribeTriggers({ user_id: userId, alert_system: system, trigger_date: getDateBackwards(7).getTime() },
							function(changedTriggers) {
								pageModel.handleTriggersChange(changedTriggers);
							},
							function(deletedTriggers) {
								pageModel.handleTriggersDelete(deletedTriggers);
							},
							function(createdTriggers) {
								pageModel.handleTriggersCreate(createdTriggers);
							}
						);

						startupPromises.push(
							alertManager.getUser()
								.then(function(data) {
									if (data.user_id && data.alert_system) {
										pageModel.authenticatedUser(`${data.user_id}@${data.alert_system}`);
									}
								})
						);

						startupPromises.push(
							alertManager.getServerVersion()
								.then(function(data) {
									pageModel.version({ api: data.semver, sdk: AlertManager.version });
								})
						);

						startupPromises.push(
							alertManager.getTargets()
								.then(function(t) {
									targets(t);
								})
						);

						startupPromises.push(
							alertManager.getProperties()
								.then(function(p) {
									properties(p);
								})
						);

						startupPromises.push(
							alertManager.getOperators()
								.then(function(o) {
									o.forEach((item) => {
										item.display.compound = item.display.short;

										if (item.operator_type === 'binary') {
											if (item.operand_literal) {
												item.display.compound = item.display.compound + ' [ value ]';
											} else {
												item.display.compound = item.display.compound + ' [ field ]';
											}
										}
									});

									operators(o);
								})
						);

						startupPromises.push(
							alertManager.getModifiers()
								.then(function(m) {
									modifiers(m);
								})
						);

						startupPromises.push(
							alertManager.getPublisherTypeDefaults({ user_id: userId, alert_system: system })
								.then(function(pt) {
									publisherTypes(pt);
								})
						);

						startupPromises.push(
							alertManager.getMarketDataConfiguration({ user_id: userId, alert_system: system })
								.then(function(mdc) {
									marketDataConfiguration(mdc);
								})
						);

						return Promise.all(startupPromises)
							.then(() => {
								pageModel.connected(true);
								pageModel.changeToGrid();
							});
					}).catch((e) => {
						console.log(e);

						alertManager.dispose();
						alertManager = null;

						pageModel.connected(false);
						pageModel.activeTemplate('alert-disconnected');

						if (typeof e === 'string') {
							pageModel.message(e);
						} else {
							pageModel.message('Unable to connect. Try again...');
						}
					}).then(() => {
						pageModel.connecting(false);
					});
			} else {
				initializePromise = Promise.resolve();
			}

			return initializePromise.then(() => {
				ko.applyBindings(pageModel, $('body')[0]);
			});
		});
};

var triggersOrderOptions = {
	BY_ALERT: 'Order by Alert',
	BY_DATE: 'Order by Date'
};

var comparatorForAlerts = ComparatorBuilder
	.startWith((modelA, modelB) => comparators.compareDates(modelB.createDate(), modelA.createDate()))
	.toComparator();

var comparatorForTriggersByAlert = ComparatorBuilder
	.startWith((modelA, modelB) => comparators.compareStrings(modelA.trigger().alert_id, modelB.trigger().alert_id))
	.thenBy((modelA, modelB) => comparators.compareDates(modelB.date(), modelA.date()))
	.toComparator();

var comparatorForTriggersByDate = ComparatorBuilder
	.startWith((modelA, modelB) => comparators.compareDates(modelB.date(), modelA.date()))
	.toComparator();

var getDateBackwards = function(days) {
	const now = new Date();
	const past = now.getDate() - days;

	now.setDate(past);

	return now;
};

$(document).ready(function() {
	reset(null, null, null, null);
});