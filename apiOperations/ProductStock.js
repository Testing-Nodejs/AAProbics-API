/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllProductStock() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT ps.*,pu.PRODUCT_UNIT_QTY, p.PRODUCT_NAME FROM [PRODUCT_STOCK] ps join PRODUCTS p on p.PRODUCT_PKID = ps.PRODUCT_STOCK_PROD_FKID join PRODUCT_UNIT pu on pu.PRODUCT_UNIT_PKID = ps.PRODUCT_STOCK_PROD_UNIT"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllProductStock-->", error);
    //
  }
}

async function getProductUnitsByProduct(ProductID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("PRODUCT_UNIT_PRODUCT_FKID", ProductID)
      .query(
        "SELECT * FROM PRODUCT_UNIT where PRODUCT_UNIT_PRODUCT_FKID = @PRODUCT_UNIT_PRODUCT_FKID"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getProductUnitsByProduct-->", error);
    //
  }
}

async function addProductStock(obj) {
  var message = false;
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }

    var result = await pool
      .request()
      .input("PRODUCT_STOCK_PROD_FKID", obj.PRODUCT_STOCK_PROD_FKID)
      .input("PRODUCT_STOCK_PROD_UNIT", obj.PRODUCT_STOCK_PROD_UNIT)
      .query(
        "select * from PRODUCT_STOCK where PRODUCT_STOCK_PROD_FKID = @PRODUCT_STOCK_PROD_FKID and PRODUCT_STOCK_PROD_UNIT = @PRODUCT_STOCK_PROD_UNIT"
      );
    console.log("--------");
    console.log(result.recordsets[0]);
    if (result.rowsAffected[0] == 0) {
      var insertInto = await pool
        .request()
        .input("PRODUCT_STOCK_PROD_FKID", obj.PRODUCT_STOCK_PROD_FKID)
        .input("PRODUCT_STOCK_PROD_UNIT", obj.PRODUCT_STOCK_PROD_UNIT)
        .input(
          "PRODUCT_STOCK_AVAILABLE_STOCK",
          obj.PRODUCT_STOCK_AVAILABLE_STOCK
        )
        .input("PRODUCT_STOCK_DATE", obj.PRODUCT_STOCK_DATE)
        .query(
          "insert into PRODUCT_STOCK (PRODUCT_STOCK_PROD_FKID,PRODUCT_STOCK_PROD_UNIT,PRODUCT_STOCK_AVAILABLE_STOCK,PRODUCT_STOCK_DATE)  values(@PRODUCT_STOCK_PROD_FKID,@PRODUCT_STOCK_PROD_UNIT,@PRODUCT_STOCK_AVAILABLE_STOCK,@PRODUCT_STOCK_DATE)"
        );

      if (pool._connected == false) {
        pool = await sql.connect(config);
      }
      if (insertInto.rowsAffected == 1) {
        message = true;
      } else {
        message = false;
      }
    } else {
      var previous_bal =
        parseInt(result.recordsets[0][0].PRODUCT_STOCK_AVAILABLE_STOCK) +
        parseInt(obj.PRODUCT_STOCK_AVAILABLE_STOCK);
      var newresult = await pool
        .request()
        .input("PRODUCT_STOCK_PROD_FKID", obj.PRODUCT_STOCK_PROD_FKID)
        .input("PRODUCT_STOCK_PROD_UNIT", obj.PRODUCT_STOCK_PROD_UNIT)
        .input("PRODUCT_STOCK_AVAILABLE_STOCK", previous_bal)
        .query(
          "update PRODUCT_STOCK set PRODUCT_STOCK_AVAILABLE_STOCK = @PRODUCT_STOCK_AVAILABLE_STOCK where PRODUCT_STOCK_PROD_FKID = @PRODUCT_STOCK_PROD_FKID and PRODUCT_STOCK_PROD_UNIT = @PRODUCT_STOCK_PROD_UNIT"
        );
      if (newresult.rowsAffected) {
        message = true;
      } else {
        message = false;
      }
    }

    var historyinsert = await pool
      .request()
      .input("STOCK_HISTORY_PROD_FKID", obj.PRODUCT_STOCK_PROD_FKID)
      .input("STOCK_HISTORY_PROD_UNIT", obj.PRODUCT_STOCK_PROD_UNIT)
      .input("STOCK_HISTORY_AVAILABLE_STOCK", obj.PRODUCT_STOCK_AVAILABLE_STOCK)
      .input("STOCK_HISTORY_MF_DATE", obj.PRODUCT_STOCK_DATE)
      .query(
        "insert into STOCK_HISTORY (STOCK_HISTORY_PROD_FKID,STOCK_HISTORY_PROD_UNIT,STOCK_HISTORY_AVAILABLE_STOCK,STOCK_HISTORY_MF_DATE,STOCK_HISTORY_DATE)  values(@STOCK_HISTORY_PROD_FKID,@STOCK_HISTORY_PROD_UNIT,@STOCK_HISTORY_AVAILABLE_STOCK,@STOCK_HISTORY_MF_DATE,GETDATE())"
      );
    console.log(historyinsert.rowsAffected);

    return message;
  } catch (err) {
    console.log("addProductStock-->", err);
  }
}

