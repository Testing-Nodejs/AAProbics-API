var config = require("../dbconfig");
const sql = require("mssql");

async function GetAllStockHistory() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select PRODUCT_UNIT_QTY,[PRODUCT_PKID], [PRODUCT_CATEGORY_NAME], [PRODUCT_SUB_CATEGORY_NAME], [PRODUCT_NAME], [STOCK_HISTORY_AVAILABLE_STOCK], [STOCK_HISTORY_MF_DATE], [STOCK_HISTORY_DATE] from [dbo].[STOCK_HISTORY] join [dbo].[PRODUCTS] on [PRODUCT_PKID] = [STOCK_HISTORY_PROD_FKID] join [dbo].[PRODUCT_UNIT] on [PRODUCT_UNIT_PKID] = [STOCK_HISTORY_PROD_UNIT] join [dbo].[PRODUCT_CATEGORY] on [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] join [dbo].[PRODUCT_SUB_CATEGORY] on [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID]"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("GetAllStockHistory-->", error);
    //
  }
}

async function ProductStockHistoryProducts() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select distinct [PRODUCT_PKID], [PRODUCT_NAME] from [dbo].[STOCK_HISTORY] join [dbo].[PRODUCTS] on [PRODUCT_PKID] = [STOCK_HISTORY_PROD_FKID] join [dbo].[PRODUCT_UNIT] on [PRODUCT_UNIT_PKID] = [STOCK_HISTORY_PROD_UNIT] join [dbo].[PRODUCT_CATEGORY] on [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] join [dbo].[PRODUCT_SUB_CATEGORY] on [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID]"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductStockHistoryProducts-->", error);
    //
  }
}

async function ProductStockHistoryByProducts(ProductID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select PRODUCT_UNIT_QTY,[PRODUCT_PKID], [PRODUCT_CATEGORY_NAME], [PRODUCT_SUB_CATEGORY_NAME], [PRODUCT_NAME], [STOCK_HISTORY_AVAILABLE_STOCK], [STOCK_HISTORY_MF_DATE], [STOCK_HISTORY_DATE] from [dbo].[STOCK_HISTORY] join [dbo].[PRODUCTS] on [PRODUCT_PKID] = [STOCK_HISTORY_PROD_FKID] join [dbo].[PRODUCT_UNIT] on [PRODUCT_UNIT_PKID] = [STOCK_HISTORY_PROD_UNIT] join [dbo].[PRODUCT_CATEGORY] on [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] join [dbo].[PRODUCT_SUB_CATEGORY] on [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] where PRODUCT_PKID = '" +
          ProductID +
          "'"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductStockHistoryByProducts-->", error);
    //
  }
}

async function ProductStockHistoryByDates(Fdate, Tdate) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select PRODUCT_UNIT_QTY,[PRODUCT_PKID], [PRODUCT_CATEGORY_NAME], [PRODUCT_SUB_CATEGORY_NAME], [PRODUCT_NAME], [STOCK_HISTORY_AVAILABLE_STOCK], [STOCK_HISTORY_MF_DATE], [STOCK_HISTORY_DATE] from [dbo].[STOCK_HISTORY] join [dbo].[PRODUCTS] on [PRODUCT_PKID] = [STOCK_HISTORY_PROD_FKID] join [dbo].[PRODUCT_UNIT] on [PRODUCT_UNIT_PKID] = [STOCK_HISTORY_PROD_UNIT] join [dbo].[PRODUCT_CATEGORY] on [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] join [dbo].[PRODUCT_SUB_CATEGORY] on [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] where STOCK_HISTORY_DATE between '" +
          Fdate +
          "' and '" +
          Tdate +
          "'"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductStockHistoryByDates-->", error);
    //
  }
}

module.exports = {
  GetAllStockHistory: GetAllStockHistory,
  ProductStockHistoryProducts: ProductStockHistoryProducts,
  ProductStockHistoryByProducts: ProductStockHistoryByProducts,
  ProductStockHistoryByDates: ProductStockHistoryByDates,
};
