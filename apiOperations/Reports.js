/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function AllOrders() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select isnull(ORDERS_DOC, '-') as ORDERS_DOC, ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE  from [dbo].[ORDERS] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join CITY on CITY_PKID = USER_ADDRESS_CITY_FKID join STATE on STATE_PKID = USER_ADDRESS_STATE_FKID join COUNTRY on COUNTRY_PKID = USER_ADDRESS_COUNTRY_FKID where year([ORDERS_DATE]) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("AllOrders-->", error);
  }
}

async function AllOrdersFilterByMonth(MonthNo) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select isnull(ORDERS_DOC, '-') as ORDERS_DOC,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE  from [dbo].[ORDERS] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join CITY on CITY_PKID = USER_ADDRESS_CITY_FKID join STATE on STATE_PKID = USER_ADDRESS_STATE_FKID join COUNTRY on COUNTRY_PKID = USER_ADDRESS_COUNTRY_FKID where month(ORDERS_DATE) = " +
          MonthNo +
          " and  year(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("AllOrdersFilterByMonth-->", error);
  }
}

async function AllOrdersFilterByDates(Fdate, Tdate) {
  try {
    console.log(Fdate);
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select isnull(ORDERS_DOC, '-') as ORDERS_DOC,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE  from [dbo].[ORDERS] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join CITY on CITY_PKID = USER_ADDRESS_CITY_FKID join STATE on STATE_PKID = USER_ADDRESS_STATE_FKID join COUNTRY on COUNTRY_PKID = USER_ADDRESS_COUNTRY_FKID where ORDERS_DATE between '" +
          Fdate +
          "' and '" +
          Tdate +
          "' and  year(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("AllOrdersFilterByDates-->", error);
  }
}

async function AllOrdersFilterByYear(Year) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select isnull(ORDERS_DOC, '-') as ORDERS_DOC,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE  from [dbo].[ORDERS] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join CITY on CITY_PKID = USER_ADDRESS_CITY_FKID join STATE on STATE_PKID = USER_ADDRESS_STATE_FKID join COUNTRY on COUNTRY_PKID = USER_ADDRESS_COUNTRY_FKID where year(ORDERS_DATE) = " +
          Year +
          " order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("AllOrdersFilterByYear-->", error);
  }
}

async function YearlyReport() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select isnull(ORDERS_DOC, '-') as ORDERS_DOC, ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE  from [dbo].[ORDERS] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join CITY on CITY_PKID = USER_ADDRESS_CITY_FKID join STATE on STATE_PKID = USER_ADDRESS_STATE_FKID join COUNTRY on COUNTRY_PKID = USER_ADDRESS_COUNTRY_FKID where ORDERS_STATUS = 4 and year(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("YearlyReport-->", error);
  }
}

async function YearlyReportByYear(Year) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select isnull(ORDERS_DOC, '-') as ORDERS_DOC, ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE  from [dbo].[ORDERS] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join CITY on CITY_PKID = USER_ADDRESS_CITY_FKID join STATE on STATE_PKID = USER_ADDRESS_STATE_FKID join COUNTRY on COUNTRY_PKID = USER_ADDRESS_COUNTRY_FKID where ORDERS_STATUS = 4 and year(ORDERS_DATE) = '"+Year+"' order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("YearlyReportByYear-->", error);
  }
}

async function YearlyReportByDate(Fdate, Tdate) {
  try {
    console.log(Fdate);
    console.log(Tdate);
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select isnull(ORDERS_DOC, '-') as ORDERS_DOC, ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE  from [dbo].[ORDERS] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join CITY on CITY_PKID = USER_ADDRESS_CITY_FKID join STATE on STATE_PKID = USER_ADDRESS_STATE_FKID join COUNTRY on COUNTRY_PKID = USER_ADDRESS_COUNTRY_FKID where ORDERS_STATUS = 4 and ORDERS_DATE  between '" +
          Fdate +
          "' and '" +
          Tdate +
          "' order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("YearlyReportByDate-->", error);
  }
}

async function getYearLists() {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().execute("GetYearList");

    return result.recordsets[0];
  } catch (error) {
    console.log("getYearLists-->", error);
  }
}

async function CurrentDayOrder() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select isnull(ORDERS_DOC, '-') as ORDERS_DOC, ORDERS_STATUS, [ORDERS_PKID], REGISTERED_USERS_EMAIL,[ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE  from [dbo].[ORDERS] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join CITY on CITY_PKID = USER_ADDRESS_CITY_FKID join STATE on STATE_PKID = USER_ADDRESS_STATE_FKID join COUNTRY on COUNTRY_PKID = USER_ADDRESS_COUNTRY_FKID where ORDERS_STATUS = 4 and day([ORDERS_DATE]) = day(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("CurrentDayOrder-->", error);
  }
}

async function ProductSalesReport() {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "SELECT [PRODUCT_PKID],[PRODUCT_NAME],[PRODUCT_CATEGORY_NAME],[PRODUCT_SUB_CATEGORY_NAME], (SELECT count(distinct ORDERS_NUMBER) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] on [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] where [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID and ORDERS_STATUS = 4) as 'ORDER_COUNT',  isnull((SELECT sum(cast([ORDER_ITEM_QUANTITY] as int)) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] on [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] where [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID and ORDERS_STATUS = 4), '0') as 'ORDER_QUANTITY'  FROM [dbo].[PRODUCTS] AS t  join [dbo].[PRODUCT_CATEGORY] on [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] join [dbo].[PRODUCT_SUB_CATEGORY] on [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] where (SELECT count(*) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] on [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] where [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID) !=0"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductSalesReport-->", error);
    //
  }
}

