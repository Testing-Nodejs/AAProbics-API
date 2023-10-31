/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllMemberCoupons() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT distinct MEMBER_PKID, MEMBER_NAME,MEMBER_EMAIL FROM [MEMBER_COUPON] join MEMBER on MEMBER_PKID = MEMBER_COUPON_MEMBER_FKID"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllMemberCoupons-->", error);
    //
  }
}

async function getAllMemberCouponsCode(MemberID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("MEMBER_COUPON_MEMBER_FKID", MemberID)
      .query(
        "SELECT * FROM [MEMBER_COUPON] join MEMBER on MEMBER_PKID = MEMBER_COUPON_MEMBER_FKID where MEMBER_COUPON_MEMBER_FKID = @MEMBER_COUPON_MEMBER_FKID"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllMemberCouponsCode-->", error);
    //
  }
}

async function addMemberCoupons(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var MemberCoupon = obj.Coupons;
    var result = await pool
      .request()
      .input("MEMBER_COUPON_MEMBER_FKID", MemberCoupon[0].MEMBER_COUPON_MEMBER_FKID)
      .query("SELECT * from MEMBER_COUPON WHERE MEMBER_COUPON_MEMBER_FKID=@MEMBER_COUPON_MEMBER_FKID");
    if (result.rowsAffected[0] == 0) {
      for (var i = 0; i < MemberCoupon.length; i++) {
        var insertInto = await pool
          .request()
          .input(
            "MEMBER_COUPON_MEMBER_FKID",
            MemberCoupon[i].MEMBER_COUPON_MEMBER_FKID
          )
          .input("MEMBER_COUPON_CODE", MemberCoupon[i].MEMBER_COUPON_CODE)
          .input(
            "MEMBER_COUPON_DISCOUNT",
            MemberCoupon[i].MEMBER_COUPON_DISCOUNT
          )
          .query(
            "insert into MEMBER_COUPON (MEMBER_COUPON_MEMBER_FKID, MEMBER_COUPON_CODE, MEMBER_COUPON_DISCOUNT,MEMBER_COUPON_ACTIVE)  values(@MEMBER_COUPON_MEMBER_FKID, @MEMBER_COUPON_CODE, @MEMBER_COUPON_DISCOUNT, 1)"
          );
        if (pool._connected == false) {
          pool = await sql.connect(config);
        }
      }
      return true;
    }else{
      return false;
    }
    
  } catch (err) {
    console.log("addMemberCoupons-->", err);
  }
}

async function deleteMemberCoupons(MemberID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("MEMBER_COUPON_MEMBER_FKID", MemberID)
      .query(
        "DELETE FROM MEMBER_COUPON WHERE MEMBER_COUPON_MEMBER_FKID=@MEMBER_COUPON_MEMBER_FKID"
      );

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteMemberCoupons-->", error);
    //
  }
}

async function updateMemberCoupons(MemberCouponID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("MEMBER_COUPON_MEMBER_FKID", MemberCouponID)
      .query(
        "DELETE FROM MEMBER_COUPON WHERE MEMBER_COUPON_MEMBER_FKID=@MEMBER_COUPON_MEMBER_FKID"
      );

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      var MemberCoupon = obj.Coupons;
      for (var i = 0; i < MemberCoupon.length; i++) {
        var insertInto = await pool
          .request()
          .input(
            "MEMBER_COUPON_MEMBER_FKID",
            MemberCoupon[i].MEMBER_COUPON_MEMBER_FKID
          )
          .input("MEMBER_COUPON_CODE", MemberCoupon[i].MEMBER_COUPON_CODE)
          .input(
            "MEMBER_COUPON_DISCOUNT",
            MemberCoupon[i].MEMBER_COUPON_DISCOUNT
          )
          .query(
            "insert into MEMBER_COUPON (MEMBER_COUPON_MEMBER_FKID, MEMBER_COUPON_CODE, MEMBER_COUPON_DISCOUNT,MEMBER_COUPON_ACTIVE)  values(@MEMBER_COUPON_MEMBER_FKID, @MEMBER_COUPON_CODE, @MEMBER_COUPON_DISCOUNT, 1)"
          );
        if (pool._connected == false) {
          pool = await sql.connect(config);
        }
      }
      return true;
    }
  } catch (error) {
    console.log("updateMemberCoupons-->", error);
  }
}

module.exports = {
  getAllMemberCoupons: getAllMemberCoupons,
  getAllMemberCouponsCode: getAllMemberCouponsCode,
  addMemberCoupons: addMemberCoupons,
  deleteMemberCoupons: deleteMemberCoupons,
  updateMemberCoupons: updateMemberCoupons,
};
