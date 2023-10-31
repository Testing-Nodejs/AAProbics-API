/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllEnquiry() {
  try {
    var pool = await sql.connect(config);
    var result = await pool.request().query("SELECT * from CONTACT_ENQUIRY");
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllEnquiry-->", error);
  }
}

async function addEnquiry(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var insertInto = await pool
      .request()
      .input("CONTACT_ENQUIRY_NAME", obj.CONTACT_ENQUIRY_NAME)
      .input("CONTACT_ENQUIRY_EMAIL", obj.CONTACT_ENQUIRY_EMAIL)
      .input("CONTACT_ENQUIRY_SUBJECT", obj.CONTACT_ENQUIRY_SUBJECT)
      .input("CONTACT_ENQUIRY_MESSAGE", obj.CONTACT_ENQUIRY_MESSAGE)
      .query(
        "insert into CONTACT_ENQUIRY ([CONTACT_ENQUIRY_NAME],[CONTACT_ENQUIRY_EMAIL],[CONTACT_ENQUIRY_SUBJECT],[CONTACT_ENQUIRY_MESSAGE])  values(@CONTACT_ENQUIRY_NAME,@CONTACT_ENQUIRY_EMAIL,@CONTACT_ENQUIRY_SUBJECT,@CONTACT_ENQUIRY_MESSAGE)"
      );
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    if (insertInto.rowsAffected == 1) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("addEnquiry-->", err);
  }
}

async function deleteEnquiry(EnquiryID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("CONTACT_ENQUIRY_PKID", EnquiryID)
      .query(
        "DELETE FROM CONTACT_ENQUIRY WHERE CONTACT_ENQUIRY_PKID=@CONTACT_ENQUIRY_PKID"
      );

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteEnquiry-->", error);
    //
  }
}

async function updateEnquiry(EnquiryID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("CONTACT_ENQUIRY_PKID", EnquiryID)
      .input("CONTACT_ENQUIRY_NAME", obj.CONTACT_ENQUIRY_NAME)
      .input("CONTACT_ENQUIRY_EMAIL", obj.CONTACT_ENQUIRY_EMAIL)
      .input("CONTACT_ENQUIRY_SUBJECT", obj.CONTACT_ENQUIRY_SUBJECT)
      .input("CONTACT_ENQUIRY_MESSAGE", obj.CONTACT_ENQUIRY_MESSAGE)
      .query(
        `UPDATE CONTACT_ENQUIRY SET CONTACT_ENQUIRY_NAME = @CONTACT_ENQUIRY_NAME, CONTACT_ENQUIRY_EMAIL= @CONTACT_ENQUIRY_EMAIL, CONTACT_ENQUIRY_SUBJECT=@CONTACT_ENQUIRY_SUBJECT, CONTACT_ENQUIRY_MESSAGE = @CONTACT_ENQUIRY_MESSAGE WHERE CONTACT_ENQUIRY_PKID =@CONTACT_ENQUIRY_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("updateEnquiry-->", error);
  }
}

module.exports = {
  getAllEnquiry: getAllEnquiry,
  addEnquiry: addEnquiry,
  deleteEnquiry: deleteEnquiry,
  updateEnquiry: updateEnquiry,
};