async function ProductSalesReportGetMonth(Month) {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "SELECT [PRODUCT_PKID],[PRODUCT_NAME],[PRODUCT_CATEGORY_NAME],[PRODUCT_SUB_CATEGORY_NAME],(SELECT COUNT(DISTINCT ORDERS_NUMBER) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4 AND MONTH(ORDERS_DATE) = " + Month+ ") AS 'ORDER_COUNT', ISNULL((SELECT SUM(CAST([ORDER_ITEM_QUANTITY] AS INT)) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4 AND MONTH(ORDERS_DATE) = " + Month+ "), '0') AS 'ORDER_QUANTITY',(SELECT [MONTH_NAME] FROM [dbo].[MONTH_LIST] WHERE [MONTH_NO] = " + Month+ ") AS 'SALEMONTH' FROM [dbo].[PRODUCTS] AS t JOIN [dbo].[PRODUCT_CATEGORY] ON [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] JOIN [dbo].[PRODUCT_SUB_CATEGORY] ON [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] WHERE (SELECT COUNT(*) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID and month([ORDERS_DATE]) = " + Month + ") !=0");
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductSalesReportGetMonth-->", error);
    //
  }
}

async function ProductSalesReportGetDate(Fdate, Tdate) {
  try {
    console.log(Fdate);
    console.log(Tdate);
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT [PRODUCT_PKID],[PRODUCT_NAME],[PRODUCT_CATEGORY_NAME],[PRODUCT_SUB_CATEGORY_NAME], (SELECT COUNT(DISTINCT ORDERS_NUMBER) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4 AND ORDERS_DATE between '"+Fdate+"' and '"+Tdate+"') AS 'ORDER_COUNT', ISNULL((SELECT SUM(CAST([ORDER_ITEM_QUANTITY] AS INT)) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4 AND ORDERS_DATE between '"+Fdate+"' and '"+Tdate+"'), '0') AS 'ORDER_QUANTITY' FROM [dbo].[PRODUCTS] AS t JOIN [dbo].[PRODUCT_CATEGORY] ON [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] JOIN [dbo].[PRODUCT_SUB_CATEGORY] ON [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] WHERE (SELECT COUNT(*) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID and [ORDERS_DATE] between '"+Fdate+"' and '"+Tdate+"') != 0"
         
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductSalesReportGetDate-->", error);
  }
}

async function ProductSalesReportGetCurrentDate() {
  try {
    
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT [PRODUCT_PKID],[PRODUCT_NAME],[PRODUCT_CATEGORY_NAME],[PRODUCT_SUB_CATEGORY_NAME],(SELECT COUNT(DISTINCT ORDERS_NUMBER) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4 AND [ORDERS_DATE] = getDate()) AS 'ORDER_COUNT', ISNULL((SELECT SUM(CAST([ORDER_ITEM_QUANTITY] AS INT)) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4 AND [ORDERS_DATE] = getDate()), '0') AS 'ORDER_QUANTITY' FROM [dbo].[PRODUCTS] AS t JOIN [dbo].[PRODUCT_CATEGORY] ON [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] JOIN [dbo].[PRODUCT_SUB_CATEGORY] ON [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] WHERE (SELECT COUNT(*) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND [ORDERS_DATE] = getDate()) != 0"
         
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductSalesReportGetCurrentDate-->", error);
  }
}

async function ProductUnitSalesReport() {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "SELECT PRODUCT_UNIT_PKID,[PRODUCT_PKID],[PRODUCT_NAME],[PRODUCT_UNIT_QTY],[PRODUCT_CATEGORY_NAME],[PRODUCT_SUB_CATEGORY_NAME],(SELECT count(distinct [ORDER_ITEM_ORDER_FKID]) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] on [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] where [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID and [ORDER_ITEM_UNIT_FKID] = pt.[PRODUCT_UNIT_PKID] and ORDERS_STATUS = 4) as 'ORDER_COUNT',isnull((SELECT SUM(CAST([ORDER_ITEM_QUANTITY] AS INT)) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] on [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] where [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID and [ORDER_ITEM_UNIT_FKID] = pt.[PRODUCT_UNIT_PKID] and ORDERS_STATUS = 4), '0') as 'ORDER_QUANTITY' FROM [dbo].[PRODUCTS] AS t join [dbo].[PRODUCT_UNIT] as pt on pt.[PRODUCT_UNIT_PRODUCT_FKID] = t.PRODUCT_PKID   join [dbo].[PRODUCT_CATEGORY] on [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] join [dbo].[PRODUCT_SUB_CATEGORY] on [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] where (SELECT count(distinct [ORDER_ITEM_ORDER_FKID]) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] on [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] where [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID and [ORDER_ITEM_UNIT_FKID] = pt.[PRODUCT_UNIT_PKID]) != 0"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductUnitSalesReport-->", error);
    //
  }
}

async function ProductUnitSalesReportGetMonth(Month) {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "SELECT PRODUCT_UNIT_PKID,[PRODUCT_PKID],[PRODUCT_NAME],[PRODUCT_UNIT_QTY],[PRODUCT_CATEGORY_NAME],[PRODUCT_SUB_CATEGORY_NAME],(SELECT COUNT(DISTINCT [ORDER_ITEM_ORDER_FKID])FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID]WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND[ORDER_ITEM_UNIT_FKID] = pt.[PRODUCT_UNIT_PKID] AND ORDERS_STATUS = 4 AND MONTH(ORDERS_DATE) = " + Month + ") AS 'ORDER_COUNT',ISNULL((SELECT SUM(CAST([ORDER_ITEM_QUANTITY] AS INT))FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID]WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND [ORDER_ITEM_UNIT_FKID] = pt.[PRODUCT_UNIT_PKID] AND ORDERS_STATUS = 4 AND MONTH(ORDERS_DATE) = " + Month + "), '0') AS 'ORDER_QUANTITY' (SELECT [MONTH_NAME] FROM [dbo].[MONTH_LIST] WHERE [MONTH_NO] = " + Month+ ") AS 'SALEMONTH' FROM [dbo].[PRODUCTS] AS t JOIN [dbo].[PRODUCT_UNIT] AS pt ON pt.[PRODUCT_UNIT_PRODUCT_FKID] = t.PRODUCT_PKID JOIN [dbo].[PRODUCT_CATEGORY] ON [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] JOIN [dbo].[PRODUCT_SUB_CATEGORY] ON [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] WHERE (SELECT COUNT(DISTINCT [ORDER_ITEM_ORDER_FKID])FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID]WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND [ORDER_ITEM_UNIT_FKID] = pt.[PRODUCT_UNIT_PKID]) != 0"
      );
        return result.recordsets[0];
  } catch (error) {
    console.log("ProductSalesReportGetMonth-->", error);
    //
  }
}

