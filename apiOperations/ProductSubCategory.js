/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllProductSubCategory() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT * FROM [PRODUCT_SUB_CATEGORY] join PRODUCT_CATEGORY on PRODUCT_CATEGORY_PKID = PRODUCT_SUB_CATEGORY_CAT_FKID"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllProductSubCategory-->", error);
    //
  }
}

async function getSubCategoryByCategory(CategoryID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("PRODUCT_SUB_CATEGORY_CAT_FKID", sql.VarChar, CategoryID)
      .query(
        "SELECT * FROM [PRODUCT_SUB_CATEGORY] join PRODUCT_CATEGORY on PRODUCT_CATEGORY_PKID = PRODUCT_SUB_CATEGORY_CAT_FKID where PRODUCT_SUB_CATEGORY_CAT_FKID = @PRODUCT_SUB_CATEGORY_CAT_FKID"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllProductSubCategory-->", error);
    //
  }
}

async function addProductSubCategory(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input(
        "PRODUCT_SUB_CATEGORY_NAME",
        sql.VarChar,
        obj.PRODUCT_SUB_CATEGORY_NAME
      )
      .input(
        "PRODUCT_SUB_CATEGORY_CAT_FKID",
        sql.VarChar,
        obj.PRODUCT_SUB_CATEGORY_CAT_FKID
      )
      .query(
        "SELECT * from PRODUCT_SUB_CATEGORY WHERE PRODUCT_SUB_CATEGORY_CAT_FKID=@PRODUCT_SUB_CATEGORY_CAT_FKID and PRODUCT_SUB_CATEGORY_NAME = @PRODUCT_SUB_CATEGORY_NAME"
      );
    if (result.rowsAffected[0] == 0) {
      var insertInto = await pool
        .request()
        .input(
          "PRODUCT_SUB_CATEGORY_NAME",
          sql.VarChar,
          obj.PRODUCT_SUB_CATEGORY_NAME
        )
        .input(
          "PRODUCT_SUB_CATEGORY_CAT_FKID",
          sql.VarChar,
          obj.PRODUCT_SUB_CATEGORY_CAT_FKID
        )
        .query(
          "insert into PRODUCT_SUB_CATEGORY ([PRODUCT_SUB_CATEGORY_NAME], [PRODUCT_SUB_CATEGORY_CAT_FKID])  values(@PRODUCT_SUB_CATEGORY_NAME, @PRODUCT_SUB_CATEGORY_CAT_FKID)"
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
    console.log("addProductSubCategory-->", err);
  }
}

async function deleteProductSubCategory(CategoryID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("PRODUCT_SUB_CATEGORY_PKID", CategoryID)
      .query(
        "DELETE FROM PRODUCT_SUB_CATEGORY WHERE PRODUCT_SUB_CATEGORY_PKID=@PRODUCT_SUB_CATEGORY_PKID"
      );

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteProductSubCategory-->", error);
    //
  }
}

async function updateProductSubCategory(CategoryID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("PRODUCT_SUB_CATEGORY_PKID", CategoryID)
      .input("PRODUCT_SUB_CATEGORY_NAME", obj.PRODUCT_SUB_CATEGORY_NAME)
      .input("PRODUCT_SUB_CATEGORY_CAT_FKID", obj.PRODUCT_SUB_CATEGORY_CAT_FKID)
      .query(
        `UPDATE PRODUCT_SUB_CATEGORY SET PRODUCT_SUB_CATEGORY_NAME = @PRODUCT_SUB_CATEGORY_NAME, PRODUCT_SUB_CATEGORY_CAT_FKID = @PRODUCT_SUB_CATEGORY_CAT_FKID WHERE PRODUCT_SUB_CATEGORY_PKID =@PRODUCT_SUB_CATEGORY_PKID`
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
  getAllProductSubCategory: getAllProductSubCategory,
  getSubCategoryByCategory: getSubCategoryByCategory,
  addProductSubCategory: addProductSubCategory,
  deleteProductSubCategory: deleteProductSubCategory,
  updateProductSubCategory: updateProductSubCategory,
};
