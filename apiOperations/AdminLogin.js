/*
 * @Author: ---- KIMO a.k.a KIMOSABE ----
 * @Date: 2022-02-19 12:05:08
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 19:33:40
 */

var config = require("../dbconfig");
const sql = require("mssql");

async function getAdminLogin(AdminEmail, AdminPass) {
  try {
    let pool = await sql.connect(config);

    let result = await pool
      .request()
      .input("AdminEmail", AdminEmail)
      .input("AdminPass", AdminPass)
      .query(
        "SELECT * FROM [ADMIN] WHERE ADMIN_EMAIL=@AdminEmail AND ADMIN_PASSWORD=@AdminPass"
      );

    if (result.recordsets[0].length > 0) {
      return result.recordsets[0];
    } else {
      return false;
    }
    // return result.recordsets[0];
  } catch (error) {
    console.log("getAdminLogin-->", error);
    //
  }
}

async function UpdateAdminPassword(AdminEmail,AdminPassword){
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("ADMIN_EMAIL", AdminEmail)
      .input("ADMIN_PASSWORD", AdminPassword)
      .query(
        `UPDATE ADMIN SET ADMIN_PASSWORD = @ADMIN_PASSWORD WHERE ADMIN_EMAIL =@ADMIN_EMAIL`);

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("UpdateAdminPassword-->", error);
  }
}


module.exports = {
  getAdminLogin: getAdminLogin,
  UpdateAdminPassword:UpdateAdminPassword,
};
