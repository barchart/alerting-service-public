const AlertBuilder = require('../../../lib/builder/builders/AlertBuilder');

const AlertManager = require('../../../lib/AlertManager'),
	AdapterForHttp = require('./../../../lib/adapters/AdapterForHttp'),
	JwtProvider = require('../../../lib/security/JwtProvider'),
	getJwtGenerator = require('../../../lib/security/demo/getJwtGenerator');

const jwtGenerator = getJwtGenerator('00000000', 'barchart.com');
const jwtProvider = new JwtProvider(jwtGenerator, 60000);
const host = 'alerts-management-demo.barchart.com';
const port = 443;
const secure = true;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

let operators = [];
let properties = [];
let types = [];

describe('When constructing a AlertBuilder', () => {
	let alertBuilder;

	beforeAll(() => {
		let alertManager = new AlertManager(host, port, secure, AdapterForHttp);
		return alertManager.connect(jwtProvider).then((manager) => {
			alertManager = manager;

			return Promise.resolve()
				.then(() => {
					return Promise.all([
						alertManager.getProperties(),
						alertManager.getOperators(),
						alertManager.getPublisherTypes()
					]).then((data) => {
						properties = data[0];
						operators = data[1];
						types = data[2];

						return true;
					});
				});
		});
	});

	beforeEach(() => {
		alertBuilder = new AlertBuilder(operators, properties, types);
	});

	describe('and name is added', () => {
		it('builder should have a name field', () => {
			const name = 'test alert name';
			const alert = alertBuilder.withName(name).build();

			expect(alert.name).toEqual(name);
		});
	});

	describe('and alert_system is added', () => {
		it('builder should have an alert_system field', () => {
			const alertSystem = 'barchart.com';
			const alert = alertBuilder.withAlertSystem(alertSystem).build();

			expect(alert.alert_system).toEqual(alertSystem);
		});
	});

	describe('and user_id is added', () => {
		it('builder should have an user_id field', () => {
			const userId = '00000000';
			const alert = alertBuilder.withUserId(userId).build();

			expect(alert.user_id).toEqual(userId);
		});
	});

	describe('and user_notes are added', () => {
		it('builder should have an user_notes field', () => {
			const userNotes = 'just some notes';
			const alert = alertBuilder.withUserNotes(userNotes).build();

			expect(alert.user_notes).toEqual(userNotes);
		});
	});

	describe('and alert_behavior are added', () => {
		it('builder should have an alert_behavior field', () => {
			const alertBehavior = 'schedule';
			const alert = alertBuilder.withAlertBehavior(alertBehavior).build();

			expect(alert.alert_behavior).toEqual(alertBehavior);
		});
	});

	describe('and conditions are added', () => {
		it('builder should have an conditions field', () => {
			const expectedCondition = {
				'property': {
					'property_id': 2,
					'target': {
						'identifier': 'TSLA',
						'display': 'TSLA-Q'
					}
				},
				'operator': {
					'operator_id': 2,
					'operand': '20',
					'modifiers': [
						{
							'modifier_id': 1,
							'value': '5'
						}
					]
				}
			};

			const alert = alertBuilder.withConditionBuilder((cb) => {
				cb.withPropertyBuilder((pb) => {
					pb.withProperty('openPrice')
						.withIdentifier('TSLA')
						.withDisplay('TSLA-Q');
				})
					.withOperatorBuilder((ob) => {
						ob.withOperator('greater-than')
							.withOperand('20')
							.withModifierBuilder((mb) => {
								mb.withModifier(1)
									.withValue('5');
							});
					});
			}).build();

			expect(alert.conditions.length).toEqual(1);
			expect(alert.conditions[0]).toEqual(expectedCondition);
		});
	});

	describe('and publisher are added', () => {
		it('builder should have an publishers field', () => {
			const expectedPublisher = {
				recipient: '375259634424',
				use_default_recipient: false,
				type: {
					publisher_type_id: 1
				},
				format: 'hello',
				title: null
			};

			const alert = alertBuilder.withPublisherBuilder((pb) => {
				pb.withRecipient('375259634424')
					.withFormat('hello')
					.withType('sms');
			}).build();

			expect(alert.publishers.length).toEqual(1);
			expect(alert.publishers[0]).toEqual(expectedPublisher);
		});
	});


	describe('and alert builder was exported into JSON, and fromJSON function was executed', () => {
		it('new builder should have the same fields as original builder', () => {
			const name = 'test alert name';
			const alertSystem = 'barchart.com';
			const alertBehavior = 'schedule';
			const userId = '00000000';
			const userNotes = 'just some notes';
			const type = 'price';

			const alert = alertBuilder.withName(name)
				.withAlertSystem(alertSystem)
				.withUserId(userId)
				.withUserNotes(userNotes)
				.withAlertType(type)
				.withAlertBehavior(alertBehavior)
				.withConditionBuilder((cb) => {
					cb.withPropertyBuilder((pb) => {
						pb.withProperty('openPrice')
							.withIdentifier('TSLA');
					})
						.withOperatorBuilder((ob) => {
							ob.withOperator('greater-than')
								.withOperand('20')
								.withModifierBuilder((mb) => {
									mb.withModifier(1)
										.withValue('5');
								});
						});
				})
				.withPublisherBuilder((pb) => {
					pb.withRecipient('375259634424')
						.withFormat('hello')
						.withUseDefaultRecipient()
						.withType('sms');
				}).build();

			const builder = AlertBuilder.fromJSON(alert, operators, properties, types);

			expect(builder).toEqual(alertBuilder);
		});
	});

	describe('and set invalid operator', () => {
		it('should throw an error', () => {
			const fn = () => {
				alertBuilder.withConditionBuilder((cb) => {
					cb.withPropertyBuilder((pb) => {
						pb.withProperty('openPrice')
							.withIdentifier('TSLA');
					})
						.withOperatorBuilder((ob) => {
							ob.withOperator('crosses')
								.withOperand('20');
						});
				});
			};

			expect(fn).toThrow(new Error('The operator is not valid for the selected property.'));
		});
	});

	describe('and set unsupported operator', () => {
		it('should throw an error', () => {
			const fn = () => {
				alertBuilder.withConditionBuilder((cb) => {
					cb.withPropertyBuilder((pb) => {
						pb.withProperty('openPrice')
							.withIdentifier('TSLA');
					})
						.withOperatorBuilder((ob) => {
							ob.withOperator('unknown')
								.withOperand('20');
						});
				});
			};

			expect(fn).toThrow(new Error('Operator [ unknown ] not found.'));
		});
	});

	describe('and set unsupported property', () => {
		it('should throw an error', () => {
			const fn = () => {
				alertBuilder.withConditionBuilder((cb) => {
					cb.withPropertyBuilder((pb) => {
						pb.withProperty('unknown')
							.withIdentifier('TSLA');
					})
						.withOperatorBuilder((ob) => {
							ob.withOperator('greater-than')
								.withOperand('20');
						});
				});
			};

			expect(fn).toThrow(new Error('Property [ unknown ] not found.'));
		});
	});

	describe('and set unsupported publisher type', () => {
		it('should throw an error', () => {
			const fn = () => {
				alertBuilder.withPublisherBuilder((pb) => {
					pb.withRecipient('375259634424')
						.withFormat('hello')
						.withType('unknown');
				});
			};

			expect(fn).toThrow(new Error('Publisher type [ unknown ] not found.'));
		});
	});
});