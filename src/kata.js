function persistenceService() {
  return {
    saveReservation: function (machineNumber, pin, dateTime, cell, email) {
      return 2;
    }
  }
}
function emailService() {
  return {
    sendEmail: function (machineNumber, pin, reservationID, email) {
    },
  }
}

function Machine(number) {
  return {
    lock: function () {
      return true;
    },
    number: number
  }
}
  

function MachineService() {
  return {
    find_Machine: function () {
      return 26; //todo : spyOn and return a constant in the test
    }
  }
}

function pinGenerationService() {
  return {
    generate: function () {
      return 54321; // todo : spyOn and return a contast in the test
    }
  }
}

function Reservation(machineService, pinGenerationService, emailService, persistence) {
  return {
    create: function (dateTime, cell, email) {
      let machine = machineService.find_Machine();
      let pin = pinGenerationService.generate();
      machine.lock(dateTime);
      let reservationID =  persistence.saveReservation(machine.number, pin, dateTime, cell, email);
      emailService.sendEmail(machine.number, pin, reservationID, email);
    }
  }
}
