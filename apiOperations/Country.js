/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllCountry() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query("SELECT * FROM [COUNTRY]");
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllCountry-->", error);
    //
  }
}

async function getCountryByID(CountryID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("COUNTRY_PKID", CountryID)
      .query(
        "SELECT * from COUNTRY WHERE COUNTRY_PKID=@COUNTRY_PKID"
      );

    return result.recordsets[0];
  } catch (error) {
    console.log("getCountryByID-->", error);
    //
  }
}

async function addCountry(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("CountryName", sql.VarChar, obj.CountryName)
      .query(
        "SELECT * from COUNTRY WHERE COUNTRY_NAME=@CountryName"
      );
    if (result.rowsAffected[0] == 0) {
      var insertInto = await pool
        .request()
        .input("COUNTRY_NAME", sql.NVarChar, obj.COUNTRY_NAME)
        .input("COUNTRY_CODE", sql.NVarChar, obj.COUNTRY_CODE)
        .query(
          "insert into COUNTRY ([COUNTRY_NAME],[COUNTRY_CODE])  values(@COUNTRY_NAME,@COUNTRY_CODE)"
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
    console.log("addCountry-->", err);
  }
}

async function deleteCountry(CountryID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("COUNTRY_PKID", CountryID)
      .query(
        "DELETE FROM COUNTRY WHERE COUNTRY_PKID=@COUNTRY_PKID"
      );

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteCountry-->", error);
    //
  }
}

async function updateCountry(CountryID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("COUNTRY_PKID", CountryID)
      .input("COUNTRY_NAME", obj.COUNTRY_NAME)
      .input("COUNTRY_CODE", obj.COUNTRY_CODE)
      .query(
        `UPDATE COUNTRY SET COUNTRY_NAME = @COUNTRY_NAME, COUNTRY_CODE= @COUNTRY_CODE WHERE COUNTRY_PKID =@COUNTRY_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("updateCountry-->", error);
  }
}

module.exports = {
  getAllCountry: getAllCountry,
  getCountryByID: getCountryByID,
  addCountry: addCountry,
  deleteCountry: deleteCountry,
  updateCountry: updateCountry,
};
