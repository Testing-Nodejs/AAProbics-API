/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllAwards() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT * from AWARDS"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllAwards-->", error);
  }
}

async function addAward(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var insertInto = await pool
      .request()
      .input("AWARD_NAME", obj.AWARD_NAME)
      .input("AWARD_IMAGE", obj.AWARD_IMAGE)
      .input("AWARD_DATE", obj.AWARD_DATE)
      .input("AWARD_DESC", obj.AWARD_DESC)
      .query(
        "insert into AWARDS ([AWARD_NAME],[AWARD_IMAGE],[AWARD_DATE],[AWARD_DESC])  values(@AWARD_NAME,@AWARD_IMAGE,@AWARD_DATE,@AWARD_DESC)"
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
    console.log("addAward-->", err);
  }
}

async function deleteAward(AwardID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("AWARD_PKID", AwardID)
      .query("DELETE FROM AWARDS WHERE AWARD_PKID=@AWARD_PKID");

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteAward-->", error);
    //
  }
}

async function updateAward(AwardID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("AWARD_PKID", AwardID)
      .input("AWARD_NAME", obj.AWARD_NAME)
      .input("AWARD_IMAGE", obj.AWARD_IMAGE)
      .input("AWARD_DATE", obj.AWARD_DATE)
      .input("AWARD_DESC", obj.AWARD_DESC)
      .query(
        `UPDATE AWARDS SET AWARD_NAME = @AWARD_NAME, AWARD_IMAGE= @AWARD_IMAGE, AWARD_DATE=@AWARD_DATE, AWARD_DESC = @AWARD_DESC WHERE AWARD_PKID =@AWARD_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("updateAward-->", error);
  }
}

module.exports = {
  getAllAwards: getAllAwards,
  addAward: addAward,
  deleteAward: deleteAward,
  updateAward: updateAward,
};
