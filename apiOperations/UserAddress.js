/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllAddress(UserID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("USER_ADDRESS_USER_FKID", UserID)
      .query(
        "SELECT ua.*, c.COUNTRY_NAME, s.STATE_NAME, ci.CITY_NAME, (select case when count(*) > 0 then 1 else 0 end as cnt from [dbo].[ORDERS] where [ORDERS_ADDRESS_FKID] = ua.USER_ADDRESS_PKID) as ADDRESS_LINKED_STATUS FROM [USER_ADDRESS] ua join [dbo].[COUNTRY] c on c.COUNTRY_PKID = ua.USER_ADDRESS_COUNTRY_FKID join [dbo].[STATE] s on s.STATE_PKID = ua.USER_ADDRESS_STATE_FKID join [dbo].[CITY] ci on ci.CITY_PKID = ua.USER_ADDRESS_CITY_FKID where USER_ADDRESS_USER_FKID = @USER_ADDRESS_USER_FKID"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllAddress-->", error);
    //
  }
}

async function getUserAddressByAddressID(Pkid) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("USER_ADDRESS_PKID", Pkid)
      .query(
        "SELECT ua.*, c.COUNTRY_NAME, s.STATE_NAME, ci.CITY_NAME, (select case when count(*) > 0 then 1 else 0 end as cnt from [dbo].[ORDERS] where [ORDERS_ADDRESS_FKID] = ua.USER_ADDRESS_PKID) as ADDRESS_LINKED_STATUS FROM [USER_ADDRESS] ua join [dbo].[COUNTRY] c on c.COUNTRY_PKID = ua.USER_ADDRESS_COUNTRY_FKID join [dbo].[STATE] s on s.STATE_PKID = ua.USER_ADDRESS_STATE_FKID join [dbo].[CITY] ci on ci.CITY_PKID = ua.USER_ADDRESS_CITY_FKID where USER_ADDRESS_PKID = @USER_ADDRESS_PKID"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getUserAddressByAddressID-->", error);
    //
  }
}

async function UpdateDefaultAddress(Pkid, UserID) {
  try {
    var message = false;
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("USER_ADDRESS_PKID", Pkid)
      .input("USER_ADDRESS_USER_FKID", UserID)
      .query(
        "update USER_ADDRESS set USER_ADDRESS_DEFAULT= 0 where USER_ADDRESS_USER_FKID = @USER_ADDRESS_USER_FKID"
      );
    if (result.rowsAffected) {
      var result2 = await pool
        .request()
        .input("USER_ADDRESS_PKID", Pkid)
        .input("USER_ADDRESS_USER_FKID", UserID)
        .query(
          "update USER_ADDRESS set USER_ADDRESS_DEFAULT= 1 where USER_ADDRESS_PKID = @USER_ADDRESS_PKID"
        );
      if (result2.rowsAffected) {
        message = true;
      } else {
        message = false;
      }
    } else {
      message = false;
    }
    return message;
  } catch (error) {
    console.log("UpdateDefaultAddress-->", error);
    //
  }
}

async function getUserDefaultAddress(UserID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("USER_ADDRESS_USER_FKID", UserID)
      .query(
        "SELECT ua.*, c.COUNTRY_NAME, s.STATE_NAME, ci.CITY_NAME FROM [USER_ADDRESS] ua join [dbo].[COUNTRY] c on c.COUNTRY_PKID = ua.USER_ADDRESS_COUNTRY_FKID join [dbo].[STATE] s on s.STATE_PKID = ua.USER_ADDRESS_STATE_FKID join [dbo].[CITY] ci on ci.CITY_PKID = ua.USER_ADDRESS_CITY_FKID where USER_ADDRESS_USER_FKID = @USER_ADDRESS_USER_FKID and USER_ADDRESS_DEFAULT = 1"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getUserDefaultAddress-->", error);
    //
  }
}