async function ProductUnitSalesReportCurrentDate() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT PRODUCT_UNIT_PKID,[PRODUCT_PKID],[PRODUCT_NAME],[PRODUCT_UNIT_QTY],[PRODUCT_CATEGORY_NAME],[PRODUCT_SUB_CATEGORY_NAME],(SELECT COUNT(DISTINCT [ORDER_ITEM_ORDER_FKID])FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID]WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND[ORDER_ITEM_UNIT_FKID] = pt.[PRODUCT_UNIT_PKID] AND ORDERS_STATUS = 4 AND [ORDERS_DATE]= getDate()) AS 'ORDER_COUNT',ISNULL((SELECT SUM(CAST([ORDER_ITEM_QUANTITY] AS INT))FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID]WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND [ORDER_ITEM_UNIT_FKID] = pt.[PRODUCT_UNIT_PKID] AND ORDERS_STATUS = 4 AND [ORDERS_DATE]= getDate()), '0') AS 'ORDER_QUANTITY' FROM [dbo].[PRODUCTS] AS t JOIN [dbo].[PRODUCT_UNIT] AS pt ON pt.[PRODUCT_UNIT_PRODUCT_FKID] = t.PRODUCT_PKID JOIN [dbo].[PRODUCT_CATEGORY] ON [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] JOIN [dbo].[PRODUCT_SUB_CATEGORY] ON [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] WHERE (SELECT COUNT(DISTINCT [ORDER_ITEM_ORDER_FKID])FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID]WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND [ORDER_ITEM_UNIT_FKID] = pt.PRODUCT_UNIT_PKID and [ORDERS_DATE]= getDate()) != 0"
         
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductUnitSalesReportCurrentDate-->", error);
  }
}

async function ProductUnitSalesReportGetDate(Fdate, Tdate) {
  try {
    console.log(Fdate);
    console.log(Tdate);
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT PRODUCT_UNIT_PKID,[PRODUCT_PKID],[PRODUCT_NAME],[PRODUCT_UNIT_QTY],[PRODUCT_CATEGORY_NAME],[PRODUCT_SUB_CATEGORY_NAME],(SELECT COUNT(DISTINCT [ORDER_ITEM_ORDER_FKID])FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID]WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND[ORDER_ITEM_UNIT_FKID] = pt.[PRODUCT_UNIT_PKID] AND ORDERS_STATUS = 4 AND ORDERS_DATE BETWEEN '"+Fdate+"' AND '"+Tdate+"') AS 'ORDER_COUNT',ISNULL((SELECT SUM(CAST([ORDER_ITEM_QUANTITY] AS INT))FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID]WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND [ORDER_ITEM_UNIT_FKID] = pt.[PRODUCT_UNIT_PKID] AND ORDERS_STATUS = 4 AND ORDERS_DATE BETWEEN '"+Fdate+"' AND '"+Tdate+"'), '0') AS 'ORDER_QUANTITY' FROM [dbo].[PRODUCTS] AS t JOIN [dbo].[PRODUCT_UNIT] AS pt ON pt.[PRODUCT_UNIT_PRODUCT_FKID] = t.PRODUCT_PKID JOIN [dbo].[PRODUCT_CATEGORY] ON [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] JOIN [dbo].[PRODUCT_SUB_CATEGORY] ON [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] WHERE (SELECT COUNT(DISTINCT [ORDER_ITEM_ORDER_FKID])FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID]WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND [ORDER_ITEM_UNIT_FKID] = pt.PRODUCT_UNIT_PKID and [ORDERS_DATE] between '"+Fdate+"' and '"+Tdate+"') != 0"
         
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductUnitSalesReportGetDate-->", error);
  }
}

async function OrdersSalesByProduct(ProductID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "select distinct isnull(ORDERS_DOC, '-') as ORDERS_DOC, [PRODUCT_PKID], [PRODUCT_NAME], [PRODUCT_CATEGORY_NAME], [PRODUCT_SUB_CATEGORY_NAME] , [ORDERS_NUMBER], [ORDERS_SUB_TOTAL],[ORDERS_SHIPPING_AMOUNT],[ORDERS_TOTAL_AMOUNT],ORDERS_COUPON_DISCOUNT,  [ORDERS_GRAND_TOTAL] from [dbo].[ORDER_ITEMS] join [dbo].[ORDERS] on [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] and ORDERS_STATUS = 4 join [dbo].[PRODUCTS] on [PRODUCT_PKID] = [ORDER_ITEM_PRODUCT_FKID] join [dbo].[PRODUCT_CATEGORY] on [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] join [dbo].[PRODUCT_SUB_CATEGORY] on [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] join [dbo].[PRODUCT_UNIT] on [PRODUCT_UNIT_PKID] = ORDER_ITEM_UNIT_FKID and [PRODUCT_UNIT_PRODUCT_FKID] = [ORDER_ITEM_PRODUCT_FKID] where [ORDER_ITEM_PRODUCT_FKID] = " +
          ProductID +
          ""
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("OrdersSalesByProduct-->", error);
    //
  }
}

