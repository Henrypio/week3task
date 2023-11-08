const { getTrips, getDriver, getVehicle } = require("api");
const drivers = require("./node_modules/api/data/drivers.json");
const trips = require("./node_modules/api/data/trips.json");

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  try {
    // object to count number of trips
    const driverObjectCount = trips.reduce((accumulator, eachTrip) => {
      const key = eachTrip.driverID;

      if (!accumulator[key]) {
        accumulator[key] = 0;
      }
      accumulator[key]++;
      return accumulator;
    }, {});

    // array to hold all object
    const myArray = [];
    for (let key in drivers) {
      // vehicles array
      const vehicleDetail = await getVehicle(drivers[key].vehicleID[0]);

      // to get no of cash and non cash (true and false trip)
      let countTrue = 0;
      let countFalse = 0;
      for (let trip of trips) {
        //const tripArray = trip.isCash;
        if (trip.isCash === true) {
          countTrue += 1;
        }

        if (trip.isCash === false) {
          countFalse += 1;
        }
      }

      // to get no of cash trip
      const toGet = trips.filter((item) => {
        return item.driverID === key;
      });

      //console.log(toGet)
      // to get false
      const falseCash = toGet.filter((item) => {
        return item.isCash === false;
      });

      const eachFalseCashBilled = falseCash.reduce(
        (accumulator, eachDriveID) => {
          const key = eachDriveID.driverID;

          if (!accumulator[key]) {
            accumulator[key] = 0;
          }
          accumulator[key] += parseFloat(
            String(eachDriveID.billedAmount).replace(/,/g, "")
          );
          return accumulator;
        },
        {}
      );

      // to get true
      const trueCash = toGet.filter((item) => {
        return item.isCash === true;
      });

      const eachTrueCashBilled = trueCash.reduce((accumulator, eachDriveID) => {
        const key = eachDriveID.driverID;

        if (!accumulator[key]) {
          accumulator[key] = 0;
        }
        accumulator[key] += parseFloat(
          String(eachDriveID.billedAmount).replace(/,/g, "")
        );
        return accumulator;
      }, {});

      // to get the no. of user by each driver

      const driverUser = trips.reduce((acc, trip) => {
        const { driverID } = trip;
        if (!acc[driverID]) {
          acc[driverID] = [];
        }
        acc[driverID].push(trip.user);
        return acc;
      }, {});

      //console.log(driverUser)

      // to get the total amount earned
      const totalAmountEarned = toGet.reduce((accumulator, eachDriveID) => {
        const key = eachDriveID.driverID;

        if (!accumulator[key]) {
          accumulator[key] = 0;
        }
        accumulator[key] += parseFloat(
          String(eachDriveID.billedAmount).replace(/,/g, "")
        );
        return accumulator;
      }, {});

      // to get the no. of true (cashbill) trip for each driver

      const filterCountTrue = trips.filter((item) => {
        return item.isCash === true;
      });

      // to get the no. of true
      const noOfTrueForCashTrip = filterCountTrue.reduce((acc, trip) => {
        const { driverID, isCash } = trip;
        if (!acc[driverID]) {
          acc[driverID] = 0;
        }
        if (isCash) {
          acc[driverID]++;
        }
        return acc;
      }, {});

      // to get the no. of false (noncashbill) trip for each driver

      const filterCountFalse = trips.filter((item) => {
        return item.isCash === false;
      });
      //console.log(filterCountFalse)

      // to get the no. of false
      const noOfFalseForCashTrip = filterCountFalse.reduce((acc, trip) => {
        const { driverID, isCash } = trip;
        if (!acc[driverID]) {
          acc[driverID] = 0;
        }
        if (isCash) {
          acc[driverID]++;
        }
        return acc;
      }, {});

      //console.log(noOfFalseForCashTrip)

      //console.log(noOfFalseForCashTrip)
      // my returned array
      myArray.push({
        fullName: drivers[key].name,
        phone: drivers[key].phone,
        id: key,
        vehicles: [
          {
            plate: vehicleDetail.plate,
            manufacturer: vehicleDetail.manufacturer,
          },
        ],
        noOfTrips: driverObjectCount[key],
        noOfCashTrips: noOfTrueForCashTrip[key],
        noOfNonCashTrips: noOfFalseForCashTrip[key],
        trips: driverUser[key],
        totalAmountEarned: parseFloat(
          Number(totalAmountEarned[key]).toFixed(2)
        ),
        totalCashAmount: parseFloat(Number(eachTrueCashBilled[key]).toFixed(2)),
        totalNonCashAmount: parseFloat(
          Number(eachFalseCashBilled[key]).toFixed(2)
        ),
      });
    }
    return myArray;
  } catch (error) {
    console.log(`${error} This is not a registered driver`);
  }
}

async function display() {
  try {
    const myResult = await driverReport();
    console.log(myResult);
  } catch (error) {
    console.log(`${error}fatal error I can't wait for you!!!`);
  }
}
display();
module.exports = driverReport;
