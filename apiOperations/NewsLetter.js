/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllSubscribedUsers() {
  try {
    var pool = await sql.connect(config);
    var result = await pool.request().query("SELECT * FROM [SUBSCRIBED_USERS]");
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllSubscribedUsers-->", error);
    //
  }
}

async function addSubscription(Email) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("SUBSCRIBED_USERS_EMAIL", Email)
      .query(
        "SELECT * from SUBSCRIBED_USERS WHERE SUBSCRIBED_USERS_EMAIL=@SUBSCRIBED_USERS_EMAIL"
      );
    if (result.rowsAffected[0] == 0) {
      var insertInto = await pool
        .request()
        .input("SUBSCRIBED_USERS_EMAIL", Email)
        .query(
          "insert into SUBSCRIBED_USERS ([SUBSCRIBED_USERS_EMAIL], [SUBSCRIBED_USERS_DATE])  values(@SUBSCRIBED_USERS_EMAIL, getdate())"
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
    console.log("addSubscription-->", err);
  }
}

module.exports = {
  getAllSubscribedUsers: getAllSubscribedUsers,
  addSubscription: addSubscription,
};
