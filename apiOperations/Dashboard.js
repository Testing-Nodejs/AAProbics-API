/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function GetTopThreeCardsDetails() {
  var MainArray = [];
  var Obj = {};
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select (select count(*) from [dbo].[PRODUCTS]) as productCount, (select count(*) from [dbo].[REGISTERED_USERS]) as userCount, (select '0') as orderCount"
      );
    Obj = {
      productCount: result.recordsets[0][0].productCount,
      userCount: result.recordsets[0][0].userCount,
      orderCount: result.recordsets[0][0].orderCount,
    };
    MainArray.push(Obj);
    return MainArray;
  } catch (error) {
    console.log("GetTopThreeCardsDetails-->", error);
    //
  }
}

async function GetRightCardData() {
  var DailyArray = [];
  var MonthyArray = [];
  var YearlyArray = [];

  var DailyObj = {};
  var MonthlyObj = {};
  var YearlyObj = {};

  var MainObj = {};
  var MainArray = [];

  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select (select count(*) from [dbo].[PRODUCTS] where [PRODUCT_DATE] = cast(getdate() as date)) as DailyProductCount, (select count(*) from [dbo].[REGISTERED_USERS] where [REGISTERED_USERS_DATE] =cast(getdate() as date)) as DailyUserCount, (select '0') as DailyOrderCount, (select count(*) from [dbo].[PRODUCTS] where month([PRODUCT_DATE]) = month(cast(getdate() as date))) as MonthlyProductCount, (select count(*) from [dbo].[REGISTERED_USERS] where month([REGISTERED_USERS_DATE]) = month(cast(getdate() as date))) as MonthlyUserCount, (select '0') as MonthlyOrderCount, (select count(*) from [dbo].[PRODUCTS] where year([PRODUCT_DATE]) = year(cast(getdate() as date))) as YearlyProductCount, (select count(*) from [dbo].[REGISTERED_USERS] where year([REGISTERED_USERS_DATE]) = year(cast(getdate() as date))) as YearlyUserCount, (select '0') as YearlyOrderCount"
      );
    DailyObj = {
      DailyProductCount: result.recordsets[0][0].DailyProductCount,
      DailyUserCount: result.recordsets[0][0].DailyUserCount,
      DailyOrderCount: result.recordsets[0][0].DailyOrderCount,
    };
    DailyArray.push(DailyObj);

    MonthlyObj = {
      MonthlyProductCount: result.recordsets[0][0].MonthlyProductCount,
      MonthlyUserCount: result.recordsets[0][0].MonthlyUserCount,
      MonthlyOrderCount: result.recordsets[0][0].MonthlyOrderCount,
    };
    MonthyArray.push(MonthlyObj);

    YearlyObj = {
      YearlyProductCount: result.recordsets[0][0].YearlyProductCount,
      YearlyUserCount: result.recordsets[0][0].YearlyUserCount,
      YearlyOrderCount: result.recordsets[0][0].YearlyOrderCount,
    };
    YearlyArray.push(YearlyObj);

    MainObj = {
      Daily: DailyArray,
      Monthly: MonthyArray,
      Yearly: YearlyArray,
    };
    MainArray.push(MainObj);

    return MainArray;
  } catch (error) {
    console.log("GetRightCardData-->", error);
    //
  }
}

async function GetAllReports() {

  var obj = {};

  try {
    var pool = await sql.connect(config);
    var result = await pool
    
    .request()
    .query("select (select count(*) from [dbo].[ORDERS] where [ORDERS_DATE] = GETDATE()) AS Orders_Daily_Count, (select count(*) from [dbo].[PRODUCTS] where [PRODUCT_DATE] = GETDATE()) AS Product_Daily_Count,(select count(*) from [dbo].[REGISTERED_USERS] where [REGISTERED_USERS_DATE] = GETDATE()) as Users_Daily_Count,(select count(*) from [dbo].[ORDERS] where MONTH([ORDERS_DATE]) =  MONTH(getdate())) AS Orders_Monthly_Count,(select count(*) from [dbo].[PRODUCTS] where MONTH([PRODUCT_DATE]) = MONTH(GETDATE())) AS Product_Monthly_Count,(select count(*) from [dbo].[REGISTERED_USERS] where MONTH([REGISTERED_USERS_DATE]) = MONTH(GETDATE())) as Users_Monthly_Count,(select count(*) from [dbo].[ORDERS] where YEAR([ORDERS_DATE]) =  YEAR(getdate())) AS Orders_Year_Count,(select count(*) from [dbo].[PRODUCTS] where YEAR([PRODUCT_DATE]) = YEAR(GETDATE())) AS Product_Year_Count,(select count(*) from [dbo].[REGISTERED_USERS] where YEAR([REGISTERED_USERS_DATE]) = YEAR(GETDATE())) as Users_Year_Count");  
    
  } catch (error) {
    console.log("GetAllReports-->", error);
    //
  }
}


module.exports = {
  GetTopThreeCardsDetails: GetTopThreeCardsDetails,
  GetRightCardData: GetRightCardData,
  GetAllReports: GetAllReports,
};
