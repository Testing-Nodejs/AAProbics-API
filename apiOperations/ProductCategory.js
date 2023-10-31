/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllProductCategory() {
  try {
    var pool = await sql.connect(config);
    var result = await pool.request().query("SELECT * FROM [PRODUCT_CATEGORY]");
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllProductCategory-->", error);
    //
  }
}

async function getAllCategoryAndSubCategory() {
  var kimoArray = [];
  var Obj = {};
  var pool = await sql.connect(config);
  try {
    var result = await pool
      .request()
      .query(
        "SELECT * FROM PRODUCT_CATEGORY"
      );

    var kimo = result.recordsets[0];

    for (let i = 0; i < kimo.length; i++) {
      var res2 = await pool
        .request()
        .input("PRODUCT_SUB_CATEGORY_CAT_FKID", kimo[i].PRODUCT_CATEGORY_PKID)
        .query(
          "SELECT * from [PRODUCT_SUB_CATEGORY] WHERE [PRODUCT_SUB_CATEGORY_CAT_FKID]=@PRODUCT_SUB_CATEGORY_CAT_FKID"
        );

      Obj = {
        PRODUCT_CATEGORY_PKID: kimo[i].PRODUCT_CATEGORY_PKID,
        PRODUCT_CATEGORY_NAME: kimo[i].PRODUCT_CATEGORY_NAME,
        SubCategoryArr: res2.recordsets[0],
      };
      kimoArray.push(Obj);
    }

    return kimoArray;
  } catch (error) {
    console.log("getProductsByCompany-->", error);
  }
}

async function addProductCategory(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("PRODUCT_CATEGORY_NAME", sql.VarChar, obj.PRODUCT_CATEGORY_NAME)
      .query(
        "SELECT * from PRODUCT_CATEGORY WHERE PRODUCT_CATEGORY_NAME=@PRODUCT_CATEGORY_NAME"
      );
    if (result.rowsAffected[0] == 0) {
      var insertInto = await pool
        .request()
        .input("PRODUCT_CATEGORY_NAME", sql.NVarChar, obj.PRODUCT_CATEGORY_NAME)
        .query(
          "insert into PRODUCT_CATEGORY ([PRODUCT_CATEGORY_NAME])  values(@PRODUCT_CATEGORY_NAME)"
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
    console.log("addProductCategory-->", err);
  }
}

async function deleteProductCategory(CategoryID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("PRODUCT_CATEGORY_PKID", CategoryID)
      .query(
        "DELETE FROM PRODUCT_CATEGORY WHERE PRODUCT_CATEGORY_PKID=@PRODUCT_CATEGORY_PKID"
      );

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteProductCategory-->", error);
    //
  }
}

async function updateProductCategory(CategoryID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("PRODUCT_CATEGORY_PKID", CategoryID)
      .input("PRODUCT_CATEGORY_NAME", obj.PRODUCT_CATEGORY_NAME)
      .query(
        `UPDATE PRODUCT_CATEGORY SET PRODUCT_CATEGORY_NAME = @PRODUCT_CATEGORY_NAME WHERE PRODUCT_CATEGORY_PKID =@PRODUCT_CATEGORY_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("updateProductCategory-->", error);
  }
}

module.exports = {
  getAllProductCategory: getAllProductCategory,
  getAllCategoryAndSubCategory: getAllCategoryAndSubCategory,
  addProductCategory: addProductCategory,
  deleteProductCategory: deleteProductCategory,
  updateProductCategory: updateProductCategory,
};