async function OrdersSalesByProductUnit(ProductID, UnitID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "select distinct isnull(ORDERS_DOC, '-') as ORDERS_DOC, [PRODUCT_PKID], [PRODUCT_NAME], [PRODUCT_CATEGORY_NAME], [PRODUCT_SUB_CATEGORY_NAME] , [ORDERS_NUMBER], [ORDERS_SUB_TOTAL],[ORDERS_SHIPPING_AMOUNT],[ORDERS_TOTAL_AMOUNT],ORDERS_COUPON_DISCOUNT, [ORDERS_GRAND_TOTAL],PRODUCT_UNIT_QTY from [dbo].[ORDER_ITEMS] join [dbo].[ORDERS] on [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] and ORDERS_STATUS = 4 join [dbo].[PRODUCTS] on [PRODUCT_PKID] = [ORDER_ITEM_PRODUCT_FKID] join [dbo].[PRODUCT_CATEGORY] on [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] join [dbo].[PRODUCT_SUB_CATEGORY] on [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] join [dbo].[PRODUCT_UNIT] on [PRODUCT_UNIT_PKID] = ORDER_ITEM_UNIT_FKID and [PRODUCT_UNIT_PRODUCT_FKID] = [ORDER_ITEM_PRODUCT_FKID] where [ORDER_ITEM_PRODUCT_FKID] = " +
          ProductID +
          " and ORDER_ITEM_UNIT_FKID = " +
          UnitID +
          ""
      );
    return result.recordsets[0];
  } catch (error) {
    OrdersSalesByProductUnit;
    console.log("OrdersSalesByProduct-->", error);
    //
  }
}

async function MemberCouponWiseSalesReport() {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "SELECT [MEMBER_PKID], CASE WHEN [MEMBER_TYPE] = 1 THEN 'Doctor' WHEN [MEMBER_TYPE] = 2 THEN 'Regular Member' ELSE '-' END AS MEMBER_TYPE_NAME, [MEMBER_NAME], [MEMBER_EMAIL], [MEMBER_PHONE], [MEMBER_COUPON_PKID], [MEMBER_COUPON_CODE],[MEMBER_COUPON_DISCOUNT], (select count(*) from [dbo].[ORDERS] where [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] and [ORDERS_STATUS] = 4) as TOTAL_ORDERS, (select sum(cast([ORDERS_GRAND_TOTAL] as float)) from [dbo].[ORDERS] where [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] and [ORDERS_STATUS] = 4) as TOTAL_SALES from [dbo].[MEMBER] join [dbo].[MEMBER_COUPON] on [MEMBER_COUPON_MEMBER_FKID] = [MEMBER_PKID] where (select count(*) from [dbo].[ORDERS] where [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] and [ORDERS_STATUS] = 4) != 0"
      );
    return result.recordsets[0];
  } catch (error) {
    OrdersSalesByProductUnit;
    console.log("MemberCouponWiseSalesReport-->", error);
    //
  }
}
async function MemberCouponWiseSalesById(MEMBER_PKID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "SELECT [MEMBER_PKID],CASE WHEN [MEMBER_TYPE] = 1 THEN 'Doctor' WHEN [MEMBER_TYPE] = 2 THEN 'Regular Member' ELSE '-' END AS MEMBER_TYPE_NAME,[MEMBER_NAME], [MEMBER_EMAIL], [MEMBER_PHONE], [MEMBER_COUPON_PKID],[MEMBER_COUPON_CODE],[MEMBER_COUPON_DISCOUNT], SELECT COUNT(*) FROM [dbo].[ORDERS] WHERE [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID]AND [ORDERS_STATUS] = 4) AS TOTAL_ORDERS, (SELECT SUM(CAST([ORDERS_GRAND_TOTAL] AS FLOAT)) FROM [dbo].[ORDERS]WHERE [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] AND [ORDERS_STATUS] = 4) AS TOTAL_SALES FROM [dbo].[MEMBER] JOIN [dbo].[MEMBER_COUPON] ON [MEMBER_COUPON_MEMBER_FKID] = [MEMBER_PKID]WHERE (SELECT COUNT(*) FROM [dbo].[ORDERS] WHERE [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] AND [ORDERS_STATUS] = 4 AND [MEMBER_PKID] = " + MEMBER_PKID + ")  != 0"
      );
    return result.recordsets[0];
  } catch (error) {
    OrdersSalesByProductUnit;
    console.log("MemberCouponWiseSalesById-->", error);
    //
  }
}

async function MemberCouponWiseSalesReportFilter(Type) {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "SELECT [MEMBER_PKID], CASE WHEN [MEMBER_TYPE] = 1 THEN 'Doctor' WHEN [MEMBER_TYPE] = 2 THEN 'Regular Member' ELSE '-' END AS MEMBER_TYPE_NAME, [MEMBER_NAME], [MEMBER_EMAIL], [MEMBER_PHONE], [MEMBER_COUPON_PKID], [MEMBER_COUPON_CODE],[MEMBER_COUPON_DISCOUNT], (select count(*) from [dbo].[ORDERS] where [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] and [ORDERS_STATUS] = 4) as TOTAL_ORDERS, (select sum(cast([ORDERS_GRAND_TOTAL] as float)) from [dbo].[ORDERS] where [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] and [ORDERS_STATUS] = 4) as TOTAL_SALES from [dbo].[MEMBER] join [dbo].[MEMBER_COUPON] on [MEMBER_COUPON_MEMBER_FKID] = [MEMBER_PKID] where (select count(*) from [dbo].[ORDERS] where [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] and [ORDERS_STATUS] = 4) != 0 and MEMBER_TYPE = " +
          Type +
          ""
      );
    return result.recordsets[0];
  } catch (error) {
    OrdersSalesByProductUnit;
    console.log("MemberCouponWiseSalesReportFilter-->", error);
    //
  }
}

