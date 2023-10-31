/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllCoupons() {
  try {
    var pool = await sql.connect(config);
    var result = await pool.request().query("SELECT * FROM [COUPON]");
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllCoupons-->", error);
    //
  }
}

async function getAllCouponsForWeb() {
  try {
    var pool = await sql.connect(config);
    var result = await pool.request().query("SELECT * FROM [COUPON] where COUPON_SHOW_IN_WEB = 1");
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllCouponsForWeb-->", error);
    //
  }
}

async function addCoupons(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("COUPON_NAME", sql.VarChar, obj.COUPON_NAME)
      .query("SELECT * from COUPON WHERE COUPON_NAME=@COUPON_NAME");
    if (result.rowsAffected[0] == 0) {
      var insertInto = await pool
        .request()
        .input("COUPON_CODE", obj.COUPON_CODE)
        .input("COUPON_DISCOUNT", obj.COUPON_DISCOUNT)
        .input("COUPON_NAME", obj.COUPON_NAME)
        .input("COUPON_SHOW_IN_WEB", obj.COUPON_SHOW_IN_WEB)
        .input("COUPON_ACTIVE", "1")
        .query(
          "insert into COUPON (COUPON_CODE,COUPON_DISCOUNT,COUPON_NAME,COUPON_ACTIVE,COUPON_SHOW_IN_WEB)  values(@COUPON_CODE,@COUPON_DISCOUNT,@COUPON_NAME,@COUPON_ACTIVE,@COUPON_SHOW_IN_WEB)"
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
    console.log("addCoupons-->", err);
  }
}

async function VerifyCoupon(obj) {
  var kimoArray = [];
  var Obj = {};
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("COUPON_CODE", obj.COUPON_CODE)
      .query("SELECT * from COUPON WHERE COUPON_CODE=@COUPON_CODE");
    if (result.rowsAffected[0] == 0) {
      var InnerRes = await pool
        .request()
        .input("MEMBER_COUPON_CODE", obj.COUPON_CODE)
        .query(
          "SELECT * from MEMBER_COUPON join [dbo].[MEMBER] on [MEMBER_PKID] = [MEMBER_COUPON_MEMBER_FKID] WHERE MEMBER_COUPON_CODE=@MEMBER_COUPON_CODE"
        );
      if (InnerRes.rowsAffected[0] > 0) {
        var kimo1 = InnerRes.recordsets[0];
        for (let i = 0; i < kimo1.length; i++) {
          Obj = {
            Pkid: kimo1[i].MEMBER_COUPON_PKID,
            Discount: kimo1[i].MEMBER_COUPON_DISCOUNT,
            Type: kimo1[i].MEMBER_TYPE == 1 ? "Doctor" : "AAProbics Member",
          };
          kimoArray.push(Obj);
        }
      }
    } else {
      var kimo = result.recordsets[0];
      for (let i = 0; i < kimo.length; i++) {
        Obj = {
          Pkid: kimo[i].COUPON_PKID,
          Discount: kimo[i].COUPON_DISCOUNT,
          Type: "AAProbics",
        };
        kimoArray.push(Obj);
      }
    }
    return kimoArray;
  } catch (err) {
    console.log("VerifyCoupon-->", err);
  }
}

async function deleteCoupons(CountryID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("COUPON_PKID", CountryID)
      .query("DELETE FROM COUPON WHERE COUPON_PKID=@COUPON_PKID");

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteCoupons-->", error);
    //
  }
}

async function updateCoupons(CouponID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("COUPON_PKID", CouponID)
      .input("COUPON_CODE", obj.COUPON_CODE)
      .input("COUPON_DISCOUNT", obj.COUPON_DISCOUNT)
      .input("COUPON_NAME", obj.COUPON_NAME)
      .input("COUPON_SHOW_IN_WEB", obj.COUPON_SHOW_IN_WEB)
      .input("COUPON_ACTIVE", obj.COUPON_ACTIVE)
      .query(
        `UPDATE COUPON SET COUPON_SHOW_IN_WEB = @COUPON_SHOW_IN_WEB, COUPON_CODE = @COUPON_CODE, COUPON_DISCOUNT= @COUPON_DISCOUNT,COUPON_NAME=@COUPON_NAME,COUPON_ACTIVE=1 WHERE COUPON_PKID =@COUPON_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("updateCoupons-->", error);
  }
}

module.exports = {
  getAllCoupons: getAllCoupons,
  getAllCouponsForWeb: getAllCouponsForWeb,
  addCoupons: addCoupons,
  VerifyCoupon: VerifyCoupon,
  deleteCoupons: deleteCoupons,
  updateCoupons: updateCoupons,
};
