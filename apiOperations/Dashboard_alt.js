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
        "select (select count(*) from [dbo].[PRODUCTS]) as productCount, (select count(*) from [dbo].[REGISTERED_USERS]) as userCount, (select count(*) from ORDERS where ORDERS_STATUS = 4) as orderCount"
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
        "select (select count(*) from [dbo].[PRODUCTS] where [PRODUCT_DATE] = cast(getdate() as date)) as DailyProductCount, (select count(*) from [dbo].[REGISTERED_USERS] where [REGISTERED_USERS_DATE] =cast(getdate() as date)) as DailyUserCount, (select count(*) from ORDERS where ORDERS_STATUS = 4 and [ORDERS_DATE] = cast(getdate() as date)) as DailyOrderCount,(select count(*) from [dbo].[PRODUCTS] where month([PRODUCT_DATE]) = month(cast(getdate() as date))) as MonthlyProductCount,(select count(*) from [dbo].[REGISTERED_USERS] where month([REGISTERED_USERS_DATE]) = month(cast(getdate() as date))) as MonthlyUserCount, (select count(*) from ORDERS where ORDERS_STATUS = 4 and month([ORDERS_DATE]) = month(cast(getdate() as date))) as MonthlyOrderCount,(select count(*) from [dbo].[PRODUCTS] where year([PRODUCT_DATE]) = year(cast(getdate() as date))) as YearlyProductCount,(select count(*) from [dbo].[REGISTERED_USERS] where year([REGISTERED_USERS_DATE]) = year(cast(getdate() as date))) as YearlyUserCount, (select count(*) from ORDERS where ORDERS_STATUS = 4 and year([ORDERS_DATE]) = year(cast(getdate() as date))) as YearlyOrderCount"
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

async function GetDashboardGraph() {
  var GraphArray = [];

  try {
    for (var i = 1; i <= 12; i++) {
      var pool = await sql.connect(config);
      var result = await pool
        .request()
        .query(
          "select count(*) as ordercnt from ORDERS where ORDERS_STATUS = 4 and month([ORDERS_DATE]) = " + i +""
        );
      GraphArray.push(result.recordsets[0][0].ordercnt);
    }

    return GraphArray;
  } catch (error) {
    console.log("GetDashboardGraph-->", error);
    //
  }
}

module.exports = {
  GetTopThreeCardsDetails: GetTopThreeCardsDetails,
  GetRightCardData: GetRightCardData,
  GetDashboardGraph: GetDashboardGraph,
};