async function MemberCouponWiseSalesByMemberID(MemberID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "select ORDERS_STATUS,isnull(ORDERS_DOC, '-') as ORDERS_DOC,ORDERS_PAYMENT_MODE,[MEMBER_PKID], REGISTERED_USERS_EMAIL, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, CASE WHEN [MEMBER_TYPE] = 1 THEN 'Doctor' WHEN [MEMBER_TYPE] = 2 THEN 'Regular Member' ELSE '-' END AS MEMBER_TYPE_NAME, [MEMBER_NAME], [MEMBER_COUPON_CODE], [MEMBER_COUPON_DISCOUNT], [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [REGISTERED_USERS_NAME], [REGISTERED_USERS_PHONE],[ORDERS_NO_OF_ITEMS],ORDERS_SUB_TOTAL,ORDERS_SHIPPING_AMOUNT,ORDERS_TOTAL_AMOUNT,ORDERS_COUPON_DISCOUNT,ORDERS_GRAND_TOTAL, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE from [dbo].[MEMBER] join [dbo].[MEMBER_COUPON] on [MEMBER_COUPON_MEMBER_FKID] = [MEMBER_PKID] join [dbo].[ORDERS] on [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] and ORDERS_STATUS = 4 join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join CITY on CITY_PKID = USER_ADDRESS_CITY_FKID join STATE on STATE_PKID = USER_ADDRESS_STATE_FKID join COUNTRY on COUNTRY_PKID = USER_ADDRESS_COUNTRY_FKID where [MEMBER_PKID] = " +
          MemberID +
          ""
      );
    return result.recordsets[0];
  } catch (error) {
    OrdersSalesByProductUnit;
    console.log("MemberCouponWiseSalesByMemberID-->", error);
    //
  }
}

async function MemberCouponWiseSalesByMemberIDFilter(MemberID, Fdate, Tdate) {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "select ORDERS_STATUS,isnull(ORDERS_DOC, '-') as ORDERS_DOC,ORDERS_PAYMENT_MODE,[MEMBER_PKID], REGISTERED_USERS_EMAIL, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, CASE WHEN [MEMBER_TYPE] = 1 THEN 'Doctor' WHEN [MEMBER_TYPE] = 2 THEN 'Regular Member' ELSE '-' END AS MEMBER_TYPE_NAME, [MEMBER_NAME], [MEMBER_COUPON_CODE], [MEMBER_COUPON_DISCOUNT], [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [REGISTERED_USERS_NAME], [REGISTERED_USERS_PHONE],[ORDERS_NO_OF_ITEMS],ORDERS_SUB_TOTAL,ORDERS_SHIPPING_AMOUNT,ORDERS_TOTAL_AMOUNT,ORDERS_COUPON_DISCOUNT,ORDERS_GRAND_TOTAL, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE from [dbo].[MEMBER] join [dbo].[MEMBER_COUPON] on [MEMBER_COUPON_MEMBER_FKID] = [MEMBER_PKID] join [dbo].[ORDERS] on [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] and ORDERS_STATUS = 4 join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] and ORDERS_STATUS = 4 join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join CITY on CITY_PKID = USER_ADDRESS_CITY_FKID join STATE on STATE_PKID = USER_ADDRESS_STATE_FKID join COUNTRY on COUNTRY_PKID = USER_ADDRESS_COUNTRY_FKID where [MEMBER_PKID] = " +
          MemberID +
          " and ORDERS_DATE between '" +
          Fdate +
          "' and '" +
          Tdate +
          "'"
      );
    return result.recordsets[0];
  } catch (error) {
    OrdersSalesByProductUnit;
    console.log("MemberCouponWiseSalesByMemberIDFilter-->", error);
    //
  }
}

async function AAProbicsCouponsSales() {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "SELECT [COUPON_PKID], [COUPON_CODE],[COUPON_DISCOUNT],[COUPON_NAME], (select count(*) from [dbo].[ORDERS] where [ORDERS_COUPON_FKID] = [COUPON_PKID] and [ORDERS_STATUS] = 4) as TOTAL_ORDERS,  (select sum(cast([ORDERS_GRAND_TOTAL] as float)) from [dbo].[ORDERS] where [ORDERS_COUPON_FKID] = [COUPON_PKID] and [ORDERS_STATUS] = 4) as TOTAL_SALES  from [dbo].[COUPON] where (select count(*) from [dbo].[ORDERS] where [ORDERS_COUPON_FKID] = [COUPON_PKID] and [ORDERS_STATUS] = 4) != 0"
      );
    return result.recordsets[0];
  } catch (error) {
    OrdersSalesByProductUnit;
    console.log("AAProbicsCouponsSales-->", error);
    //
  }
}

async function AAProbicsCouponsSalesByCouponID(CouponID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "select ORDERS_STATUS,isnull(ORDERS_DOC, '-') as ORDERS_DOC,ORDERS_PAYMENT_MODE,[COUPON_PKID],[COUPON_CODE], [COUPON_DISCOUNT], REGISTERED_USERS_EMAIL, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, [COUPON_NAME], [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [REGISTERED_USERS_NAME], [REGISTERED_USERS_PHONE],[ORDERS_NO_OF_ITEMS],ORDERS_SUB_TOTAL,ORDERS_SHIPPING_AMOUNT,ORDERS_TOTAL_AMOUNT,ORDERS_COUPON_DISCOUNT,ORDERS_GRAND_TOTAL, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE from [dbo].[COUPON] join [dbo].[ORDERS] on [ORDERS_COUPON_FKID] =  [COUPON_PKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] and ORDERS_STATUS = 4 join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join CITY on CITY_PKID = USER_ADDRESS_CITY_FKID join STATE on STATE_PKID = USER_ADDRESS_STATE_FKID join COUNTRY on COUNTRY_PKID = USER_ADDRESS_COUNTRY_FKID where [COUPON_PKID] = " +
          CouponID +
          ""
      );
    return result.recordsets[0];
  } catch (error) {
    OrdersSalesByProductUnit;
    console.log("AAProbicsCouponsSalesByCouponID-->", error);
    //
  }
}

