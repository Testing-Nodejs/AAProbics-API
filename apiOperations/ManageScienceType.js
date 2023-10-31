/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function GetScienceType() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query("SELECT * FROM [SCIENCE_TYPE]");
    return result.recordsets[0];
  } catch (error) {
    console.log("GetScienceType-->", error);
    //
  }
}

async function AddScienceType(obj) {
    try {
      var pool = await sql.connect(config);
      if (pool._connected == false) {
        pool = await sql.connect(config);
      }
      var result = await pool
        .request()
        .input("ScienceType", obj.ScienceType)
        .query(
          "SELECT * from SCIENCE_TYPE WHERE SCIENCE_TYPE_NAME=@ScienceType"
        );
      if (result.rowsAffected[0] == 0) {
        var insertInto = await pool
          .request()
          .input("SCIENCE_TYPE_NAME", obj.SCIENCE_TYPE_NAME)
          .query(
            "insert into SCIENCE_TYPE ([SCIENCE_TYPE_NAME])  values(@SCIENCE_TYPE_NAME)"
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
      console.log("AddScienceType-->", err);
    }
  }

  async function UpdateScienceType(AddScienceTypePkid, obj) {
    try {
      var pool = await sql.connect(config);
      var result = await pool
        .request()
        .input("SCIENCE_TYPE_PKID", ScienceTypePkid)
        .input("SCIENCE_TYPE_NAME", obj.SCIENCE_TYPE_NAME)
        .query(
          `UPDATE SCIENCE_TYPE SET SCIENCE_TYPE_NAME = @SCIENCE_TYPE_NAME WHERE SCIENCE_TYPE_PKID =@SCIENCE_TYPE_PKID`
        );
  
      var message = false;
  
      if (result.rowsAffected) {
        message = true;
      }
      return message;
    } catch (error) {
      console.log("UpdateScienceType-->", error);
    }
  }

  async function DeleteScienceType(ScienceTypePkid) {
    try {
      var pool = await sql.connect(config);
      if (pool._connected == false) {
        pool = await sql.connect(config);
      }
      var result = await pool
        .request()
        .input("SCIENCE_TYPE_PKID", ScienceTypePkid)
        .query(
          "DELETE FROM SCIENCE_TYPE WHERE SCIENCE_TYPE_PKID=@SCIENCE_TYPE_PKID"
        );
  
      if (result.rowsAffected[0] == 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log("DeleteScienceType-->", error);
      //
    }
  }

  module.exports = {
    AddScienceType: AddScienceType,
    GetScienceType:GetScienceType,
    UpdateScienceType:UpdateScienceType,
    DeleteScienceType:DeleteScienceType,
   
  };