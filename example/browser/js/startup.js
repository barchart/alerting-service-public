const AlertManager = require('./../../../lib/AlertManager');

const AdapterForHttp = require('./../../../lib/adapters/AdapterForHttp'),
	AdapterForSocketIo = require('./../../../lib/adapters/AdapterForSocketIo');

const JwtProvider = require('./../../../lib/security/JwtProvider'),
	getJwtGenerator = require('./../../../lib/security/demo/getJwtGenerator');

const timezone = require('@barchart/common-js/lang/timezone');

const ComparatorBuilder = require('@barchart/common-js/collections/sorting/ComparatorBuilder'),
	comparators = require('@barchart/common-js/collections/sorting/comparators');

module.exports = (() => {
	'use strict';

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

		that.host = ko.observable(host || 'localhost');
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
		that.publisherSettings = ko.observable();
		that.marketDataSettings = ko.observable();
		that.providerDescription = ko.observable(alertManager !== null ? alertManager.toString() : '');

		that.triggers = ko.observableArray([ ]);
		that.triggerUpdates = ko.observable(0);
		that.triggersFormatted = ko.computed(function() {
			const triggers = that.triggers().slice(0);

			triggers.sort(comparatorForAlertTriggers);

			triggers.forEach((trigger) => {
				trigger.first = ko.observable(false);
				trigger.rowSpan = 1;
			});

			const grouped = triggers.reduce((accumulator, trigger) => {
				const group = accumulator.find(a => a.alertId === trigger.alertId) || null;

				if (group === null) {
					accumulator.push({ alertId: trigger.alertId, triggers: [ trigger ] });
				} else {
					group.triggers.push(trigger);
				}

				return accumulator;
			}, [ ]);

			grouped.forEach((group) => {
				group.triggers[0].first(true);
				group.triggers[0].rowSpan = group.triggers.length;
			});

			const flattened = grouped.reduce((acc, g) => {
				return acc.concat(g.triggers);
			}, [ ]);

			return flattened;
		});
		that.triggersFormatted.extend({ rateLimit: 100 });

		that.activeTemplate = ko.observable('alert-disconnected');

		var getModel = function(alert) {
			return _.find(that.alerts(), function(model) {
				return model.alert().alert_id === alert.alert_id;
			});
		};
		var sortModels = function() {
			that.alerts.sort(function(a, b) {
				return a.alert().name.localeCompare(b.alert().name);
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
			var existingModel = getModel(createdAlert);

			if (!existingModel) {
				that.alerts.push(new AlertDisplayModel(createdAlert));

				sortModels();
			}
		};
		that.handleAlertChange = function(changedAlert) {
			var existingModel = getModel(changedAlert);

			if (existingModel) {
				existingModel.alert(changedAlert);
			} else {
				that.alerts.push(new AlertDisplayModel(changedAlert));

				sortModels();
			}
		};
		that.handleAlertTrigger = function(triggeredAlert) {
			that.handleAlertChange(triggeredAlert);

			that.triggerUpdates(that.triggerUpdates() + 1);

			toastr.info('Alert Triggered: ' + triggeredAlert.name);
		};
		that.handleAlertDelete = function(deletedAlert) {
			var modelToRemove = getModel(deletedAlert);

			that.triggerUpdates(that.triggerUpdates() + 1);

			that.alerts.remove(modelToRemove);
		};

		that.refreshTriggerHistory = function() {
			that.triggers.removeAll();

			return alertManager.retrieveTriggers({ user_id: userId, alert_system: system, trigger_date: getDateBackwards(7).getTime() })
				.then(function(triggers) {
					that.triggerUpdates(0);

					triggers.forEach((trigger) => {
						that.addTrigger(trigger);
					});
				});
		};
		that.addTrigger = function(trigger) {
			that.triggers.push(new AlertTriggerModel(trigger));
		};
		that.changeTriggersStatus = function(status) {
			that.triggers.removeAll();

			return alertManager.updateTriggers({ user_id: currentUserId, alert_system: currentSystem, trigger_status: status })
				.then(() => {})
				.catch((error) => { console.log(error); })
				.then(() => {
					that.refreshTriggerHistory();
				});
		};
	}
	function AlertTriggerModel(trigger) {
		var that = this;

		that.alertId = trigger.alert_id;
		that.date = new Date(parseInt(trigger.trigger_date));
		that.name = trigger.trigger_name;
		that.status = ko.observable(trigger.trigger_status);
		that.statusDate = new Date(parseInt(trigger.trigger_status_date));

		that.loading = ko.observable(false);

		var formatDate = function(field) {
			var returnRef;

			if (that[field]) {
				returnRef = that[field].toLocaleString();
			} else {
				returnRef = 'never';
			}

			return returnRef;
		};

		that.dateDisplay = ko.computed(function() { return formatDate('date'); });
		that.statusDateDisplay = ko.computed(function() { return formatDate('statusDate'); });

		that.toggle = function() {
			that.loading(true);

			const payload = { };

			payload.alert_id = that.alertId;
			payload.trigger_date = that.date.getTime();
			payload.trigger_status = getOppositeStatus(that.status());

			return alertManager.updateTrigger(payload)
				.then(() => {
					that.status(payload.trigger_status);

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

		that.lastTriggerDateDisplay = ko.computed(function() {
			var alert = that.alert();

			var returnRef;

			if (alert.last_trigger_date) {
				var lastTriggerDate = new Date(parseInt(alert.last_trigger_date));

				returnRef = lastTriggerDate.toString();
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

		that.alertBehaviors = ko.observable([ 'terminate', 'schedule', 'automatic' ]);
		that.alertTypes = ko.observable([ 'none', 'news', 'price', 'match' ]);

		that.automaticReset = ko.computed(function() {
			return that.alertBehavior() === 'automatic';
		});

		that.showSchedules = ko.computed(function() {
			return that.alertBehavior() === 'schedule';
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

			if (alertBehavior === 'schedule') {
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
				automatic_reset: that.automaticReset(),
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
						return alertManager.checkSymbol(condition.targetIdentifier())
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

			var alertBehavior = alert.alert_behavior || terminate;

			if (alertBehavior === 'terminate' && alert.automatic_reset) {
				alertBehavior = 'automatic';
			}

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
						.then(function(pt) {
							publisherTypes(pt);

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

						alertManager.assignPublisherTypeDefault(ptd)
							.then(function(savedPublisherTypeDefault) {
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

		that.ready = ready;

		that.timezones = ko.observable(timezone.getTimezones());

		that.publisherTypeId = ko.observable(publisherTypeDefault.publisher_type_id);
		that.transport = ko.observable(publisherTypeDefault.transport);
		that.provider = ko.observable(publisherTypeDefault.provider);
		that.defaultRecipient = ko.observable(publisherTypeDefault.default_recipient);
		that.defaultRecipientHmac = ko.observable(publisherTypeDefault.default_recipient_hmac);
		that.allowTimezone = ko.observable(publisherTypeDefault.allow_window_timezone || timezone.guessTimezone());
		that.allowStartTime = ko.observable(publisherTypeDefault.allow_window_start);
		that.allowEndTime = ko.observable(publisherTypeDefault.allow_window_end);
		that.priceActive = ko.observable(_.includes(publisherTypeDefault.active_alert_types, 'price'));
		that.newsActive = ko.observable(_.includes(publisherTypeDefault.active_alert_types, 'news'));
		that.matchActive = ko.observable(_.includes(publisherTypeDefault.active_alert_types, 'match'));

		that.selectTimezone = function(timezone) {
			that.allowTimezone(timezone);
		};
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
					port = 3000;
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
					var jwtProvider = new JwtProvider(jwtGenerator, 60000, 'demo');

					initializePromise = alertManager.connect(jwtProvider)
						.then(function() {
							if (!(system === 'barchart.com' || system === 'grains.com' || system === 'webstation.barchart.com' || system === 'gos.agricharts.com' || system === 'gbemembers.com' || system === 'cmdtymarketplace.com')) {
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

							alertManager.subscribeTriggers({ user_id: userId, alert_system: system },
								function(changedTrigger) {
									console.log('Trigger Changed', JSON.stringify(changedTrigger));
								},
								function(deletedTrigger) {
									console.log('Trigger Deleted', JSON.stringify(deletedTrigger));
								},
								function(createdTrigger) {
									console.log('Trigger Created', JSON.stringify(createdTrigger));
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

							startupPromises.push(
								pageModel.refreshTriggerHistory()
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

	var comparatorForAlertTriggers =	ComparatorBuilder
		.startWith((a, b) => comparators.compareDates(b.date, a.date))
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
})();
