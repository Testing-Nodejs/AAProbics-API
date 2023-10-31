/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllContactUs() {
  try {
    var pool = await sql.connect(config);
    var result = await pool.request().query("SELECT * from CONTACT");
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllContactUs-->", error);
  }
}

async function addContactUs(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var insertInto = await pool
      .request()
      .input("CONTACT_NAME", obj.CONTACT_NAME)
      .input("CONTACT_EMAIL", obj.CONTACT_EMAIL)
      .input("CONTACT_PHO", obj.CONTACT_PHO)
      .input("CONTACT_ADDRESS", obj.CONTACT_ADDRESS)
      .input("CONTACT_FB_LINK", obj.CONTACT_FB_LINK)
      .input("CONTACT_WHATSAPP_LINK", obj.CONTACT_WHATSAPP_LINK)
      .input("CONTACT_INSTA_LINK", obj.CONTACT_INSTA_LINK)
      .input("CONTACT_TWITTER_LINK", obj.CONTACT_TWITTER_LINK)
      .input("CONTACT_LINKEDIN_LINK", obj.CONTACT_LINKEDIN_LINK)
      .query(
        "insert into CONTACT ([CONTACT_NAME],[CONTACT_EMAIL],[CONTACT_PHO],[CONTACT_ADDRESS], [CONTACT_FB_LINK], [CONTACT_INSTA_LINK], [CONTACT_TWITTER_LINK], [CONTACT_LINKEDIN_LINK],CONTACT_WHATSAPP_LINK)  values(@CONTACT_NAME,@CONTACT_EMAIL,@CONTACT_PHO,@CONTACT_ADDRESS, @CONTACT_FB_LINK, @CONTACT_INSTA_LINK, @CONTACT_TWITTER_LINK, @CONTACT_LINKEDIN_LINK,@CONTACT_WHATSAPP_LINK)"
      );
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    if (insertInto.rowsAffected == 1) {
      return "1";
    } else {
      return "2";
    }
  } catch (err) {
    console.log("addContactUs-->", err);
  }
}

async function deleteContactUs(ContactID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("CONTACT_PKID", ContactID)
      .query("DELETE FROM CONTACT WHERE CONTACT_PKID=@CONTACT_PKID");

    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteContactUs-->", error);
    //
  }
}

async function updateContactUs(ContactID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("CONTACT_PKID", ContactID)
      .input("CONTACT_NAME", obj.CONTACT_NAME)
      .input("CONTACT_EMAIL", obj.CONTACT_EMAIL)
      .input("CONTACT_PHO", obj.CONTACT_PHO)
      .input("CONTACT_ADDRESS", obj.CONTACT_ADDRESS)
      .input("CONTACT_FB_LINK", obj.CONTACT_FB_LINK)
      .input("CONTACT_WHATSAPP_LINK", obj.CONTACT_WHATSAPP_LINK)
      .input("CONTACT_INSTA_LINK", obj.CONTACT_INSTA_LINK)
      .input("CONTACT_TWITTER_LINK", obj.CONTACT_TWITTER_LINK)
      .input("CONTACT_LINKEDIN_LINK", obj.CONTACT_LINKEDIN_LINK)
      .query(
        `UPDATE CONTACT SET CONTACT_WHATSAPP_LINK = @CONTACT_WHATSAPP_LINK, CONTACT_NAME = @CONTACT_NAME, CONTACT_EMAIL= @CONTACT_EMAIL, CONTACT_PHO=@CONTACT_PHO, CONTACT_ADDRESS = @CONTACT_ADDRESS, CONTACT_FB_LINK = @CONTACT_FB_LINK, CONTACT_INSTA_LINK = @CONTACT_INSTA_LINK, CONTACT_TWITTER_LINK = @CONTACT_TWITTER_LINK, CONTACT_LINKEDIN_LINK = @CONTACT_LINKEDIN_LINK WHERE CONTACT_PKID =@CONTACT_PKID`
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("updateContactUs-->", error);
  }
}

module.exports = {
  getAllContactUs: getAllContactUs,
  addContactUs: addContactUs,
  deleteContactUs: deleteContactUs,
  updateContactUs: updateContactUs,
};
