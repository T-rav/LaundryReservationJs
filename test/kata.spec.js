describe("CreateReservation", function () {
	it("should send a reservation confirmation email", function () {
		// arrange
		let reservationID = 2;
		let pinService = new pinGenerationService();
		let machine = new Machine(3);
		let machineService = new MachineService(machine);
		let mailService = new emailService();
		let persistence = CreatePersistence(reservationID);
		let reservation = new Reservation(machineService, pinService, mailService, persistence);
		let dateTime = "18/5/2018 19:00";
		let cell = "123456789";
		let email = "this@test.com";
		spyOn(machineService, "find_Machine").and.returnValue(machine);
		spyOn(pinService, "generate").and.returnValue(34563);
		spyOn(mailService, "sendEmail");
		// act
		reservation.create(dateTime, cell, email);
		// assert
		let pin = 34563;
		expect(mailService.sendEmail).toHaveBeenCalledWith(machine.number, pin, reservationID, email);
	});

	it("Should save a reservation to the DB", function () {
		// arrange
		let machineNumber = 3;
		let pin = 53252;
		let dateTime = "18/5/2018 19:00";
		let cell = "123456789";
		let email = "this@test.com";

		let persistence = CreatePersistence();
		
		let reservation = createReservation(machineNumber, pin, persistence);
		// act
		reservation.create(dateTime, cell, email);
		// assert
		expect(persistence.saveReservation).toHaveBeenCalledWith(machineNumber, pin, dateTime, cell, email);
	});

	it("should lock machine", function () {
		// arrange
		let pinService = new pinGenerationService();
		let machine = new Machine(2);
		let machineService = new MachineService(machine);
		let mailService = new emailService();
		let persistence = CreatePersistence();
		let reservation = new Reservation(machineService, pinService, mailService, persistence);
		let dateTime = "18/5/2018 19:00";
		let cell = "123456789";
		let email = "this@test.com";
		spyOn(machine, "lock").and.returnValue(true);
		spyOn(machineService, "find_Machine").and.returnValue(machine);
		spyOn(pinService, "generate").and.returnValue(53252);

		// act
		reservation.create(dateTime, cell, email);
		// assert
		expect(machine.lock).toHaveBeenCalledWith(dateTime);
	});

	function createReservation(machineNumber, pinNumber, persistence) {
		let machine = new Machine(machineNumber);

		let machineService = new MachineService(machine);
		spyOn(machineService, "find_Machine").and.returnValue(machine);

		let pinService = new pinGenerationService();
		spyOn(pinService, "generate").and.returnValue(pinNumber);

		let mailService = new emailService();

		return new Reservation(machineService, pinService, mailService, persistence);
	}

    function CreatePersistence(reservationID) {
	    let persistence = new persistenceService();
		spyOn(persistence, "saveReservation").and.returnValue(reservationID);
		return persistence;
    }
});




 function CreateReservationService(){
	let _pinService = new pinGenerationService();
	let machineService = new MachineService();
	let machineLock = new Machine();
	let mailService = new emailService();
	let persistence = new persistenceService();
	let self = this;

	self.withPinService = function(pinService)
	{
		_pinService = pinService;
		return self;
	};

	self.build = function(){
		return new Reservation(machineService, _pinService, machineLock, mailService, persistence);
	};
}
