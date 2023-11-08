const { getTrips } = require('api');
const {getDriver}  = require('api');
const {getVichle}  = require('api');


const drivers = require("./node_modules/api/data/drivers.json");


/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here
    try {
      const trips = await getTrips();

      // nos. of cashtrips and non cashtrips
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
      // billed total
      let billArray = [];
      for (let trip of trips) {
        billArray.push(trip.billedAmount);
      }

      const removeComma = billArray.map((item) => {
        const num = parseFloat(String(item).replace(/,/g, ""));
        return num;
      });

      // cash billed total
      let cashBillArray = [];
      const filteredBillArray = trips.filter((item) => {
        return item.isCash === true;
      });

      for (let bill of filteredBillArray) {
        cashBillArray.push(bill.billedAmount);
      }

      const removeBillArrayComma = cashBillArray.map((item) => {
        const num = parseFloat(String(item).replace(/,/g, ""));
        return num;
      });

      // non cash billed total
      let nonCashBillArray = [];
      const nonCashfilteredBillArray = trips.filter((item) => {
        return item.isCash === false;
      });

      for (let bill of nonCashfilteredBillArray) {
        nonCashBillArray.push(bill.billedAmount);
      }

      const removeNonCashBillArrayComma = nonCashBillArray.map((item) => {
        const num = parseFloat(String(item).replace(/,/g, ""));
        return num;
      });

      // get drivers with more than one vehicle
      let countVehicle = 0;
      let noOfVehicle = [];
      for (let driver in drivers) {
        noOfVehicle.push(drivers[driver].vehicleID);
      }

      for (let vehicle of noOfVehicle) {
        if (vehicle.length > 1) {
          countVehicle++;
        }
      }

      // driver with most trip
      // to get an object of the containing the driverID key and the no. of trips value
      const driverObjectCount = trips.reduce((accumulator, eachTrip) => {
        const key = eachTrip.driverID;

        if (!accumulator[key]) {
          accumulator[key] = 0;
        }
        accumulator[key]++;
        return accumulator;
      }, {});

      const mostFrequentDriverID = Object.keys(driverObjectCount).reduce(
        (a, b) => {
          /*this wil first start from 0, then check if 0 > 6(value of the first) if yes, it returns b(which is current item),
      then the accumulator takes the previous value which is 6 to compare the next value which is 5*/
          return driverObjectCount[a] >= driverObjectCount[b] ? a : b;
        },
        0
      );

      // mostTrips by Driver

      // to get total amount
      let mostDriverTotalAmountFigure = [];
      const mostDriverTotalAmount = trips.filter((item) => {
        return item.driverID === mostFrequentDriverID;
      });

      // looping through the array with the most frequent ID
      for (let amount of mostDriverTotalAmount) {
        mostDriverTotalAmountFigure.push(amount.billedAmount);
      }

      const removeMostDriverAmountComma = mostDriverTotalAmountFigure.map(
        (item) => {
          const num = parseFloat(String(item).replace(/,/g, ""));
          return num;
        }
      );

      // fetching the mos trip driver detail
      const mostTripDriverDetail = await getDriver(mostFrequentDriverID);

      // most trip driver detail to return
      const driverDetailtoReturn = {
        name: mostTripDriverDetail.name,
        email: mostTripDriverDetail.email,
        phone: mostTripDriverDetail.phone,
        noOfTrips: driverObjectCount[mostFrequentDriverID],
        totalAmountEarned: removeMostDriverAmountComma.reduce((total, item) => {
          return parseFloat((total += item).toFixed(2));
        }, 0),
      };
      //highest earning driver
      const highestEarningDriver = trips.reduce((accumulator, eachTrip) => {
        const key = eachTrip.driverID;

        //checking if the accumulator object doesn't have the key(driverid) if yes then create one
        if (!accumulator[key]) {
          accumulator[key] = 0; //setting it to zero will enabl addition to start from zero
        }
        //after creating the key and setting the values, then each time that key appears it add the billed amount
        accumulator[key] += parseFloat(
          String(eachTrip.billedAmount).replace(/,/g, "")
        );
        return accumulator;
      }, {});

      //getting the key value pair of each driver id and the total amount earned
      const sortedHighestEarningDriver = Object.entries(highestEarningDriver);
      // sorting the array with the second item in each array which is the amount
      const myNewSort = sortedHighestEarningDriver.sort((a, b) => {
        return b[1] - a[1];
      });
      // getting the ID of the driver with the highest amount, since its descending order so the highest is the first, i.e [0] then the first item there which is the ID i.e [0]
      const mostTripDriverID = myNewSort[0][0];

      //getting the object for the highestEarningDriver
      const highestEarningDriverDetail = await getDriver(mostTripDriverID);

      // returing the actual value object for highestEarningDriver
      const highestEarningDriverDetailToReturn = {
        name: highestEarningDriverDetail.name,
        email: highestEarningDriverDetail.email,
        phone: highestEarningDriverDetail.phone,
        noOfTrips: driverObjectCount[mostTripDriverID],
        totalAmountEarned: highestEarningDriver[mostTripDriverID],
      };

      // my returned object
      const sampleOutput = {
        noOfCashTrips: countTrue,
        noOfNonCashTrips: countFalse,
        billedTotal: removeComma.reduce((total, item) => {
          return parseFloat((total += item).toFixed(2));
        }, 0),
        cashBilledTotal: removeBillArrayComma.reduce((total, item) => {
          return parseFloat((total += item).toFixed(2));
        }, 0),
        nonCashBilledTotal: removeNonCashBillArrayComma.reduce(
          (total, item) => {
            return parseFloat((total += item).toFixed(2));
          },
          0
        ),
        noOfDriversWithMoreThanOneVehicle: countVehicle -1,
        mostTripsByDriver: driverDetailtoReturn,
        highestEarningDriver: highestEarningDriverDetailToReturn,
      };

      return sampleOutput;
    } catch (error) {
      console.log(error);
    }
  }

  analysis();

  async function main() {
    try {
      const result = await analysis();
      console.log(result);
    } catch (error) {
      console.log("error in main :", error);
    }
  }

  main();
  module.exports = analysis;
 // module.exports = driverObjectCount;
// }

// module.exports = analysis;
