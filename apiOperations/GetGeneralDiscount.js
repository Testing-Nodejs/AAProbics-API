/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function GetGeneralDiscount() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT * FROM [DISCOUNT]"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("GetGeneralDiscount-->", error);
    //
  }
}

module.exports = {
  GetGeneralDiscount: GetGeneralDiscount,
};