async function AAProbicsCouponsSalesByCouponIDFilter(CouponID, Fdate, Tdate) {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "select ORDERS_STATUS,isnull(ORDERS_DOC, '-') as ORDERS_DOC,ORDERS_PAYMENT_MODE,[COUPON_PKID],[COUPON_CODE], [COUPON_DISCOUNT], [COUPON_NAME], [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [REGISTERED_USERS_NAME], [REGISTERED_USERS_PHONE], REGISTERED_USERS_EMAIL, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS,[ORDERS_NO_OF_ITEMS],ORDERS_SUB_TOTAL,ORDERS_SHIPPING_AMOUNT,ORDERS_TOTAL_AMOUNT,ORDERS_COUPON_DISCOUNT,ORDERS_GRAND_TOTAL, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE from [dbo].[COUPON] join [dbo].[ORDERS] on [ORDERS_COUPON_FKID] =  [COUPON_PKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] and ORDERS_STATUS = 4 join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join CITY on CITY_PKID = USER_ADDRESS_CITY_FKID join STATE on STATE_PKID = USER_ADDRESS_STATE_FKID join COUNTRY on COUNTRY_PKID = USER_ADDRESS_COUNTRY_FKID where [COUPON_PKID] = " +
          CouponID +
          " and ORDERS_DATE between '" +
          Fdate +
          "' and '" +
          Tdate +
          "'"
      );
    return result.recordsets[0];
  } catch (error) {
    OrdersSalesByProductUnit;
    console.log("AAProbicsCouponsSalesByCouponIDFilter-->", error);
    //
  }
}

async function ProductWiseSalesReport() {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "SELECT [PRODUCT_PKID],[PRODUCT_NAME],[PRODUCT_CATEGORY_NAME],[PRODUCT_SUB_CATEGORY_NAME],(SELECT COUNT(DISTINCT ORDERS_NUMBER) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4) AS 'ORDER_COUNT',  ISNULL((SELECT SUM(CAST([ORDER_ITEM_QUANTITY] AS INT))FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID]WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4), '0') AS 'ORDER_QUANTITY',(SELECT SUM(CAST(ORDERS_TOTAL_AMOUNT AS FLOAT)) FROM [dbo].[ORDERS] JOIN [dbo].[ORDER_ITEMS] ON [ORDER_ITEM_ORDER_FKID] = [ORDERS_PKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4) AS 'ORDER_AMOUNT' FROM [dbo].[PRODUCTS] AS t JOIN [dbo].[PRODUCT_CATEGORY] ON [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] JOIN [dbo].[PRODUCT_SUB_CATEGORY] ON [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] WHERE (SELECT COUNT(*) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID) !=0"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductWiseSalesReport-->", error);
    //
  }
}

async function MemberWiseSalesReport() {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "SELECT [MEMBER_PKID], CASE WHEN [MEMBER_TYPE] = 1 THEN 'Doctor' WHEN [MEMBER_TYPE] = 2 THEN 'Regular Member' ELSE '-' END AS MEMBER_TYPE_NAME, [MEMBER_NAME], [MEMBER_EMAIL], [MEMBER_PHONE], [MEMBER_COUPON_PKID], [MEMBER_COUPON_CODE],[MEMBER_COUPON_DISCOUNT], (select count(*) from [dbo].[ORDERS] where [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] and [ORDERS_STATUS] = 4) as TOTAL_ORDERS, (select sum(cast([ORDERS_GRAND_TOTAL] as float)) from [dbo].[ORDERS] where [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] and [ORDERS_STATUS] = 4) as TOTAL_SALES from [dbo].[MEMBER] join [dbo].[MEMBER_COUPON] on [MEMBER_COUPON_MEMBER_FKID] = [MEMBER_PKID] where (select count(*) from [dbo].[ORDERS] where [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] and [ORDERS_STATUS] = 4) != 0"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("MemberWiseSalesReport-->", error);
    //
  }
}

async function GetCurrentYearSalesReport() {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().execute("GetCurrentYearSalesReport");

    return result.recordsets[0];
  } catch (error) {
    console.log("GetCurrentYearSalesReport-->", error);
  }
}

async function ProductWiseSalesReportGetMonth(Month) {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "SELECT [PRODUCT_PKID],[PRODUCT_NAME],[PRODUCT_CATEGORY_NAME],[PRODUCT_SUB_CATEGORY_NAME],(SELECT COUNT(DISTINCT ORDERS_NUMBER) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS]ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4 AND MONTH(ORDERS_DATE) = "+Month+") AS 'ORDER_COUNT', ISNULL((SELECT SUM(CAST([ORDER_ITEM_QUANTITY] AS INT))FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4 AND MONTH(ORDERS_DATE) = "+Month+"), '0') AS 'ORDER_QUANTITY',(SELECT SUM(CAST(ORDERS_TOTAL_AMOUNT AS FLOAT)) FROM [dbo].[ORDERS] JOIN [dbo].[ORDER_ITEMS] ON [ORDER_ITEM_ORDER_FKID] = [ORDERS_PKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4) AS 'ORDER_AMOUNT',(SELECT [MONTH_NAME] FROM [dbo].[MONTH_LIST] WHERE [MONTH_NO] = "+Month+") AS 'SALEMONTH' FROM [dbo].[PRODUCTS] AS t JOIN [dbo].[PRODUCT_CATEGORY] ON [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] JOIN [dbo].[PRODUCT_SUB_CATEGORY] ON [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] WHERE (SELECT COUNT(*) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND MONTH([ORDERS_DATE]) = "+Month+")!=0");
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductWiseSalesReportGetMonth-->", error);
    //
  }
}

