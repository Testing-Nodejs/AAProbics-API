/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllCity() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT C.*, S.STATE_NAME, CO.COUNTRY_NAME FROM [CITY] C join COUNTRY CO on CO.COUNTRY_PKID = C.CITY_COUNTRY_FKID join STATE S on S.STATE_PKID = C.CITY_STATE_FKID"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllCity-->", error);
    //
  }
}

async function getCityByID(CityID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("CITY_PKID", CityID)
      .query(
        "SELECT C.*, S.STATE_NAME, CO.COUNTRY_NAME FROM [CITY] C join COUNTRY CO on CO.COUNTRY_PKID = C.CITY_COUNTRY_FKID join STATE S on S.STATE_PKID = C.CITY_STATE_FKID WHERE CITY_PKID=@CITY_PKID"
      );

    return result.recordsets[0];
  } catch (error) {
    console.log("getCityByID-->", error);
    //
  }
}

async function getCityByStateID(StateID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("CITY_STATE_FKID", StateID)
      .query(
        "SELECT C.*, S.STATE_NAME, CO.COUNTRY_NAME FROM [CITY] C join COUNTRY CO on CO.COUNTRY_PKID = C.CITY_COUNTRY_FKID join STATE S on S.STATE_PKID = C.CITY_STATE_FKID WHERE CITY_STATE_FKID=@CITY_STATE_FKID"
      );

    return result.recordsets[0];
  } catch (error) {
    console.log("getCityByStateID-->", error);
    //
  }
}

async function getPincodeByCity(CityID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("CITY_PKID", CityID)
      .query("SELECT CITY_PIN_CODE FROM [CITY] WHERE CITY_PKID=@CITY_PKID");

    return result.recordsets[0];
  } catch (error) {
    console.log("getPincodeByCity-->", error);
    //
  }
}

async function addCity(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("CITY_NAME", sql.VarChar, obj.CITY_NAME)
      .query("SELECT * from CITY WHERE CITY_NAME=@CITY_NAME");
    if (result.rowsAffected[0] == 0) {
      var insertInto = await pool
        .request()
        .input("CITY_NAME", sql.NVarChar, obj.CITY_NAME)
        .input("CITY_COUNTRY_FKID", sql.NVarChar, obj.CITY_COUNTRY_FKID)
        .input("CITY_STATE_FKID", sql.NVarChar, obj.CITY_STATE_FKID)
        .input("CITY_PIN_CODE", sql.NVarChar, obj.CITY_PIN_CODE)
        .query(
          "insert into CITY ([CITY_NAME],[CITY_COUNTRY_FKID],[CITY_STATE_FKID],[CITY_PIN_CODE])  values(@CITY_NAME,@CITY_COUNTRY_FKID,@CITY_STATE_FKID,@CITY_PIN_CODE)"
        );
      if (pool._connected == false) {
        pool = await sql.connect(config);
      }
      if (insertInto.rowsAffected == 1) {
        return "1";
      } else {
        return "2";
      }
    } else {
      return "0";
    }
  } catch (err) {
    console.log("addCity-->", err);
  }
}

async function deleteCity(CityID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("CITY_PKID", CityID)
      .query("DELETE FROM CITY WHERE CITY_PKID=@CITY_PKID");

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteCity-->", error);
    //
  }
}

async function updateCity(StateID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("CITY_PKID", StateID)
      .input("CITY_NAME", obj.CITY_NAME)
      .input("CITY_PIN_CODE", obj.CITY_PIN_CODE)
      .input("CITY_COUNTRY_FKID", obj.CITY_COUNTRY_FKID)
      .input("CITY_STATE_FKID", obj.CITY_STATE_FKID)
      .query(
        `UPDATE CITY SET CITY_NAME = @CITY_NAME, CITY_PIN_CODE= @CITY_PIN_CODE, CITY_COUNTRY_FKID=@CITY_COUNTRY_FKID, CITY_STATE_FKID = @CITY_STATE_FKID WHERE CITY_PKID =@CITY_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("updateCity-->", error);
  }
}

module.exports = {
  getAllCity: getAllCity,
  getCityByID: getCityByID,
  getCityByStateID: getCityByStateID,
  getPincodeByCity: getPincodeByCity,
  addCity: addCity,
  deleteCity: deleteCity,
  updateCity: updateCity,
};
