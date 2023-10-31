/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllScienceType() {
  try {
    var pool = await sql.connect(config);
    var result = await pool.request().query("SELECT * FROM [SCIENCE_TYPE]");
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllScienceType-->", error);
    //
  }
}

async function getAllScienceTypeWeb() {
  try {
    const ScienceType = [];
    var pool = await sql.connect(config);
    var result = await pool.request().query("SELECT * FROM [SCIENCE_TYPE]");
    var kimo = result.recordsets[0];
    for (let i = 0; i < kimo.length; i++) {
      const obj = {
        title: kimo[i].SCIENCE_TYPE_NAME,
        url: "/ScienceData/" + kimo[i].SCIENCE_TYPE_PKID + "",
      };
      ScienceType.push(obj);
    }
    return ScienceType;
  } catch (error) {
    console.log("getAllScienceTypeWeb-->", error);
    //
  }
}

async function getAllScienceTypeWebTwo() {
  try {
    const ScienceType = [];
    var pool = await sql.connect(config);
    var result = await pool.request().query("SELECT * FROM [SCIENCE_TYPE]");
    var kimo = result.recordsets[0];
    for (let i = 0; i < kimo.length; i++) {
      const obj = {
        type: "link",
        label: kimo[i].SCIENCE_TYPE_NAME,
        url: "/ScienceData/" + kimo[i].SCIENCE_TYPE_PKID + "",
      };
      ScienceType.push(obj);
    }
    return ScienceType;
  } catch (error) {
    console.log("getAllScienceTypeWebTwo-->", error);
    //
  }
}

async function getAllScienceData(typeID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("SCIENCE_DATA_TYPE_FKID", typeID)
      .query(
        "SELECT * FROM [SCIENCE_DATA] join SCIENCE_TYPE on SCIENCE_TYPE_PKID = SCIENCE_DATA_TYPE_FKID where SCIENCE_DATA_TYPE_FKID = @SCIENCE_DATA_TYPE_FKID"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllScienceData-->", error);
    //
  }
}

async function addScienceData(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("SCIENCE_DATA_TYPE_FKID", obj.SCIENCE_DATA_TYPE_FKID)
      .query(
        "SELECT * from SCIENCE_DATA WHERE SCIENCE_DATA_TYPE_FKID=@SCIENCE_DATA_TYPE_FKID"
      );
    if (result.rowsAffected[0] == 0) {
      var insertInto = await pool
        .request()
        .input("SCIENCE_DATA_TYPE_FKID", obj.SCIENCE_DATA_TYPE_FKID)
        .input("SCIENCE_DATA", obj.SCIENCE_DATA)
        .input("SCIENCE_DATA_FILE", obj.SCIENCE_DATA_FILE)
        .query(
          `insert into SCIENCE_DATA (SCIENCE_DATA_TYPE_FKID, SCIENCE_DATA, SCIENCE_DATA_FILE)  values(@SCIENCE_DATA_TYPE_FKID, @SCIENCE_DATA,  @SCIENCE_DATA_FILE)`
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
    console.log("addScienceData-->", err);
  }
}

async function deleteScienceData(Pkid) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("SCIENCE_DATA_PKID", Pkid)
      .query(
        "DELETE FROM SCIENCE_DATA WHERE SCIENCE_DATA_PKID=@SCIENCE_DATA_PKID"
      );

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteScienceData-->", error);
    //
  }
}

async function updateScienceData(Pkid, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("SCIENCE_DATA_PKID", Pkid)
      .input("SCIENCE_DATA_TYPE_FKID", obj.SCIENCE_DATA_TYPE_FKID)
      .input("SCIENCE_DATA", obj.SCIENCE_DATA)
      .input("SCIENCE_DATA_FILE", obj.SCIENCE_DATA_FILE)
      .query(
        `UPDATE SCIENCE_DATA SET SCIENCE_DATA_TYPE_FKID = @SCIENCE_DATA_TYPE_FKID, SCIENCE_DATA=@SCIENCE_DATA, SCIENCE_DATA_FILE=@SCIENCE_DATA_FILE WHERE SCIENCE_DATA_PKID =@SCIENCE_DATA_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("updateScienceData-->", error);
  }
}

module.exports = {
  getAllScienceType: getAllScienceType,
  getAllScienceTypeWeb: getAllScienceTypeWeb,
  getAllScienceTypeWebTwo: getAllScienceTypeWebTwo,
  getAllScienceData: getAllScienceData,
  addScienceData: addScienceData,
  deleteScienceData: deleteScienceData,
  updateScienceData: updateScienceData,
};
