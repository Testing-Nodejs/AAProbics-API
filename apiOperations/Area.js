/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function addArea(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("AREA_NAME", sql.VarChar, obj.AREA_NAME)
      .query("SELECT * from AREA WHERE AREA_NAME=@AREA_NAME");
    if (result.rowsAffected[0] == 0) {
      console.log(obj);
      var insertInto = await pool
        .request()
        .input("AREA_NAME", sql.NVarChar, obj.AREA_NAME)
        .input("AREA_COUNTRY_FKID", sql.NVarChar, obj.AREA_COUNTRY_FKID)
        .input("AREA_STATE_FKID", sql.NVarChar, obj.AREA_STATE_FKID)
        .input("AREA_CITY_FKID", sql.NVarChar, obj.AREA_CITY_FKID)
        .input("AREA_PINCODE", sql.NVarChar, obj.AREA_PINCODE)
        .query(
          "insert into AREA ([AREA_NAME],[AREA_COUNTRY_FKID],[AREA_STATE_FKID],[AREA_CITY_FKID],[AREA_PINCODE])  values(@AREA_NAME,@AREA_COUNTRY_FKID,@AREA_STATE_FKID,@AREA_CITY_FKID,@AREA_PINCODE)"
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
    console.log("addArea-->", err);
  }
}

async function getAllArea() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT A.AREA_COUNTRY_FKID,A.AREA_STATE_FKID,A.AREA_CITY_FKID, A.AREA_PKID,S.STATE_NAME, CO.COUNTRY_NAME,C.CITY_NAME, A.AREA_PINCODE, A.AREA_NAME FROM [AREA] A join COUNTRY CO on CO.COUNTRY_PKID = A.AREA_COUNTRY_FKID join STATE S on S.STATE_PKID = A.AREA_STATE_FKID join CITY C on C.CITY_PKID = A.AREA_CITY_FKID"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllArea-->", error);
    //
  }
}

async function GetAllAreaByCity(CityID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT A.AREA_COUNTRY_FKID,A.AREA_STATE_FKID,A.AREA_CITY_FKID, A.AREA_PKID,S.STATE_NAME, CO.COUNTRY_NAME,C.CITY_NAME, A.AREA_PINCODE, A.AREA_NAME FROM [AREA] A join COUNTRY CO on CO.COUNTRY_PKID = A.AREA_COUNTRY_FKID join STATE S on S.STATE_PKID = A.AREA_STATE_FKID join CITY C on C.CITY_PKID = A.AREA_CITY_FKID where AREA_CITY_FKID = '" +
          CityID +
          "'"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("GetAllAreaByCity-->", error);
    //
  }
}

async function GetCompleteLocationByPincode(Pincode) {
  try {
    var pool = await sql.connect(config);
    var Country = await pool
      .request()
      .query(
        "SELECT distinct [AREA_COUNTRY_FKID], [COUNTRY_NAME] FROM [AREA] A join COUNTRY CO on CO.COUNTRY_PKID = A.AREA_COUNTRY_FKID join STATE S on S.STATE_PKID = A.AREA_STATE_FKID join CITY C on C.CITY_PKID = A.AREA_CITY_FKID where [AREA_PINCODE] like '%" +
          Pincode +
          "%'"
      );

    var State = await pool
      .request()
      .query(
        "SELECT distinct [AREA_STATE_FKID], [STATE_NAME] FROM [AREA] A join COUNTRY CO on CO.COUNTRY_PKID = A.AREA_COUNTRY_FKID join STATE S on S.STATE_PKID = A.AREA_STATE_FKID join CITY C on C.CITY_PKID = A.AREA_CITY_FKID where [AREA_PINCODE] like '%" +
          Pincode +
          "%'"
      );

    var City = await pool
      .request()
      .query(
        "SELECT distinct [AREA_CITY_FKID], [CITY_NAME] FROM [AREA] A join COUNTRY CO on CO.COUNTRY_PKID = A.AREA_COUNTRY_FKID join STATE S on S.STATE_PKID = A.AREA_STATE_FKID join CITY C on C.CITY_PKID = A.AREA_CITY_FKID where [AREA_PINCODE] like '%" +
          Pincode +
          "%'"
      );

    var Area = await pool
      .request()
      .query(
        "SELECT distinct [AREA_PKID], [AREA_NAME] FROM [AREA] A join COUNTRY CO on CO.COUNTRY_PKID = A.AREA_COUNTRY_FKID join STATE S on S.STATE_PKID = A.AREA_STATE_FKID join CITY C on C.CITY_PKID = A.AREA_CITY_FKID where [AREA_PINCODE] like '%" +
          Pincode +
          "%'"
      );

    var obj = {
      Country: Country.recordsets[0],
      State: State.recordsets[0],
      City: City.recordsets[0],
      Area: Area.recordsets[0],
    };
    return [obj];
  } catch (error) {
    console.log("GetCompleteLocationByPincode-->", error);
    //
  }
}

