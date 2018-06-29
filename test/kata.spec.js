describe("CreateReservation", function () {
	it("should send a reservation confirmation email", function () {
		// arrange
		let reservationID = 2;
		let machineNumber = 3;
		let pin = 34563;
		let dateTime = "18/5/2018 19:00";
		let cell = "123456789";
		let email = "this@test.com";

		let mailService = CreateEmailService();

		let reservation = new ReservationBuilder()
			.withMachineNumber(machineNumber)
			.withPinNumber(pin)
			.withMailService(mailService)
			.withReservationId(reservationID)
			.build();

		// act
		reservation.create(dateTime, cell, email);

		// assert
		expect(mailService.sendEmail).toHaveBeenCalledWith(machineNumber, pin, reservationID, email);
	});

	it("Should save a reservation to the DB", function () {
		// arrange
		let machineNumber = 3;
		let pin = 53252;
		let dateTime = "18/5/2018 19:00";
		let cell = "123456789";
		let email = "this@test.com";
		let reservationID = 2;
		let persistence = CreatePersistence(reservationID);

		let reservation = new ReservationBuilder()
			.withMachineNumber(machineNumber)
			.withPinNumber(pin)
			.withPersistence(persistence)
			.build();

		// act
		reservation.create(dateTime, cell, email);

		// assert
		expect(persistence.saveReservation).toHaveBeenCalledWith(machineNumber, pin, dateTime, cell, email);
	});

	it("should lock machine", function () {
		// arrange
		let dateTime = "18/5/2018 19:00";
		let cell = "123456789";
		let email = "this@test.com";
		let machine = new Machine();

		let reservation = new ReservationBuilder()
			.withMachine(machine)
			.build();
			
		// act
		reservation.create(dateTime, cell, email);

		// assert
		expect(machine.lock).toHaveBeenCalledWith(dateTime);
	});

	function CreatePersistence(reservationID) {
		let persistence = new persistenceService();
		spyOn(persistence, "saveReservation").and.returnValue(reservationID);
		return persistence;
	}
});

function CreateEmailService() {
	let mailService = new emailService();
	spyOn(mailService, "sendEmail");
	return mailService;
}