async function ProductWiseSalesReportGetDate(Fdate, Tdate) {
  console.log(Fdate);
  console.log(Tdate);
  try {
    
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT [PRODUCT_PKID],[PRODUCT_NAME],[PRODUCT_CATEGORY_NAME],[PRODUCT_SUB_CATEGORY_NAME],(SELECT COUNT(DISTINCT ORDERS_NUMBER) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4 AND [ORDERS_DATE] BETWEEN '"+Fdate+"' AND '"+Tdate+"') AS 'ORDER_COUNT', ISNULL((SELECT SUM(CAST([ORDER_ITEM_QUANTITY] AS INT))FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4 AND [ORDERS_DATE] BETWEEN '"+Fdate+"' AND '"+Tdate+"'), '0') AS 'ORDER_QUANTITY',ISNULL((SELECT SUM(CAST(ORDERS_TOTAL_AMOUNT AS FLOAT)) FROM [dbo].[ORDERS] JOIN [dbo].[ORDER_ITEMS] ON [ORDER_ITEM_ORDER_FKID] = [ORDERS_PKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4 AND [ORDERS_DATE] BETWEEN '"+Fdate+"' AND '"+Tdate+"'),'0') AS 'ORDER_AMOUNT' FROM [dbo].[PRODUCTS] AS t JOIN [dbo].[PRODUCT_CATEGORY] ON [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] JOIN [dbo].[PRODUCT_SUB_CATEGORY] ON [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] WHERE (SELECT COUNT(DISTINCT ORDERS_NUMBER) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4 AND [ORDERS_DATE] BETWEEN '"+Fdate+"' AND '"+Tdate+"')!=0"
         
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductWiseSalesReportGetDate-->", error);
  }
}

async function ProductWiseSalesReportGetCurrentDate() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT [PRODUCT_PKID],[PRODUCT_NAME],[PRODUCT_CATEGORY_NAME],[PRODUCT_SUB_CATEGORY_NAME],(SELECT COUNT(DISTINCT ORDERS_NUMBER) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS]ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4 AND [ORDERS_DATE] = getDate()) AS 'ORDER_COUNT', ISNULL((SELECT SUM(CAST([ORDER_ITEM_QUANTITY] AS INT))FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4 AND [ORDERS_DATE] = getDate()), '0') AS 'ORDER_QUANTITY',(SELECT SUM(CAST(ORDERS_TOTAL_AMOUNT AS FLOAT)) FROM [dbo].[ORDERS] JOIN [dbo].[ORDER_ITEMS] ON [ORDER_ITEM_ORDER_FKID] = [ORDERS_PKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND ORDERS_STATUS = 4 AND [ORDERS_DATE] = getDate()) AS 'ORDER_AMOUNT' FROM [dbo].[PRODUCTS] AS t JOIN [dbo].[PRODUCT_CATEGORY] ON [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] JOIN [dbo].[PRODUCT_SUB_CATEGORY] ON [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] WHERE (SELECT COUNT(*) FROM [dbo].[ORDER_ITEMS] JOIN [dbo].[ORDERS] ON [ORDERS_PKID] = [ORDER_ITEM_ORDER_FKID] WHERE [ORDER_ITEM_PRODUCT_FKID] = t.PRODUCT_PKID AND [ORDERS_DATE] = getDate())!=0"
         
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductWiseSalesReportGetCurrentDate-->", error);
  }
}

async function MemberWiseSalesReportGetMonth(Month) {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .query(
        "SELECT [MEMBER_PKID], CASE WHEN [MEMBER_TYPE] = 1 THEN 'Doctor' WHEN [MEMBER_TYPE] = 2 THEN 'Regular Member' ELSE '-' END AS MEMBER_TYPE_NAME, [MEMBER_NAME], [MEMBER_EMAIL], [MEMBER_PHONE], [MEMBER_COUPON_PKID], [MEMBER_COUPON_CODE],[MEMBER_COUPON_DISCOUNT], (SELECT COUNT(*) FROM [dbo].[ORDERS] WHERE [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] AND [ORDERS_STATUS] = 4 AND MONTH(ORDERS_DATE) = " + Month+ ") AS TOTAL_ORDERS, (SELECT SUM(CAST([ORDERS_GRAND_TOTAL] AS FLOAT)) FROM [dbo].[ORDERS] WHERE [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] AND [ORDERS_STATUS] = 4 AND MONTH(ORDERS_DATE) = " + Month+ ") AS TOTAL_SALES FROM [dbo].[MEMBER] JOIN [dbo].[MEMBER_COUPON] ON [MEMBER_COUPON_MEMBER_FKID] = [MEMBER_PKID] WHERE (SELECT COUNT(*) FROM [dbo].[ORDERS] WHERE [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] AND [ORDERS_STATUS] = 4 AND MONTH(ORDERS_DATE) = " + Month+ ") != 0");
    return result.recordsets[0];
  } catch (error) {
    console.log("MemberWiseSalesReportGetMonth-->", error);
    //
  }
}

async function MemberWiseSalesReportGetDate(Fdate, Tdate) {
  try {
    console.log(Fdate);
    console.log(Tdate);
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT [MEMBER_PKID], CASE WHEN [MEMBER_TYPE] = 1 THEN 'Doctor' WHEN [MEMBER_TYPE] = 2 THEN 'Regular Member' ELSE '-' END AS MEMBER_TYPE_NAME, [MEMBER_NAME], [MEMBER_EMAIL],[MEMBER_PHONE], [MEMBER_COUPON_PKID], [MEMBER_COUPON_CODE],[MEMBER_COUPON_DISCOUNT],(SELECT COUNT(*) FROM [dbo].[ORDERS] WHERE [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] AND [ORDERS_STATUS] = 4 AND[ORDERS_DATE] BETWEEN '"+Fdate+"' AND '"+Tdate+"') AS TOTAL_ORDERS,(SELECT SUM(CAST([ORDERS_GRAND_TOTAL] AS FLOAT)) FROM [dbo].[ORDERS] WHERE [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] AND [ORDERS_STATUS] = 4 AND [ORDERS_DATE] BETWEEN '"+Fdate+"' AND '"+Tdate+"') AS TOTAL_SALES FROM [dbo].[MEMBER] JOIN [dbo].[MEMBER_COUPON] ON [MEMBER_COUPON_MEMBER_FKID] = [MEMBER_PKID] WHERE (SELECT COUNT(*) FROM [dbo].[ORDERS] WHERE [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] AND [ORDERS_STATUS] = 4 AND [ORDERS_DATE] BETWEEN '"+Fdate+"' AND '"+Tdate+"') != 0"
         
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("MemberWiseSalesReportGetDate-->", error);
  }
}