async function deleteArea(AreaID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("AREA_PKID", AreaID)
      .query("DELETE FROM AREA WHERE AREA_PKID=@AREA_PKID");

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteArea-->", error);
    //
  }
}

async function updateArea(AreaID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("AREA_PKID", AreaID)
      .input("AREA_NAME", obj.AREA_NAME)
      .input("AREA_PINCODE", obj.AREA_PINCODE)
      .input("AREA_CITY_FKID", obj.AREA_CITY_FKID)
      .input("AREA_COUNTRY_FKID", obj.AREA_COUNTRY_FKID)
      .input("AREA_STATE_FKID", obj.AREA_STATE_FKID)
      .query(
        `UPDATE AREA SET AREA_NAME = @AREA_NAME, AREA_PINCODE= @AREA_PINCODE, AREA_CITY_FKID=@AREA_CITY_FKID, AREA_COUNTRY_FKID=@AREA_COUNTRY_FKID, AREA_STATE_FKID = @AREA_STATE_FKID WHERE AREA_PKID =@AREA_PKID`
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

// async function getAreaByID(AreaID) {
//   try {
//     var pool = await sql.connect(config);
//     var result = await pool
//       .request()
//       .input("AREA_PKID", AreaID)
//       .query(
//         "SELECT A.*, S.STATE_NAME, CO.COUNTRY_NAME, C.CITY_NAME FROM [AREA] A join COUNTRY CO on CO.COUNTRY_PKID = A.AREA_COUNTRY_FKID join STATE S on S.STATE_PKID = A.AREA_STATE_FKID  join CITY C on C.CITY_PKID = A.AREA_CITY_FKID  WHERE AREA_PKID=@CITY_PKID"
//       );

//     return result.recordsets[0];
//   } catch (error) {
//     console.log("getCityByID-->", error);
//     //
//   }
// }

// async function getAreaByCityID(CityID) {
//   try {
//     var pool = await sql.connect(config);
//     var result = await pool
//       .request()
//       .input("AREA_CITY_FKID", CityID)
//       .query(
//         "SELECT A.*, S.STATE_NAME, CO.COUNTRY_NAME,C.CITY_NAME FROM [AREA] A join COUNTRY CO on CO.COUNTRY_PKID = A.AREA_COUNTRY_FKID join STATE S on S.STATE_PKID = A.AREA_STATE_FKID join CITY C on C.CITY_PKID = A.AREA_CITY_FKID WHERE CITY_STATE_FKID=@CITY_STATE_FKID"
//       );

//     return result.recordsets[0];
//   } catch (error) {
//     console.log("getCityByStateID-->", error);
//     //
//   }
// }

module.exports = {
  addArea: addArea,
  getAllArea: getAllArea,
  deleteArea: deleteArea,
  updateArea: updateArea,
  GetAllAreaByCity: GetAllAreaByCity,
  GetCompleteLocationByPincode: GetCompleteLocationByPincode,
  // getAreaByID:getAreaByID,
  // getAreaByCityID:getAreaByCityID,
};
