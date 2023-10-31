/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllUsers() {
  try {
    var pool = await sql.connect(config);
    var result = await pool.request().query("SELECT * FROM [REGISTERED_USERS]");
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllUsers-->", error);
    //
  }
}

async function GetUserProfile(UserID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("REGISTERED_USERS_PKID", UserID)
      .query(
        "SELECT * FROM [REGISTERED_USERS] where REGISTERED_USERS_PKID = @REGISTERED_USERS_PKID"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("GetUserProfile-->", error);
    //
  }
}

async function UserLogin(Email, Password) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("REGISTERED_USERS_EMAIL", Email)
      .input("REGISTERED_USERS_PASSWORD", Password)
      .query(
        "SELECT * FROM [REGISTERED_USERS] where REGISTERED_USERS_EMAIL = @REGISTERED_USERS_EMAIL and REGISTERED_USERS_PASSWORD=@REGISTERED_USERS_PASSWORD"
      );
    if (result.recordsets[0].length > 0) {
      return result.recordsets[0];
    } else {
      return false;
    }
  } catch (error) {
    console.log("UserLogin-->", error);
    //
  }
}

async function addUsers(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("REGISTERED_USERS_EMAIL", sql.VarChar, obj.REGISTERED_USERS_EMAIL)
      .query(
        "SELECT * from REGISTERED_USERS WHERE REGISTERED_USERS_EMAIL=@REGISTERED_USERS_EMAIL"
      );
    if (result.rowsAffected[0] == 0) {
      var insertInto = await pool
        .request()
        .input("REGISTERED_USERS_NAME", obj.REGISTERED_USERS_NAME)
        .input("REGISTERED_USERS_EMAIL", obj.REGISTERED_USERS_EMAIL)
        .input("REGISTERED_USERS_PHONE", obj.REGISTERED_USERS_PHONE)
        .input("REGISTERED_USERS_PASSWORD", obj.REGISTERED_USERS_PASSWORD)
        .query(
          "insert into REGISTERED_USERS (REGISTERED_USERS_NAME,REGISTERED_USERS_EMAIL,REGISTERED_USERS_PHONE,REGISTERED_USERS_PASSWORD,REGISTERED_USERS_ACTIVE,REGISTERED_USERS_DATE)  values(@REGISTERED_USERS_NAME,@REGISTERED_USERS_EMAIL,@REGISTERED_USERS_PHONE,@REGISTERED_USERS_PASSWORD,1,GETDATE())"
        );
      if (pool._connected == false) {
        pool = await sql.connect(config);
      }
      if (insertInto.rowsAffected == 1) {
        var resultr = await pool
          .request()
          .query(
            "select max(REGISTERED_USERS_PKID) as REGISTERED_USERS_PKID from REGISTERED_USERS"
          );
        if (resultr.recordsets[0].length > 0) {
          if (obj.UserAddress[0] === 0) {
            return "2";
          } else {
            var insertIntor = await pool
              .request()
              .input("USER_ADDRESS_NAME", obj.REGISTERED_USERS_NAME)
              .input("USER_ADDRESS_PHONE", obj.REGISTERED_USERS_PHONE)
              .input("USER_ADDRESS_TYPE", obj.UserAddress[0].AddressType)
              .input("USER_ADDRESS_HOUSE_NO", obj.UserAddress[0].HouseNo)
              .input("USER_ADDRESS_STREET", obj.UserAddress[0].StreetAddress)
              .input("USER_ADDRESS_CITY_FKID", obj.UserAddress[0].City)
              .input("USER_ADDRESS_STATE_FKID", obj.UserAddress[0].State)
              .input("USER_ADDRESS_COUNTRY_FKID", obj.UserAddress[0].Country)
              .input("USER_ADDRESS_ZIPCODE", obj.UserAddress[0].Pincode)
              .input("USER_ADDRESS_DEFAULT", "1")
              .input(
                "USER_ADDRESS_USER_FKID",
                resultr.recordsets[0][0].REGISTERED_USERS_PKID
              )
              .query(
                "insert into USER_ADDRESS (USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, USER_ADDRESS_CITY_FKID, USER_ADDRESS_STATE_FKID, USER_ADDRESS_COUNTRY_FKID, USER_ADDRESS_ZIPCODE, USER_ADDRESS_DEFAULT, USER_ADDRESS_USER_FKID, USER_ADDRESS_DATE)  values(@USER_ADDRESS_NAME, @USER_ADDRESS_PHONE, @USER_ADDRESS_TYPE, @USER_ADDRESS_HOUSE_NO, @USER_ADDRESS_STREET, @USER_ADDRESS_CITY_FKID, @USER_ADDRESS_STATE_FKID, @USER_ADDRESS_COUNTRY_FKID, @USER_ADDRESS_ZIPCODE, @USER_ADDRESS_DEFAULT, @USER_ADDRESS_USER_FKID,GETDATE())"
              );
            if (pool._connected == false) {
              pool = await sql.connect(config);
            }
            if (insertIntor.rowsAffected == 1) {
              return "1";
            } else {
              return "2";
            }
          }
        } else {
          return "2";
        }
      } else {
        return "2";
      }
    } else {
      return "0";
    }
  } catch (err) {
    console.log("addUsers-->", err);
  }
}

async function deleteUsers(UserID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("REGISTERED_USERS_PKID", UserID)
      .query(
        "DELETE FROM REGISTERED_USERS WHERE REGISTERED_USERS_PKID=@REGISTERED_USERS_PKID"
      );

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteUsers-->", error);
    //
  }
}

async function UpdateUsers(UserID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("REGISTERED_USERS_PKID", UserID)
      .input("REGISTERED_USERS_NAME", obj.REGISTERED_USERS_NAME)
      .input("REGISTERED_USERS_EMAIL", obj.REGISTERED_USERS_EMAIL)
      .input("REGISTERED_USERS_PHONE", obj.REGISTERED_USERS_PHONE)
      .input("REGISTERED_USERS_PASSWORD", obj.REGISTERED_USERS_PASSWORD)
      .input("REGISTERED_USERS_PROFILE", obj.REGISTERED_USERS_PROFILE)
      .query(
        `UPDATE REGISTERED_USERS SET REGISTERED_USERS_NAME = @REGISTERED_USERS_NAME, REGISTERED_USERS_EMAIL= @REGISTERED_USERS_EMAIL,REGISTERED_USERS_PHONE=@REGISTERED_USERS_PHONE,REGISTERED_USERS_PASSWORD=@REGISTERED_USERS_PASSWORD,REGISTERED_USERS_PROFILE=@REGISTERED_USERS_PROFILE WHERE REGISTERED_USERS_PKID =@REGISTERED_USERS_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("UpdateUsers-->", error);
  }
}

async function UpdatePassword(UserID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("REGISTERED_USERS_PKID", UserID)
      .input("REGISTERED_USERS_PASSWORD", obj.REGISTERED_USERS_PASSWORD)
      .query(
        `UPDATE REGISTERED_USERS SET REGISTERED_USERS_PASSWORD=@REGISTERED_USERS_PASSWORD WHERE REGISTERED_USERS_PKID =@REGISTERED_USERS_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("UpdatePassword-->", error);
  }
}

module.exports = {
  getAllUsers: getAllUsers,
  GetUserProfile: GetUserProfile,
  UserLogin: UserLogin,
  addUsers: addUsers,
  deleteUsers: deleteUsers,
  UpdateUsers: UpdateUsers,
  UpdatePassword: UpdatePassword,
};