async function addAddress(obj) {
  try {
    var pool = await sql.connect(config);
    var insertInto = await pool
      .request()
      .input("USER_ADDRESS_NAME", obj.USER_ADDRESS_NAME)
      .input("USER_ADDRESS_PHONE", obj.USER_ADDRESS_PHONE)
      .input("USER_ADDRESS_TYPE", obj.USER_ADDRESS_TYPE)
      .input("USER_ADDRESS_HOUSE_NO", obj.USER_ADDRESS_HOUSE_NO)
      .input("USER_ADDRESS_STREET", obj.USER_ADDRESS_STREET)
      .input("USER_ADDRESS_CITY_FKID", obj.USER_ADDRESS_CITY_FKID)
      .input("USER_ADDRESS_STATE_FKID", obj.USER_ADDRESS_STATE_FKID)
      .input("USER_ADDRESS_COUNTRY_FKID", obj.USER_ADDRESS_COUNTRY_FKID)
      .input("USER_ADDRESS_ZIPCODE", obj.USER_ADDRESS_ZIPCODE)
      .input("USER_ADDRESS_DEFAULT", obj.USER_ADDRESS_DEFAULT)
      .input("USER_ADDRESS_DATE", obj.USER_ADDRESS_DATE)
      .input("USER_ADDRESS_USER_FKID", obj.USER_ADDRESS_USER_FKID)
      .query(
        "insert into USER_ADDRESS (USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, USER_ADDRESS_CITY_FKID, USER_ADDRESS_STATE_FKID, USER_ADDRESS_COUNTRY_FKID, USER_ADDRESS_ZIPCODE, USER_ADDRESS_DEFAULT, USER_ADDRESS_USER_FKID, USER_ADDRESS_DATE)  values(@USER_ADDRESS_NAME, @USER_ADDRESS_PHONE, @USER_ADDRESS_TYPE, @USER_ADDRESS_HOUSE_NO, @USER_ADDRESS_STREET, @USER_ADDRESS_CITY_FKID, @USER_ADDRESS_STATE_FKID, @USER_ADDRESS_COUNTRY_FKID, @USER_ADDRESS_ZIPCODE, @USER_ADDRESS_DEFAULT, @USER_ADDRESS_USER_FKID,GETDATE())"
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
    console.log("addAddress-->", err);
  }
}

async function deleteAddress(AddressID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("USER_ADDRESS_PKID", AddressID)
      .query(
        "DELETE FROM USER_ADDRESS WHERE USER_ADDRESS_PKID=@USER_ADDRESS_PKID"
      );

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteAddress-->", error);
    //
  }
}

async function updateAddress(AddressID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("USER_ADDRESS_PKID", AddressID)
      .input("USER_ADDRESS_NAME", obj.USER_ADDRESS_NAME)
      .input("USER_ADDRESS_PHONE", obj.USER_ADDRESS_PHONE)
      .input("USER_ADDRESS_TYPE", obj.USER_ADDRESS_TYPE)
      .input("USER_ADDRESS_HOUSE_NO", obj.USER_ADDRESS_HOUSE_NO)
      .input("USER_ADDRESS_STREET", obj.USER_ADDRESS_STREET)
      .input("USER_ADDRESS_CITY_FKID", obj.USER_ADDRESS_CITY_FKID)
      .input("USER_ADDRESS_STATE_FKID", obj.USER_ADDRESS_STATE_FKID)
      .input("USER_ADDRESS_COUNTRY_FKID", obj.USER_ADDRESS_COUNTRY_FKID)
      .input("USER_ADDRESS_ZIPCODE", obj.USER_ADDRESS_ZIPCODE)
      .input("USER_ADDRESS_DEFAULT", obj.USER_ADDRESS_DEFAULT)
      .input("USER_ADDRESS_USER_FKID", obj.USER_ADDRESS_USER_FKID)
      .query(
        `UPDATE USER_ADDRESS SET USER_ADDRESS_NAME = @USER_ADDRESS_NAME, USER_ADDRESS_PHONE= @USER_ADDRESS_PHONE, USER_ADDRESS_TYPE = @USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO=@USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET=@USER_ADDRESS_STREET, USER_ADDRESS_CITY_FKID=@USER_ADDRESS_CITY_FKID, USER_ADDRESS_STATE_FKID=@USER_ADDRESS_STATE_FKID, USER_ADDRESS_COUNTRY_FKID=@USER_ADDRESS_COUNTRY_FKID,USER_ADDRESS_ZIPCODE=@USER_ADDRESS_ZIPCODE,USER_ADDRESS_DEFAULT=@USER_ADDRESS_DEFAULT,USER_ADDRESS_USER_FKID=@USER_ADDRESS_USER_FKID where USER_ADDRESS_PKID=@USER_ADDRESS_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("updateAddress-->", error);
  }
}

module.exports = {
  getAllAddress: getAllAddress,
  getUserDefaultAddress: getUserDefaultAddress,
  getUserAddressByAddressID: getUserAddressByAddressID,
  addAddress: addAddress,
  deleteAddress: deleteAddress,
  updateAddress: updateAddress,
  UpdateDefaultAddress: UpdateDefaultAddress,
};
