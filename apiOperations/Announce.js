/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

var transporter = nodemailer.createTransport(
    smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: "testing.vss12@gmail.com",
            pass: "zagoeiuaybmrraww",
        },
    })
);


async function getAnnounce() {
    try {
        var pool = await sql.connect(config);
        var result = await pool
            .request()
            .query(
                "SELECT * from ANNOUNCE"
            );
        return result.recordsets[0];
    } catch (error) {
        console.log("getAnnounce-->", error);
    }
}

async function AddAnnounce(obj) {
    try {
        var pool = await sql.connect(config);
        if (pool._connected == false) {
            pool = await sql.connect(config);
        }
        var insertInto = await pool
            .request()
            .input("ANNOUNCE_IMAGE", obj.ANNOUNCE_IMAGE)
            .input("ANNOUNCE_DESCRIPTION", obj.ANNOUNCE_DESCRIPTION)
            .query(
                "insert into ANNOUNCE ([ANNOUNCE_IMAGE],[ANNOUNCE_DESCRIPTION])  values(@ANNOUNCE_IMAGE,@ANNOUNCE_DESCRIPTION)"
            );
        if (pool._connected == false) {
            pool = await sql.connect(config);
        }
        if (insertInto.rowsAffected == 1) {

            var sendmail = await pool.request()
                .query("select REGISTERED_USERS_EMAIL as Emails from REGISTERED_USERS union select SUBSCRIBED_USERS_EMAIL as Emails from SUBSCRIBED_USERS");
            console.log(sendmail);

            for (var i = 0; i < sendmail.recordset.length; i++) {
                console.log(sendmail.recordset[i].Emails);
                var mailOptions = {
                    from: "testing.vss12@gmail.com",
                    to: sendmail.recordset[i].Emails,
                    subject: "Announcement!",
                    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2"><div style="margin:50px auto;width:70%;padding:20px 0">
                        <div style="border-bottom:1px solid #eee">
                          <a href="https://aaprobics.com/" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">AA Probics</a>
                        </div>
                        <p style="font-size:1.1em">Announcement from AA Probics</p>
                        <img src="${obj.ANNOUNCE_IMAGE}" style="width:50px; height:50px;">
                        <p style="font-size:1.1em">${obj.ANNOUNCE_DESCRIPTION}</p>
                        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;"></h2>
                        <p style="font-size:0.9em;">Regards,<br />AA Probics,</p>
                        <hr style="border:none;border-top:1px solid #eee" />
                        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        </div>
                      </div>
                    </div>`,
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });
            }
            return "1";
        } else {
            return "2";
        }
    } catch (err) {
        console.log("AddAnnounce-->", err);
    }
}

async function deleteAnnounce(AnnounceID) {
    try {
        var pool = await sql.connect(config);
        if (pool._connected == false) {
            pool = await sql.connect(config);
        }
        var result = await pool
            .request()
            .input("ANNOUNCE_PKID", AnnounceID)
            .query("DELETE FROM ANNOUNCE WHERE ANNOUNCE_PKID=@ANNOUNCE_PKID");

        if (result.rowsAffected[0] == 0) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.log("deleteAnnounce-->", error);
        //
    }
}

async function updateAnnounce(AnnounceID, obj) {
    try {
        var pool = await sql.connect(config);
        var result = await pool
            .request()
            .input("ANNOUNCE_PKID", AnnounceID)
            .input("ANNOUNCE_IMAGE", obj.ANNOUNCE_IMAGE)
            .input("ANNOUNCE_DESCRIPTION", obj.ANNOUNCE_DESCRIPTION)
            .query(
                `UPDATE ANNOUNCE SET ANNOUNCE_IMAGE = @ANNOUNCE_IMAGE, ANNOUNCE_DESCRIPTION= @ANNOUNCE_DESCRIPTION WHERE ANNOUNCE_PKID =@ANNOUNCE_PKID`
            );

        var message = false;

        if (result.rowsAffected) {
            var sendmail = await pool.request()
                .query("select REGISTERED_USERS_EMAIL as Emails from REGISTERED_USERS union select SUBSCRIBED_USERS_EMAIL as Emails from SUBSCRIBED_USERS");
            console.log(sendmail);

            for (var i = 0; i < sendmail.recordset.length; i++) {
                console.log(sendmail.recordset[i].Emails);
                var mailOptions = {
                    from: "testing.vss12@gmail.com",
                    to: sendmail.recordset[i].Emails,
                    subject: "Announcement!",
                    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2"><div style="margin:50px auto;width:70%;padding:20px 0">
                        <div style="border-bottom:1px solid #eee">
                          <a href="https://aaprobics.com/" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">AA Probics</a>
                        </div>
                        <p style="font-size:1.1em">Announcement from AA Probics</p>
                        <img src="http://192.168.1.10:7760/${obj.ANNOUNCE_IMAGE}" style="width:13rem; height:10rem;">
                        <p style="font-size:1.1em">${obj.ANNOUNCE_DESCRIPTION}</p>
                        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;"></h2>
                        <p style="font-size:0.9em;">Regards,<br />AA Probics,</p>
                        <hr style="border:none;border-top:1px solid #eee" />
                        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        </div>
                      </div>
                    </div>`,
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });
            }
            message = true;
        }
        return message;
    } catch (error) {
        console.log("updateAward-->", error);
    }
}

module.exports = {
    getAnnounce: getAnnounce,
    AddAnnounce: AddAnnounce,
    deleteAnnounce: deleteAnnounce,
    updateAnnounce: updateAnnounce,
};
