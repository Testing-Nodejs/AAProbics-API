/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllMembers() {
  try {
    var pool = await sql.connect(config);
    var result = await pool.request().query("SELECT * FROM [MEMBER]");
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllMembers-->", error);
    //
  }
}

async function MembersByType(Id) {
  try {
    var pool = await sql.connect(config);
    var result = await pool.request()
    .input("MEMBER_TYPE", Id)
    .query("SELECT * FROM [MEMBER] where MEMBER_TYPE = @MEMBER_TYPE");
    return result.recordsets[0];
  } catch (error) {
    console.log("MembersByType-->", error);
    //
  }
}

async function addMembers(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("MEMBER_EMAIL", obj.MEMBER_EMAIL)
      .query(
        "SELECT * from MEMBER WHERE MEMBER_EMAIL=@MEMBER_EMAIL"
      );
    if (result.rowsAffected[0] == 0) {
      var insertInto = await pool
        .request()
        .input("MEMBER_TYPE", obj.MEMBER_TYPE)
        .input("MEMBER_NAME", obj.MEMBER_NAME)
        .input("MEMBER_EMAIL", obj.MEMBER_EMAIL)
        .input("MEMBER_PHONE", obj.MEMBER_PHONE)
        .input("MEMBER_ADDRESS", obj.MEMBER_ADDRESS)
        .input("MEMBER_QUALIFICATION", obj.MEMBER_QUALIFICATION)
        .input("MEMBER_DESIGNATION", obj.MEMBER_DESIGNATION)
        .input("MEMBER_EXPERIENCE", obj.MEMBER_EXPERIENCE)
        .query(
          "insert into MEMBER (MEMBER_TYPE, MEMBER_NAME, MEMBER_EMAIL, MEMBER_PHONE, MEMBER_ADDRESS, MEMBER_QUALIFICATION, MEMBER_DESIGNATION, MEMBER_EXPERIENCE)  values(@MEMBER_TYPE, @MEMBER_NAME, @MEMBER_EMAIL, @MEMBER_PHONE, @MEMBER_ADDRESS, @MEMBER_QUALIFICATION, @MEMBER_DESIGNATION, @MEMBER_EXPERIENCE)"
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
    console.log("addMembers-->", err);
  }
}

async function deleteMembers(MemberID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("MEMBER_PKID", MemberID)
      .query("DELETE FROM MEMBER WHERE MEMBER_PKID=@MEMBER_PKID");

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteMembers-->", error);
    //
  }
}

async function updateMembers(MemberID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("MEMBER_PKID", MemberID)
      .input("MEMBER_TYPE", obj.MEMBER_TYPE)
      .input("MEMBER_NAME", obj.MEMBER_NAME)
      .input("MEMBER_EMAIL", obj.MEMBER_EMAIL)
      .input("MEMBER_PHONE", obj.MEMBER_PHONE)
      .input("MEMBER_ADDRESS", obj.MEMBER_ADDRESS)
      .input("MEMBER_QUALIFICATION", obj.MEMBER_QUALIFICATION)
      .input("MEMBER_DESIGNATION", obj.MEMBER_DESIGNATION)
      .input("MEMBER_EXPERIENCE", obj.MEMBER_EXPERIENCE)
      .query(
        `UPDATE MEMBER SET MEMBER_TYPE = @MEMBER_TYPE, MEMBER_NAME=@MEMBER_NAME,MEMBER_EMAIL=@MEMBER_EMAIL,MEMBER_PHONE=@MEMBER_PHONE,MEMBER_ADDRESS=@MEMBER_ADDRESS,MEMBER_QUALIFICATION=@MEMBER_QUALIFICATION,MEMBER_DESIGNATION=@MEMBER_DESIGNATION,MEMBER_EXPERIENCE=@MEMBER_EXPERIENCE WHERE MEMBER_PKID =@MEMBER_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("updateMembers-->", error);
  }
}

module.exports = {
  getAllMembers: getAllMembers,
  addMembers: addMembers,
  deleteMembers: deleteMembers,
  updateMembers: updateMembers,
  MembersByType: MembersByType,
};
