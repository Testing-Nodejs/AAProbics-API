/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllState() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query("SELECT * FROM [STATE] join COUNTRY on COUNTRY_PKID = STATE_COUNTRY_FKID");
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllState-->", error);
    //
  }
}

async function getStateByID(StateID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("STATE_PKID", StateID)
      .query(
        "SELECT * from STATE join COUNTRY on COUNTRY_PKID = STATE_COUNTRY_FKID WHERE STATE_PKID=@STATE_PKID"
      );

    return result.recordsets[0];
  } catch (error) {
    console.log("getStateByID-->", error);
    //
  }
}

async function getStateByCountryID(CountryID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("COUNTRY_PKID", CountryID)
      .query(
        "SELECT * from STATE join COUNTRY on COUNTRY_PKID = STATE_COUNTRY_FKID WHERE STATE_COUNTRY_FKID=@COUNTRY_PKID"
      );

    return result.recordsets[0];
  } catch (error) {
    console.log("getStateByCountryID-->", error);
    //
  }
}

async function addState(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("STATE_NAME", sql.VarChar, obj.STATE_NAME)
      .query(
        "SELECT * from STATE WHERE STATE_NAME=@STATE_NAME"
      );
    if (result.rowsAffected[0] == 0) {
      var insertInto = await pool
        .request()
        .input("STATE_NAME", sql.NVarChar, obj.STATE_NAME)
        .input("STATE_COUNTRY_FKID", sql.NVarChar, obj.STATE_COUNTRY_FKID)
        .query(
          "insert into STATE ([STATE_NAME],[STATE_COUNTRY_FKID])  values(@STATE_NAME,@STATE_COUNTRY_FKID)"
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
    console.log("addState-->", err);
  }
}

async function deleteState(StateID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("STATE_PKID", StateID)
      .query(
        "DELETE FROM STATE WHERE STATE_PKID=@STATE_PKID"
      );

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteState-->", error);
    //
  }
}

async function updateState(StateID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("STATE_PKID", StateID)
      .input("STATE_NAME", obj.STATE_NAME)
      .input("STATE_COUNTRY_FKID", obj.STATE_COUNTRY_FKID)
      .query(
        `UPDATE STATE SET STATE_NAME = @STATE_NAME, STATE_COUNTRY_FKID= @STATE_COUNTRY_FKID WHERE STATE_PKID =@STATE_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("updateState-->", error);
  }
}

module.exports = {
  getAllState: getAllState,
  getStateByID: getStateByID,
  addState: addState,
  deleteState: deleteState,
  updateState: updateState,
  getStateByCountryID: getStateByCountryID,
};