async function MemberWiseSalesReportGetCurrentDate() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT [MEMBER_PKID], CASE WHEN [MEMBER_TYPE] = 1 THEN 'Doctor' WHEN [MEMBER_TYPE] = 2 THEN 'Regular Member' ELSE '-' END AS MEMBER_TYPE_NAME, [MEMBER_NAME], [MEMBER_EMAIL], [MEMBER_PHONE], [MEMBER_COUPON_PKID], [MEMBER_COUPON_CODE],[MEMBER_COUPON_DISCOUNT], (SELECT COUNT(*) FROM [dbo].[ORDERS] WHERE [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] AND [ORDERS_STATUS] = 4 AND [ORDERS_DATE] = getDate()) AS TOTAL_ORDERS, (SELECT SUM(CAST([ORDERS_GRAND_TOTAL] AS FLOAT)) FROM [dbo].[ORDERS] WHERE [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] AND [ORDERS_STATUS] = 4 AND [ORDERS_DATE] = getDate()) AS TOTAL_SALES FROM [dbo].[MEMBER] JOIN [dbo].[MEMBER_COUPON] ON [MEMBER_COUPON_MEMBER_FKID] = [MEMBER_PKID] WHERE (SELECT COUNT(*) FROM [dbo].[ORDERS] WHERE [ORDERS_COUPON_FKID] = [MEMBER_COUPON_PKID] AND [ORDERS_STATUS] = 4 AND [ORDERS_DATE] = getDate()) != 0"
         
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("MemberWiseSalesReportGetCurrentDate-->", error);
  }
}

async function GetCurrentYearSalesReportByMonth(Month) {
  try {
    let pool = await sql.connect(config);
    console.log(Month);
    let result = await pool
      .request()
      .input("Month", Month)
      .input('FDate', "")
      .input('TDate', "")
      .execute(`GetCurrentYearSalesReportByMonth`);

    return result.recordsets[0];
  } catch (error) {
    console.log("GetCurrentYearSalesReportByMonth-->", error);
  }
}

async function GetCurrentYearSalesReportByDate(Fdate, Tdate) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("Month", "")
      .input('FDate', Fdate)
      .input('TDate', Tdate)
      .execute("GetCurrentYearSalesReportByMonth");

    return result.recordsets[0];
  } catch (error) {
    console.log("GetCurrentYearSalesReportByDate-->", error);
  }
}

async function GetCurrentYearSalesReportByCdate() {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .execute("GetCurrentYearSalesReportByCurrDate");

    return result.recordsets[0];
  } catch (error) {
    console.log("GetCurrentYearSalesReportByCdate-->", error);
  }
}

// async function GetCurrentYearSalesReportByMonth(Month) {
//   try {
//     let pool = await sql.connect(config);
//     let result = await pool.request().execute("GetCurrentYearSalesReportByMonth");

//     return result.recordsets[0];
//   } catch (error) {
//     console.log("GetCurrentYearSalesReportByMonth-->", error);
//   }
// }


module.exports = {
  AllOrders: AllOrders,
  AllOrdersFilterByMonth: AllOrdersFilterByMonth,
  AllOrdersFilterByDates: AllOrdersFilterByDates,
  AllOrdersFilterByYear: AllOrdersFilterByYear,
  getYearLists: getYearLists,
  CurrentDayOrder: CurrentDayOrder,
  ProductSalesReport: ProductSalesReport,
  ProductSalesReportGetMonth: ProductSalesReportGetMonth,
  ProductSalesReportGetDate: ProductSalesReportGetDate,
  ProductSalesReportGetCurrentDate:ProductSalesReportGetCurrentDate,
  ProductUnitSalesReport: ProductUnitSalesReport,
  ProductUnitSalesReportGetMonth:ProductUnitSalesReportGetMonth,
  ProductUnitSalesReportGetDate,ProductUnitSalesReportGetDate,
  ProductUnitSalesReportCurrentDate:ProductUnitSalesReportCurrentDate,
  OrdersSalesByProduct: OrdersSalesByProduct,
  OrdersSalesByProductUnit: OrdersSalesByProductUnit,
  MemberCouponWiseSalesReport: MemberCouponWiseSalesReport,
  MemberCouponWiseSalesById: MemberCouponWiseSalesById,
  MemberCouponWiseSalesReportFilter: MemberCouponWiseSalesReportFilter,
  MemberCouponWiseSalesByMemberID: MemberCouponWiseSalesByMemberID,
  MemberCouponWiseSalesByMemberIDFilter: MemberCouponWiseSalesByMemberIDFilter,
  AAProbicsCouponsSales: AAProbicsCouponsSales,
  AAProbicsCouponsSalesByCouponID: AAProbicsCouponsSalesByCouponID,
  AAProbicsCouponsSalesByCouponIDFilter: AAProbicsCouponsSalesByCouponIDFilter,
  YearlyReport: YearlyReport,
  YearlyReportByDate: YearlyReportByDate,
  YearlyReportByYear: YearlyReportByYear,
  ProductWiseSalesReport: ProductWiseSalesReport,
  MemberWiseSalesReport: MemberWiseSalesReport,
  GetCurrentYearSalesReport: GetCurrentYearSalesReport,
  ProductWiseSalesReportGetMonth: ProductWiseSalesReportGetMonth,
  ProductWiseSalesReportGetDate: ProductWiseSalesReportGetDate,
  ProductWiseSalesReportGetCurrentDate: ProductWiseSalesReportGetCurrentDate,
  MemberWiseSalesReportGetMonth: MemberWiseSalesReportGetMonth,
  MemberWiseSalesReportGetDate: MemberWiseSalesReportGetDate,
  MemberWiseSalesReportGetCurrentDate: MemberWiseSalesReportGetCurrentDate,
  GetCurrentYearSalesReportByMonth: GetCurrentYearSalesReportByMonth,
  GetCurrentYearSalesReportByDate: GetCurrentYearSalesReportByDate,
  GetCurrentYearSalesReportByCdate: GetCurrentYearSalesReportByCdate,
};
