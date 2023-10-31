/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllAboutUs() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT * from ABOUT"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllAboutUs-->", error);
  }
}

async function addAboutUs(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var insertInto = await pool
      .request()
      .input("ABOUT_US", obj.ABOUT_US)
      .input("ABOUT_PHILOSOPHY", obj.ABOUT_PHILOSOPHY)
      .input("ABOUT_VISION", obj.ABOUT_VISION)
      .input("ABOUT_MISSION", obj.ABOUT_MISSION)
      .query(
        "insert into ABOUT ([ABOUT_US],[ABOUT_PHILOSOPHY],[ABOUT_VISION],[ABOUT_MISSION])  values(@ABOUT_US,@ABOUT_PHILOSOPHY,@ABOUT_VISION,@ABOUT_MISSION)"
      );
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    if (insertInto.rowsAffected == 1) {
      return "1";
    } else {
      return "2";
    }
  } catch (err) {
    console.log("addAboutUs-->", err);
  }
}

async function deleteAboutUs(AboutID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("ABOUT_PKID", AboutID)
      .query("DELETE FROM ABOUT WHERE ABOUT_PKID=@ABOUT_PKID");

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteAboutUs-->", error);
    //
  }
}

async function updateAboutUs(AboutID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("ABOUT_PKID", AboutID)
      .input("ABOUT_US", obj.ABOUT_US)
      .input("ABOUT_PHILOSOPHY", obj.ABOUT_PHILOSOPHY)
      .input("ABOUT_VISION", obj.ABOUT_VISION)
      .input("ABOUT_MISSION", obj.ABOUT_MISSION)
      .query(
        `UPDATE ABOUT SET ABOUT_US = @ABOUT_US, ABOUT_PHILOSOPHY= @ABOUT_PHILOSOPHY, ABOUT_VISION=@ABOUT_VISION, ABOUT_MISSION = @ABOUT_MISSION WHERE ABOUT_PKID =@ABOUT_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("updateAboutUs-->", error);
  }
}

module.exports = {
  getAllAboutUs: getAllAboutUs,
  addAboutUs: addAboutUs,
  deleteAboutUs: deleteAboutUs,
  updateAboutUs: updateAboutUs,
};
