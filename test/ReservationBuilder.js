function ReservationBuilder() {
	let _pinService = new pinGenerationService();
	let _machineService = new MachineService();
	let _mailService = new emailService();
	let _persistence = new persistenceService();
	let self = this;

	self.withPinService = function (pinService) {
		_pinService = pinService;
		return self;
	};

	self.withPinNumber = function (pinNumber) {
		_pinService = new pinGenerationService();
		spyOn(_pinService, "generate").and.returnValue(pinNumber);
		return self;
	};

	self.withPersistence = function (persistence) {
		_persistence = persistence;
		return self;
	};

	self.withMachineNumber = function (machineNumber) {
		let machine = new Machine(machineNumber);
		createMachineService(machine);
		return self;
	};

	self.withMachine = function(machine)
	{
		createMachineService(machine);
		spyOn(machine,"lock").and.returnValue(true);
		return self;
	}

	self.withReservationId = function (reservationId) {
		spyOn(_persistence, "saveReservation").and.returnValue(reservationId);
		return self;
	}

	self.withMailService = function (mailService) {
		_mailService = mailService;
		return self;
	}

	self.withMachineService = function (machineService) {
		_machineService = machineService;
		return self;
	}

	self.build = function () {
		return new Reservation(_machineService, _pinService, _mailService, _persistence);
	};


	function createMachineService(machine) {
		_machineService = new MachineService(machine);
		spyOn(_machineService, "find_Machine").and.returnValue(machine);
	}
}