async function deleteProductStock(StockID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("PRODUCT_STOCK_PKID", StockID)
      .query(
        "DELETE FROM PRODUCT_STOCK WHERE PRODUCT_STOCK_PKID=@PRODUCT_STOCK_PKID"
      );

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteProductStock-->", error);
    //
  }
}

async function updateProductStock(StockID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("PRODUCT_STOCK_PKID", StockID)
      .input("PRODUCT_STOCK_PROD_FKID", obj.PRODUCT_STOCK_PROD_FKID)
      .input("PRODUCT_STOCK_PROD_UNIT", obj.PRODUCT_STOCK_PROD_UNIT)
      .input("PRODUCT_STOCK_AVAILABLE_STOCK", obj.PRODUCT_STOCK_AVAILABLE_STOCK)
      .input("PRODUCT_STOCK_DATE", obj.PRODUCT_STOCK_DATE)
      .query(
        `UPDATE PRODUCT_STOCK SET PRODUCT_STOCK_PROD_FKID = @PRODUCT_STOCK_PROD_FKID, PRODUCT_STOCK_PROD_UNIT= @PRODUCT_STOCK_PROD_UNIT, PRODUCT_STOCK_AVAILABLE_STOCK=@PRODUCT_STOCK_AVAILABLE_STOCK,PRODUCT_STOCK_DATE=@PRODUCT_STOCK_DATE WHERE PRODUCT_STOCK_PKID =@PRODUCT_STOCK_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("updateProductStock-->", error);
  }
}

async function ProductStockManagement() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select [PRODUCT_CATEGORY_NAME], [PRODUCT_SUB_CATEGORY_NAME], [PRODUCT_NAME], [PRODUCT_UNIT_QTY], (select cast([PRODUCT_STOCK_AVAILABLE_STOCK] as int) + (select sum(cast([ORDER_ITEM_QUANTITY] as int)) from [dbo].[ORDER_ITEMS] join ORDERS on ORDERS_PKID = ORDER_ITEM_ORDER_FKID where [ORDER_ITEM_PRODUCT_FKID] = PRODUCT_STOCK_PROD_FKID and PRODUCT_STOCK_PROD_UNIT = ORDER_ITEM_UNIT_FKID and ORDERS_STATUS > 0 and month(ORDERS_DATE) = month(getdate()) and year(ORDERS_DATE) = year(getdate()))) as TOTAL_STOCK, (select sum(cast([ORDER_ITEM_QUANTITY] as int)) from [dbo].[ORDER_ITEMS] join ORDERS on ORDERS_PKID = ORDER_ITEM_ORDER_FKID where [ORDER_ITEM_PRODUCT_FKID] = PRODUCT_STOCK_PROD_FKID and PRODUCT_STOCK_PROD_UNIT = ORDER_ITEM_UNIT_FKID and ORDERS_STATUS > 0 and month(ORDERS_DATE) = month(getdate())) as SALES_STOCK, [PRODUCT_STOCK_AVAILABLE_STOCK]as AVAILABLE_STOCK, (select month(getdate())) as MONTH_NUMBER from [dbo].[PRODUCT_STOCK] join [dbo].[PRODUCTS] on [PRODUCT_PKID] = [PRODUCT_STOCK_PROD_FKID] join [dbo].[PRODUCT_UNIT] on [PRODUCT_UNIT_PKID] = [PRODUCT_STOCK_PROD_UNIT] join [dbo].[PRODUCT_CATEGORY] on [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] join [dbo].[PRODUCT_SUB_CATEGORY] on [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] where month([PRODUCT_STOCK_DATE]) = month(getdate()) and year([PRODUCT_STOCK_DATE]) = year(getdate())"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductStockManagement-->", error);
    //
  }
}

async function ProductStockManagementFilter(Year, Month) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select [PRODUCT_CATEGORY_NAME], [PRODUCT_SUB_CATEGORY_NAME], [PRODUCT_NAME], [PRODUCT_UNIT_QTY], (select cast([PRODUCT_STOCK_AVAILABLE_STOCK] as int) + (select sum(cast([ORDER_ITEM_QUANTITY] as int)) from [dbo].[ORDER_ITEMS] join ORDERS on ORDERS_PKID = ORDER_ITEM_ORDER_FKID where [ORDER_ITEM_PRODUCT_FKID] = PRODUCT_STOCK_PROD_FKID and PRODUCT_STOCK_PROD_UNIT = ORDER_ITEM_UNIT_FKID and ORDERS_STATUS > 0 and month(ORDERS_DATE) = '" +
          Month +
          "' and year(ORDERS_DATE) = '" +
          Year +
          "')) as TOTAL_STOCK, (select sum(cast([ORDER_ITEM_QUANTITY] as int)) from [dbo].[ORDER_ITEMS] join ORDERS on ORDERS_PKID = ORDER_ITEM_ORDER_FKID where [ORDER_ITEM_PRODUCT_FKID] = PRODUCT_STOCK_PROD_FKID and PRODUCT_STOCK_PROD_UNIT = ORDER_ITEM_UNIT_FKID and ORDERS_STATUS > 0 and month(ORDERS_DATE) = '" +
          Month +
          "' and year(ORDERS_DATE) = '" +
          Year +
          "') as SALES_STOCK, [PRODUCT_STOCK_AVAILABLE_STOCK]as AVAILABLE_STOCK, (select '" +
          Month +
          "') as MONTH_NUMBER from [dbo].[PRODUCT_STOCK] join [dbo].[PRODUCTS] on [PRODUCT_PKID] = [PRODUCT_STOCK_PROD_FKID] join [dbo].[PRODUCT_UNIT] on [PRODUCT_UNIT_PKID] = [PRODUCT_STOCK_PROD_UNIT] join [dbo].[PRODUCT_CATEGORY] on [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] join [dbo].[PRODUCT_SUB_CATEGORY] on [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] where month([PRODUCT_STOCK_DATE]) = '" +
          Month +
          "' and year([PRODUCT_STOCK_DATE]) = '" +
          Year +
          "'"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductStockManagementFilter-->", error);
    //
  }
}

module.exports = {
  getAllProductStock: getAllProductStock,
  getProductUnitsByProduct: getProductUnitsByProduct,
  addProductStock: addProductStock,
  deleteProductStock: deleteProductStock,
  updateProductStock: updateProductStock,
  ProductStockManagement: ProductStockManagement,
  ProductStockManagementFilter: ProductStockManagementFilter,
};
