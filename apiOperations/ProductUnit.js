/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllProductUnits() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT * FROM [PRODUCT_UNIT] join PRODUCTS on PRODUCT_PKID = PRODUCT_UNIT_PRODUCT_FKID"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllProductUnits-->", error);
    //
  }
}

async function getAllProductUnitsByProductID(ProductID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("PRODUCT_UNIT_PRODUCT_FKID", ProductID)
      .query(
        "SELECT * FROM [PRODUCT_UNIT] join PRODUCTS on PRODUCT_PKID = PRODUCT_UNIT_PRODUCT_FKID where PRODUCT_UNIT_PRODUCT_FKID = @PRODUCT_UNIT_PRODUCT_FKID"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllProductUnitsByProductID-->", error);
    //
  }
}

async function getAllProductUnitsByUnitID(UnitID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("PRODUCT_UNIT_PKID", UnitID)
      .query(
        "SELECT * FROM [PRODUCT_UNIT] join PRODUCTS on PRODUCT_PKID = PRODUCT_UNIT_PRODUCT_FKID where PRODUCT_UNIT_PKID = @PRODUCT_UNIT_PKID"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllProductUnitsByUnitID-->", error);
    //
  }
}

async function addProductUnits(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("PRODUCT_UNIT_PRODUCT_FKID", obj.PRODUCT_UNIT_PRODUCT_FKID)
      .input("PRODUCT_UNIT_QTY", obj.PRODUCT_UNIT_QTY)
      .query(
        "SELECT * from PRODUCT_UNIT WHERE PRODUCT_UNIT_PRODUCT_FKID=@PRODUCT_UNIT_PRODUCT_FKID and PRODUCT_UNIT_QTY=@PRODUCT_UNIT_QTY"
      );
    if (result.rowsAffected[0] == 0) {
      var insertInto = await pool
        .request()
        .input("PRODUCT_UNIT_PRODUCT_FKID", obj.PRODUCT_UNIT_PRODUCT_FKID)
        .input("PRODUCT_UNIT_QTY", obj.PRODUCT_UNIT_QTY)
        .input("PRODUCT_UNIT_WEIGHT", obj.PRODUCT_UNIT_WEIGHT)
        .input("PRODUCT_UNIT_SELLING_PRICE", obj.PRODUCT_UNIT_SELLING_PRICE)
        .input("PRODUCT_UNIT_ACTUAL_PRICE", obj.PRODUCT_UNIT_ACTUAL_PRICE)
        .input(
          "PRODUCT_UNIT_GENERAL_DISCOUNT",
          obj.PRODUCT_UNIT_GENERAL_DISCOUNT
        )
        .query(
          "insert into PRODUCT_UNIT (PRODUCT_UNIT_PRODUCT_FKID, PRODUCT_UNIT_QTY, PRODUCT_UNIT_WEIGHT,PRODUCT_UNIT_SELLING_PRICE,PRODUCT_UNIT_ACTUAL_PRICE,PRODUCT_UNIT_GENERAL_DISCOUNT)  values(@PRODUCT_UNIT_PRODUCT_FKID, @PRODUCT_UNIT_QTY, @PRODUCT_UNIT_WEIGHT,@PRODUCT_UNIT_SELLING_PRICE,@PRODUCT_UNIT_ACTUAL_PRICE,@PRODUCT_UNIT_GENERAL_DISCOUNT)"
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
    console.log("addProductUnits-->", err);
  }
}

async function deleteProductUnit(UnitID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("PRODUCT_UNIT_PKID", UnitID)
      .query(
        "DELETE FROM PRODUCT_UNIT WHERE PRODUCT_UNIT_PKID=@PRODUCT_UNIT_PKID"
      );

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteProductUnit-->", error);
    //
  }
}

async function updateProductUnit(UnitID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("PRODUCT_UNIT_PKID", UnitID)
      .input("PRODUCT_UNIT_PRODUCT_FKID", obj.PRODUCT_UNIT_PRODUCT_FKID)
      .input("PRODUCT_UNIT_QTY", obj.PRODUCT_UNIT_QTY)
      .input("PRODUCT_UNIT_WEIGHT", obj.PRODUCT_UNIT_WEIGHT)
      .input("PRODUCT_UNIT_SELLING_PRICE", obj.PRODUCT_UNIT_SELLING_PRICE)
      .input("PRODUCT_UNIT_ACTUAL_PRICE", obj.PRODUCT_UNIT_ACTUAL_PRICE)
      .input("PRODUCT_UNIT_GENERAL_DISCOUNT", obj.PRODUCT_UNIT_GENERAL_DISCOUNT)
      .query(
        `UPDATE PRODUCT_UNIT SET PRODUCT_UNIT_PRODUCT_FKID = @PRODUCT_UNIT_PRODUCT_FKID, PRODUCT_UNIT_QTY=@PRODUCT_UNIT_QTY,PRODUCT_UNIT_WEIGHT=@PRODUCT_UNIT_WEIGHT,PRODUCT_UNIT_SELLING_PRICE=@PRODUCT_UNIT_SELLING_PRICE,PRODUCT_UNIT_ACTUAL_PRICE=@PRODUCT_UNIT_ACTUAL_PRICE,PRODUCT_UNIT_GENERAL_DISCOUNT=@PRODUCT_UNIT_GENERAL_DISCOUNT WHERE PRODUCT_UNIT_PKID =@PRODUCT_UNIT_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("updateProductUnit-->", error);
  }
}

module.exports = {
  getAllProductUnits: getAllProductUnits,
  getAllProductUnitsByProductID: getAllProductUnitsByProductID,
  getAllProductUnitsByUnitID: getAllProductUnitsByUnitID,
  addProductUnits: addProductUnits,
  deleteProductUnit: deleteProductUnit,
  updateProductUnit: updateProductUnit,
};
