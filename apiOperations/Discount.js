/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllDiscount() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT * from DISCOUNT"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllDiscount-->", error);
  }
}

async function addDiscount(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var insertInto = await pool
      .request()
      .input("DISCOUNT_NUMBER_OF_PRODUCTS", obj.DISCOUNT_NUMBER_OF_PRODUCTS)
      .input("DISCOUNT_PERCENTAGE", obj.DISCOUNT_PERCENTAGE)
      .query(
        "insert into DISCOUNT ([DISCOUNT_NUMBER_OF_PRODUCTS],[DISCOUNT_PERCENTAGE])  values(@DISCOUNT_NUMBER_OF_PRODUCTS,@DISCOUNT_PERCENTAGE)"
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
    console.log("addDiscount-->", err);
  }
}

async function deleteDiscount(DiscountID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("DISCOUNT_PKID", DiscountID)
      .query("DELETE FROM DISCOUNT WHERE DISCOUNT_PKID=@DISCOUNT_PKID");

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteDiscount-->", error);
    //
  }
}

async function updateDiscount(DiscountID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("DISCOUNT_PKID", DiscountID)
      .input("DISCOUNT_NUMBER_OF_PRODUCTS", obj.DISCOUNT_NUMBER_OF_PRODUCTS)
      .input("DISCOUNT_PERCENTAGE", obj.DISCOUNT_PERCENTAGE)
      .query(
        `UPDATE DISCOUNT SET DISCOUNT_NUMBER_OF_PRODUCTS = @DISCOUNT_NUMBER_OF_PRODUCTS, DISCOUNT_PERCENTAGE= @DISCOUNT_PERCENTAGE WHERE DISCOUNT_PKID =@DISCOUNT_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("updateDiscount-->", error);
  }
}

module.exports = {
    getAllDiscount: getAllDiscount,
  addDiscount: addDiscount,
  deleteDiscount: deleteDiscount,
  updateDiscount: updateDiscount,
};
