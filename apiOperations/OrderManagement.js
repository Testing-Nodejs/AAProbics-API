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

async function PlaceOrder(obj) {
  var orderNo = "";
  var cnt = 0;
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .query(
        "select [ORDERS_NUMBER] from [dbo].[ORDERS] where [ORDERS_PKID] = (select max([ORDERS_PKID]) from [dbo].[ORDERS])"
      );
    if (result.rowsAffected[0] == 0) {
      orderNo = "AAP-00001";
    } else {
      var ono = result.recordsets[0][0].ORDERS_NUMBER;
      var splitedval = ono.split("-");
      var finalno = parseInt(splitedval[1]) + 1;
      if (finalno.toString().length === 1) {
        orderNo = "AAP-0000" + finalno + "";
      } else if (finalno.toString().length === 2) {
        orderNo = "AAP-000" + finalno + "";
        console.log(orderNo);
      } else if (finalno.toString().length === 3) {
        orderNo = "AAP-00" + finalno + "";
      } else if (finalno.toString().length === 4) {
        orderNo = "AAP-00" + finalno + "";
      } else if (finalno.toString().length === 5) {
        orderNo = "AAP-0" + finalno + "";
      } else if (finalno.toString().length === 6) {
        orderNo = "AAP-" + finalno + "";
      }
    }
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var InsertStatus = await pool
      .request()
      .input("ORDERS_NUMBER", orderNo)
      .input("ORDERS_CUSTOMER_FKID", obj.ORDERS_CUSTOMER_FKID)
      .input("ORDERS_ADDRESS_FKID", obj.ORDERS_ADDRESS_FKID)
      .input("ORDERS_COUPON_FKID", obj.ORDERS_COUPON_FKID)
      .input("ORDERS_COUPON_TYPE", obj.ORDERS_COUPON_TYPE)
      .input("ORDERS_NO_OF_ITEMS", obj.ORDERS_NO_OF_ITEMS)
      .input("ORDERS_SUB_TOTAL", obj.ORDERS_SUB_TOTAL)
      .input("ORDERS_SHIPPING_AMOUNT", obj.ORDERS_SHIPPING_AMOUNT)
      .input("ORDERS_TOTAL_AMOUNT", obj.ORDERS_TOTAL_AMOUNT)
      .input("ORDERS_COUPON_DISCOUNT", obj.ORDERS_COUPON_DISCOUNT)
      .input("ORDERS_GRAND_TOTAL", obj.ORDERS_GRAND_TOTAL)
      .input("ORDERS_PAYMENT_MODE", obj.ORDERS_PAYMENT_MODE)
      .input("ORDERS_STATUS", "0")
      .input("ORDERS_ACTIVE", "0")
      .query(
        "INSERT INTO ORDERS(ORDERS_NUMBER,ORDERS_DATE,ORDERS_CUSTOMER_FKID,ORDERS_ADDRESS_FKID,ORDERS_COUPON_FKID,ORDERS_COUPON_TYPE,ORDERS_NO_OF_ITEMS,ORDERS_SUB_TOTAL,ORDERS_SHIPPING_AMOUNT,ORDERS_TOTAL_AMOUNT,ORDERS_COUPON_DISCOUNT,ORDERS_GRAND_TOTAL,ORDERS_PAYMENT_MODE,ORDERS_STATUS,ORDERS_ACTIVE) VALUES (@ORDERS_NUMBER,GETDATE(),@ORDERS_CUSTOMER_FKID,@ORDERS_ADDRESS_FKID,@ORDERS_COUPON_FKID,@ORDERS_COUPON_TYPE,@ORDERS_NO_OF_ITEMS,@ORDERS_SUB_TOTAL,@ORDERS_SHIPPING_AMOUNT,@ORDERS_TOTAL_AMOUNT,@ORDERS_COUPON_DISCOUNT,@ORDERS_GRAND_TOTAL,@ORDERS_PAYMENT_MODE,@ORDERS_STATUS,@ORDERS_ACTIVE)"
      );
    if (InsertStatus.rowsAffected) {
      var pool = await sql.connect(config);
      if (pool._connected == false) {
        pool = await sql.connect(config);
      }
      var MaxID = await pool
        .request()
        .input("COUPON_CODE", obj.COUPON_CODE)
        .query("select max([ORDERS_PKID]) as OrderID from [dbo].[ORDERS]");
      if (MaxID.rowsAffected[0] > 0) {
        var OrderID = MaxID.recordsets[0][0].OrderID;
        for (let i = 0; i < obj.OrderItems.length; i++) {
          var pool = await sql.connect(config);
          if (pool._connected == false) {
            pool = await sql.connect(config);
          }
          var ProductInsert = await pool
            .request()
            .input("ORDER_ITEM_ORDER_FKID", OrderID)
            .input(
              "ORDER_ITEM_PRODUCT_FKID",
              obj.OrderItems[i].ORDER_ITEM_PRODUCT_FKID
            )
            .input(
              "ORDER_ITEM_UNIT_FKID",
              obj.OrderItems[i].ORDER_ITEM_UNIT_FKID
            )
            .input("ORDER_ITEM_QUANTITY", obj.OrderItems[i].ORDER_ITEM_QUANTITY)
            .input("ORDER_ITEM_AMOUNT", obj.OrderItems[i].ORDER_ITEM_AMOUNT)
            .query(
              "INSERT INTO ORDER_ITEMS(ORDER_ITEM_ORDER_FKID,ORDER_ITEM_PRODUCT_FKID,ORDER_ITEM_UNIT_FKID,ORDER_ITEM_QUANTITY,ORDER_ITEM_AMOUNT) VALUES (@ORDER_ITEM_ORDER_FKID,@ORDER_ITEM_PRODUCT_FKID,@ORDER_ITEM_UNIT_FKID,@ORDER_ITEM_QUANTITY,@ORDER_ITEM_AMOUNT)"
            );
          if (ProductInsert.rowsAffected) {
            cnt++;
          } else {
            cnt--;
          }
        }
        if (cnt > 0) {
          var result = await pool
            .request()
            .query(
              "select [ORDERS_SUB_TOTAL],[ORDERS_CUSTOMER_FKID], [ORDERS_SHIPPING_AMOUNT],[ORDERS_TOTAL_AMOUNT], [ORDERS_COUPON_DISCOUNT],isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, [ORDERS_GRAND_TOTAL], [ORDERS_ADDRESS_FKID], ORDERS_COUPON_TYPE, ORDERS_COUPON_FKID from [dbo].[ORDERS] where [ORDERS_PKID] = (select max(ORDERS_PKID) from ORDERS)"
            );

          var OrderItems = await pool
            .request()
            .query(
              "select [ORDER_ITEM_PKID], [PRODUCT_PKID], [PRODUCT_NAME], [PRODUCT_UNIT_QTY], [ORDER_ITEM_QUANTITY], [ORDER_ITEM_AMOUNT] from [dbo].[ORDER_ITEMS] join [dbo].[PRODUCTS] on [PRODUCT_PKID] = [ORDER_ITEM_PRODUCT_FKID] join [dbo].[PRODUCT_UNIT] on [PRODUCT_UNIT_PKID] = [ORDER_ITEM_UNIT_FKID] and [PRODUCT_PKID] = [PRODUCT_UNIT_PRODUCT_FKID] where [ORDER_ITEM_ORDER_FKID] = (select max(ORDERS_PKID) from ORDERS)"
            );
          var sendmail = await pool
            .request()
            .query(
              "select REGISTERED_USERS_EMAIL from REGISTERED_USERS where REGISTERED_USERS_PKID='" +
                result.recordsets[0][0].ORDERS_CUSTOMER_FKID +
                "'"
            );
          console.log(sendmail);

          if (sendmail.rowsAffected[0] == 1) {
            var mapdata = "";
            for (var i = 0; i < OrderItems.recordsets[0].length; i++) {
              mapdata += `<tr><td style="text-align:right;border-bottom: 1px solid black;padding-right: 2%;">${OrderItems.recordsets[0][i].PRODUCT_NAME} - ${OrderItems.recordsets[0][i].PRODUCT_UNIT_QTY} × ${OrderItems.recordsets[0][i].ORDER_ITEM_QUANTITY}</td><td style="text-align:right; border-bottom: 1px solid black;border-left: 1px solid black;padding-right: 2%;">${OrderItems.recordsets[0][i].ORDER_ITEM_AMOUNT}</td></tr>`;
            }

            console.log(sendmail.recordset[0].REGISTERED_USERS_EMAIL);
            var mailOptions = {
              from: "testing.vss12@gmail.com",
              to: sendmail.recordset[0].REGISTERED_USERS_EMAIL,
              cc: 'admin@aaprobics.com',
              subject: "Customer Placed New Order!",
              html: `<html><head>
              <style>
       
        </style></head>
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2"><div style="margin:50px auto;width:70%;padding:20px 0">
                        <div style="border-bottom:1px solid #eee">
                          <a href="https://aaprobics.com/" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">AA Probics</a>
                        </div>
                        <p style="font-size:1.1em">Dear Customer,</p>
                        <p><b>Your Order Successfully Placed, details in below Table Please Check it Onece!</b></p>
                        <div className="card-table">
                        <div className="table-responsive-sm">
                            <table style="width:100%; border: 1px solid black; border-collapse: collapse;">
                                <tbody>
                                    <tr>
                                        <th style="border-bottom: 1px solid black; text-align:left;;padding-left: 2%;"><b>PRODUCT</b></th>
                                        <th style="border-bottom: 1px solid black;border-left: 1px solid black;text-align:right;;padding-right: 2%;"></b>TOTAL</b></th>
                                    </tr>
                                </tbody>
                                <tbody className="card-table__body card-table__body--merge-rows">
                                 ${mapdata}
                                </tbody>
                                <tbody className="card-table__body card-table__body--merge-rows">
                                    <tr>
                                        <th style="text-align:left;border-bottom: 1px solid black;padding-left: 2%;">Subtotal</th>
                                        <th style="text-align:right;border-bottom: 1px solid black;border-left: 1px solid black;padding-right: 2%;">${result.recordsets[0][0].ORDERS_SUB_TOTAL}</th>
                                    </tr>
                                    <tr>
                                        <th style="text-align:left;border-bottom: 1px solid black;padding-left: 2%;">Shipping</th>
                                        <th style="text-align:right;border-bottom: 1px solid black;border-left: 1px solid black;padding-right: 2%;">${result.recordsets[0][0].ORDERS_SHIPPING_AMOUNT}</th>
                                    </tr>
                                    <tr>
                                        <th style="text-align:left;border-bottom: 1px solid black;padding-left: 2%;">Total</th>
                                        <th style="text-align:right; border-bottom: 1px solid black;border-left: 1px solid black;padding-right: 2%;">${result.recordsets[0][0].ORDERS_TOTAL_AMOUNT}</th>
                                    </tr>
                                    <tr>
                                        <th style="text-align:left;border-bottom: 1px solid black;padding-left: 2%; ">Coupon Discount</th>
                                        <th style="text-align:right;border-bottom: 1px solid black;border-left: 1px solid black;padding-right: 2%;">${result.recordsets[0][0].ORDERS_COUPON_DISCOUNT}</th>
                                    </tr>
                                    <tr>
                                        <th style="text-align:left;border-bottom: 1px solid black;padding-left: 2%; ">General Discount</th>
                                        <th style="text-align:right;border-bottom: 1px solid black;border-left: 1px solid black;padding-right: 2%;">${result.recordsets[0][0].ORDERS_GENERAL_DISCOUNT}</th>
                                    </tr>
                                </tbody> 
                                <tfoot>
                                    <tr>
                                        <th style="text-align:left;padding-left: 2% ">Grand Total</th>
                                        <th style="text-align:right;border-bottom: 1px solid black;border-left: 1px solid black;padding-right: 2%">${result.recordsets[0][0].ORDERS_GRAND_TOTAL}</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        </div>
                      </div>
                      </html>`,
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });
          }
        }
        return true;
      }
    } else {
      return false;
    }
  } catch (err) {
    console.log("PlaceOrder-->", err);
  }
}

async function getOrderByCustomer(CustomerID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("ORDERS_CUSTOMER_FKID", CustomerID)
      .query(
        "select [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], [ORDERS_GRAND_TOTAL],CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS from [dbo].[ORDERS] where [ORDERS_CUSTOMER_FKID] = @ORDERS_CUSTOMER_FKID order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getOrderByCustomer-->", error);
    //
  }
}

async function getOrderItems(OrderID) {
  var OrderArray = [];
  var OrderObject = {};
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("ORDERS_PKID", OrderID)
      .query(
        "select [ORDERS_SUB_TOTAL], [ORDERS_SHIPPING_AMOUNT],[ORDERS_TOTAL_AMOUNT], [ORDERS_COUPON_DISCOUNT], [ORDERS_GRAND_TOTAL], [ORDERS_ADDRESS_FKID], ORDERS_COUPON_TYPE, ORDERS_COUPON_FKID from [dbo].[ORDERS] where [ORDERS_PKID] = @ORDERS_PKID"
      );

    var OrderItems = await pool
      .request()
      .input("ORDER_ITEM_ORDER_FKID", OrderID)
      .query(
        "select [ORDER_ITEM_PKID], [PRODUCT_PKID], [PRODUCT_NAME], [PRODUCT_UNIT_QTY], [ORDER_ITEM_QUANTITY], [ORDER_ITEM_AMOUNT] from [dbo].[ORDER_ITEMS] join [dbo].[PRODUCTS] on [PRODUCT_PKID] = [ORDER_ITEM_PRODUCT_FKID] join [dbo].[PRODUCT_UNIT] on [PRODUCT_UNIT_PKID] = [ORDER_ITEM_UNIT_FKID] and [PRODUCT_PKID] = [PRODUCT_UNIT_PRODUCT_FKID] where [ORDER_ITEM_ORDER_FKID] = @ORDER_ITEM_ORDER_FKID"
      );

    var OrderAddress = await pool
      .request()
      .input("USER_ADDRESS_PKID", result.recordsets[0][0].ORDERS_ADDRESS_FKID)
      .query(
        "select [USER_ADDRESS_NAME], [USER_ADDRESS_PHONE], [USER_ADDRESS_TYPE], [USER_ADDRESS_HOUSE_NO], [USER_ADDRESS_STREET], [CITY_NAME], [STATE_NAME], [COUNTRY_NAME], [USER_ADDRESS_ZIPCODE], [USER_ADDRESS_DEFAULT] from [dbo].[USER_ADDRESS] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] where [USER_ADDRESS_PKID] = @USER_ADDRESS_PKID"
      );

    var couponData = [];
    if (
      result.recordsets[0][0].ORDERS_COUPON_FKID !== "0" ||
      result.recordsets[0][0].ORDERS_COUPON_FKID !== 0
    ) {
      if (result.recordsets[0][0].ORDERS_COUPON_TYPE == "AAProbics Member") {
        var couponData1 = await pool
          .request()
          .input(
            "MEMBER_COUPON_PKID",
            result.recordsets[0][0].ORDERS_COUPON_FKID
          )
          .query(
            "select [MEMBER_COUPON_CODE], [MEMBER_COUPON_DISCOUNT],'AAProbics Member' as MEMBER_COUPON_TYPE, MEMBER_NAME from [dbo].[MEMBER_COUPON] join [dbo].[MEMBER] on [MEMBER_PKID] = [MEMBER_COUPON_MEMBER_FKID] where [MEMBER_COUPON_PKID] = @MEMBER_COUPON_PKID"
          );
        couponData.push(couponData1.recordsets[0][0]);
      } else if (result.recordsets[0][0].ORDERS_COUPON_TYPE == "Doctor") {
        var couponData2 = await pool
          .request()
          .input(
            "MEMBER_COUPON_PKID",
            result.recordsets[0][0].ORDERS_COUPON_FKID
          )
          .query(
            "select [MEMBER_COUPON_CODE], [MEMBER_COUPON_DISCOUNT],'Doctor' as MEMBER_COUPON_TYPE, MEMBER_NAME from [dbo].[MEMBER_COUPON] join [dbo].[MEMBER] on [MEMBER_PKID] = [MEMBER_COUPON_MEMBER_FKID] where [MEMBER_COUPON_PKID] = @MEMBER_COUPON_PKID"
          );
        couponData.push(couponData2.recordsets[0][0]);
      } else if (result.recordsets[0][0].ORDERS_COUPON_TYPE == "AAProbics") {
        var couponData3 = await pool
          .request()
          .input("COUPON_PKID", result.recordsets[0][0].ORDERS_COUPON_FKID)
          .query(
            "select [COUPON_CODE], [COUPON_DISCOUNT],'AAProbics' as MEMBER_COUPON_TYPE, 'AAProbics' as MEMBER_NAME from [dbo].[COUPON] where [COUPON_PKID] = @COUPON_PKID"
          );
        couponData.push(couponData3.recordsets[0][0]);
      }
    }

    var OrderAddress = await pool
      .request()
      .input("USER_ADDRESS_PKID", result.recordsets[0][0].ORDERS_ADDRESS_FKID)
      .query(
        "select [USER_ADDRESS_NAME], [USER_ADDRESS_PHONE], [USER_ADDRESS_TYPE], [USER_ADDRESS_HOUSE_NO], [USER_ADDRESS_STREET], [CITY_NAME], [STATE_NAME], [COUNTRY_NAME], [USER_ADDRESS_ZIPCODE], [USER_ADDRESS_DEFAULT] from [dbo].[USER_ADDRESS] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] where [USER_ADDRESS_PKID] = @USER_ADDRESS_PKID"
      );

    OrderObject = {
      ORDERS_SUB_TOTAL: result.recordsets[0][0].ORDERS_SUB_TOTAL,
      ORDERS_SHIPPING_AMOUNT: result.recordsets[0][0].ORDERS_SHIPPING_AMOUNT,
      ORDERS_TOTAL_AMOUNT: result.recordsets[0][0].ORDERS_TOTAL_AMOUNT,
      ORDERS_COUPON_DISCOUNT: result.recordsets[0][0].ORDERS_COUPON_DISCOUNT,
      ORDERS_GRAND_TOTAL: result.recordsets[0][0].ORDERS_GRAND_TOTAL,
      ORDERS_ITEMS: OrderItems.recordsets[0],
      ORDERS_ADDRESS: OrderAddress.recordsets[0],
      ORDERS_COUPONS:
        result.recordsets[0][0].ORDERS_COUPON_FKID == "0" ? [] : couponData,
    };
    OrderArray.push(OrderObject);

    return OrderArray;
  } catch (error) {
    console.log("getOrderItems-->", error);
    //
  }
}

async function getRecentOrders(CustomerID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("ORDERS_CUSTOMER_FKID", CustomerID)
      .query(
        "select top 3 [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], [ORDERS_GRAND_TOTAL],CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' ELSE 'Pending' END AS ORDER_STATUS from [dbo].[ORDERS] where [ORDERS_CUSTOMER_FKID] = @ORDERS_CUSTOMER_FKID order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getRecentOrders-->", error);
    //
  }
}

async function getPendingOrders() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS],isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 0 and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getPendingOrders-->", error);
    //
  }
}

async function getAcceptedOrders() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS],isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 1 and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAcceptedOrders-->", error);
    //
  }
}

async function getPackedOrders() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS],isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 2 and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getPackedOrders-->", error);
    //
  }
}

async function getDispatchedOrders() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS],isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID,ORDERS_DOC, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 3 and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("geDispatchedOrders-->", error);
    //
  }
}

async function getDeliveredOrders() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS],isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_DOC,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 4 and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getDeliveredOrders-->", error);
    //
  }
}

async function getRejectedOrders() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS],isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 5 and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getRejectedOrders-->", error);
    //
  }
}

async function getOrdersByOrderNum(OrderNum) {
  try {
    console.log(OrderNum);
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("ORDERS_NUMBER", OrderNum)
      .query(
        "select [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], [ORDERS_GRAND_TOTAL], ORDERS_STATUS as ORDERS_STATUS_ID,CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS from [dbo].[ORDERS] where ORDERS_NUMBER = @ORDERS_NUMBER order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getOrdersByOrderNum-->", error);
    //
  }
}

async function AcceptOrders(OrderId) {
  try {
    var cnt = 1;
    var pool = await sql.connect(config);
    var Initiate = await pool
      .request()
      .input("ORDER_ITEM_ORDER_FKID", OrderId)
      .query(
        "select ORDER_ITEM_QUANTITY,[ORDER_ITEM_PRODUCT_FKID],[ORDER_ITEM_UNIT_FKID],[PRODUCT_STOCK_AVAILABLE_STOCK] from ORDER_ITEMS join [dbo].[PRODUCT_STOCK] on [PRODUCT_STOCK_PROD_FKID] = [ORDER_ITEM_PRODUCT_FKID] and [PRODUCT_STOCK_PROD_UNIT]= [ORDER_ITEM_UNIT_FKID] where ORDER_ITEM_ORDER_FKID = @ORDER_ITEM_ORDER_FKID"
      );
    var itemarrrr = Initiate.recordsets[0];
    if (itemarrrr.length == 0) {
      cnt = 0;
    } else {
      for (var i = 0; i < itemarrrr.length; i++) {
        if (
          parseInt(itemarrrr[i].PRODUCT_STOCK_AVAILABLE_STOCK) <
          parseInt(itemarrrr[i].ORDER_ITEM_QUANTITY)
        ) {
          cnt = 0;
          break;
        }
      }
    }

    console.log("cnt");
    console.log(cnt);
    if (cnt > 0) {
      var result = await pool
        .request()
        .input("ORDERS_PKID", OrderId)
        .query(
          "update ORDERS set ORDERS_STATUS = 1 where ORDERS_PKID =  @ORDERS_PKID"
        );
      if (result.rowsAffected[0] == 1) {
        var result1 = await pool
          .request()
          .input("ORDER_ITEM_ORDER_FKID", OrderId)
          .query(
            "select ORDER_ITEM_QUANTITY,[ORDER_ITEM_PRODUCT_FKID],[ORDER_ITEM_UNIT_FKID],[PRODUCT_STOCK_AVAILABLE_STOCK] from ORDER_ITEMS join [dbo].[PRODUCT_STOCK] on [PRODUCT_STOCK_PROD_FKID] = [ORDER_ITEM_PRODUCT_FKID] and [PRODUCT_STOCK_PROD_UNIT]= [ORDER_ITEM_UNIT_FKID] where ORDER_ITEM_ORDER_FKID = @ORDER_ITEM_ORDER_FKID"
          );
        if (result1.rowsAffected) {
          var itemarr = result1.recordsets[0];
          for (var i = 0; i < itemarr.length; i++) {
            var previous_bal =
              parseInt(itemarr[i].PRODUCT_STOCK_AVAILABLE_STOCK) -
              parseInt(itemarr[i].ORDER_ITEM_QUANTITY);
            var newresult = await pool
              .request()
              .query(
                "update PRODUCT_STOCK set PRODUCT_STOCK_AVAILABLE_STOCK = " +
                  previous_bal +
                  " where PRODUCT_STOCK_PROD_FKID = " +
                  itemarr[i].ORDER_ITEM_PRODUCT_FKID +
                  " and PRODUCT_STOCK_PROD_UNIT = " +
                  itemarr[i].ORDER_ITEM_UNIT_FKID +
                  ""
              );
          }
          return "1";
        }
      } else {
        return "2";
      }
    } else {
      return "0";
    }
  } catch (error) {
    console.log("AcceptOrders-->", error);
    //
  }
}

async function RejectOrders(OrderId, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("ORDERS_PKID", OrderId)
      .input("ORDERS_COMMENTS", obj.ORDERS_COMMENTS)
      .query(
        "update ORDERS set ORDERS_STATUS = 5, ORDERS_COMMENTS = @ORDERS_COMMENTS where ORDERS_PKID =  @ORDERS_PKID"
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("RejectOrders-->", error);
  }
}

async function PackedOrders(OrderId) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("ORDERS_PKID", OrderId)
      .query(
        "update ORDERS set ORDERS_STATUS = 2 where ORDERS_PKID =  @ORDERS_PKID"
      );
    if (result.rowsAffected[0] == 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("PackedOrders-->", error);
    //
  }
}

async function DispatchedOrders(OrderID, obj) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("ORDERS_PKID", OrderID)
      .input("ORDERS_DOC", obj.ORDERS_DOC)
      .query(
        "update ORDERS set ORDERS_STATUS = 3, ORDERS_DOC = @ORDERS_DOC where ORDERS_PKID =  @ORDERS_PKID"
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("DispatchedOrders-->", error);
  }
}

async function DeliveredOrders(OrderId) {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .input("ORDERS_PKID", OrderId)
      .query(
        "update ORDERS set ORDERS_STATUS = 4 where ORDERS_PKID =  @ORDERS_PKID"
      );
    if (result.rowsAffected[0] == 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("DeliveredOrders-->", error);
    //
  }
}

async function getAllOrders() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS],isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE  from [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join CITY on CITY_PKID = USER_ADDRESS_CITY_FKID join STATE on STATE_PKID = USER_ADDRESS_STATE_FKID join COUNTRY on COUNTRY_PKID = USER_ADDRESS_COUNTRY_FKID where year([ORDERS_DATE]) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("AllOrders-->", error);
  }
}

async function getPendingOrdersByDates(fdate, tdate) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS],isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 0 AND ORDERS_DATE BETWEEN '" +
          fdate +
          "' AND '" +
          tdate +
          "' and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getPendingOrdersByDates-->", error);
    //
  }
}

async function getPendingOrdersByMonth(month) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS],isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 0 AND MONTH(ORDERS_DATE) = '" +
          month +
          "' and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    console.log(result);
    return result.recordsets[0];
  } catch (error) {
    console.log("getPendingOrdersByMonth-->", error);
    //
  }
}

async function geAcceptedOrdersByDates(fdate, tdate) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS],isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 1 AND ORDERS_DATE BETWEEN '" +
          fdate +
          "' AND '" +
          tdate +
          "' and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("geAcceptedOrdersByDates-->", error);
    //
  }
}

async function getAcceptedOrdersByMonth(month) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS],isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 1 AND MONTH(ORDERS_DATE) = '" +
          month +
          "' and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAcceptedOrdersByMonth-->", error);
    //
  }
}

async function getPackedOrdersByDates(fdate, tdate) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS],isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 2 AND ORDERS_DATE BETWEEN '" +
          fdate +
          "' AND '" +
          tdate +
          "' and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getPackedOrdersByDates-->", error);
    //
  }
}

async function getPackedOrdersByMonth(month) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS],isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 2 AND MONTH(ORDERS_DATE) = '" +
          month +
          "' and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getPackedOrdersByMonth-->", error);
    //
  }
}

async function getDispatchedOrdersByDates(fdate, tdate) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS],isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 3 AND ORDERS_DATE BETWEEN '" +
          fdate +
          "' AND '" +
          tdate +
          "' and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getDispatchedOrdersByDates-->", error);
    //
  }
}

async function getDispatchedOrdersByMonth(month) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS],isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 3 AND MONTH(ORDERS_DATE) = '" +
          month +
          "' and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getDispatchedOrdersByMonth-->", error);
    //
  }
}

async function getDeliveredOrdersByDates(fdate, tdate) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 4 AND ORDERS_DATE BETWEEN '" +
          fdate +
          "' AND '" +
          tdate +
          "' and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getDeliveredOrdersByDates-->", error);
    //
  }
}

async function getDeliveredOrdersByMonth(month) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 4 AND MONTH(ORDERS_DATE) = '" +
          month +
          "' and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getDeliveredOrdersByMonth-->", error);
    //
  }
}

async function getRejectedOrdersByDates(fdate, tdate) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 5 AND ORDERS_DATE BETWEEN '" +
          fdate +
          "' AND '" +
          tdate +
          "' and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getRejectedOrdersByDates-->", error);
    //
  }
}

async function getRejectedOrdersByMonth(month) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 5 AND MONTH(ORDERS_DATE) = '" +
          month +
          "' and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getRejectedOrdersByMonth-->", error);
    //
  }
}

async function DelayedOrders(OrderId, obj) {
  console.log(obj);
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("ORDERS_PKID", OrderId)
      .input("ORDERS_DELAYED_DATE", obj.ORDERS_DELAYED_DATE)
      .input("ORDERS_DELAYED_COMMENTS", obj.ORDERS_DELAYED_COMMENTS)
      .query(
        "update ORDERS set ORDERS_STATUS = 6, ORDERS_DELAYED_DATE = @ORDERS_DELAYED_DATE,ORDERS_DELAYED_COMMENTS= @ORDERS_DELAYED_COMMENTS where ORDERS_PKID =  @ORDERS_PKID"
      );

    var message = false;

    if (result.rowsAffected) {
      message = true;
    }
    return message;
  } catch (error) {
    console.log("DelayedOrders-->", error);
  }
}

async function getDelayedOrders() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID,ORDERS_DELAYED_DATE,ORDERS_DELAYED_COMMENTS, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' WHEN ORDERS_STATUS = 6 THEN 'Delayed' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 6 and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    console.log(result.recordsets[0]);
    return result.recordsets[0];
  } catch (error) {
    console.log("getDelayedOrders-->", error);
    //
  }
}

async function AcceptDelayedOrders(OrderId) {
  try {
    var pool = await sql.connect(config);
    var result = await pool

      .request()
      .input("ORDERS_PKID", OrderId)
      .query(
        "update ORDERS set ORDERS_STATUS = 1 where ORDERS_PKID =  @ORDERS_PKID"
      );
    if (result.rowsAffected[0] == 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("AcceptDelayedOrders-->", error);
    //
  }
}

async function DelayedOrdersByDates(fdate, tdate) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' WHEN ORDERS_STATUS = 6 THEN 'Delayed' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 6 AND ORDERS_DATE BETWEEN '" +
          fdate +
          "' AND '" +
          tdate +
          "' and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("DelayedOrdersByDates-->", error);
    //
  }
}

async function DelayedOrdersByMonth(month) {
  console.log(month);
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' WHEN ORDERS_STATUS = 6 THEN 'Delayed' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 6 AND MONTH(ORDERS_DATE) = '" +
          month +
          "' and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
      );
    console.log(
      "SELECT isnull(COUPON_CODE, '-') as COUPON_CODE, isnull(COUPON_DISCOUNT, '-') as COUPON_DISCOUNT, isnull(COUPON_NAME, '-') as COUPON_NAME,ORDERS_STATUS, [ORDERS_PKID], [ORDERS_NUMBER], [ORDERS_DATE], [ORDERS_NO_OF_ITEMS], isnull(ORDERS_GENERAL_DISCOUNT, '-') as ORDERS_GENERAL_DISCOUNT, ORDERS_SUB_TOTAL,ORDERS_COUPON_TYPE, ORDERS_SHIPPING_AMOUNT, ORDERS_TOTAL_AMOUNT, ORDERS_COUPON_DISCOUNT,ORDERS_PAYMENT_MODE, [ORDERS_GRAND_TOTAL],REGISTERED_USERS_NAME, REGISTERED_USERS_PHONE,REGISTERED_USERS_EMAIL,ORDERS_ADDRESS_FKID, CASE WHEN ORDERS_STATUS = 1 THEN 'Accepted' WHEN ORDERS_STATUS = 2 THEN 'Packed' WHEN ORDERS_STATUS = 3 THEN 'Dispatched' WHEN ORDERS_STATUS = 4 THEN 'Delivered' WHEN ORDERS_STATUS = 5 THEN 'Rejected' WHEN ORDERS_STATUS = 6 THEN 'Delayed' ELSE 'Pending' END AS ORDER_STATUS, isnull(ORDERS_COMMENTS, '-') as ORDERS_COMMENTS, USER_ADDRESS_NAME, USER_ADDRESS_PHONE, USER_ADDRESS_TYPE, USER_ADDRESS_HOUSE_NO, USER_ADDRESS_STREET, CITY_NAME, STATE_NAME, COUNTRY_NAME, USER_ADDRESS_ZIPCODE FROM [dbo].[ORDERS] left JOIN [dbo].[COUPON] on [COUPON_PKID] = [ORDERS_COUPON_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [ORDERS_CUSTOMER_FKID] join [dbo].[USER_ADDRESS] on [USER_ADDRESS_PKID] = [ORDERS_ADDRESS_FKID] join [dbo].[CITY] on [CITY_PKID] = [USER_ADDRESS_CITY_FKID] join [dbo].[COUNTRY] on [COUNTRY_PKID] = [USER_ADDRESS_COUNTRY_FKID] join [dbo].[STATE] on [STATE_PKID] = [USER_ADDRESS_STATE_FKID] where ORDERS_STATUS = 6 AND MONTH(ORDERS_DATE) = '" +
        month +
        "' and YEAR(ORDERS_DATE) = year(getdate()) order by ORDERS_PKID desc"
    );
    console.log(result.recordsets[0]);
    return result.recordsets[0];
  } catch (error) {
    console.log("DelayedOrdersByMonth-->", error);
    //
  }
}

module.exports = {
  PlaceOrder: PlaceOrder,
  getOrderByCustomer: getOrderByCustomer,
  getOrderItems: getOrderItems,
  getRecentOrders: getRecentOrders,
  getPendingOrders: getPendingOrders,
  getAcceptedOrders: getAcceptedOrders,
  getPackedOrders: getPackedOrders,
  getOrdersByOrderNum: getOrdersByOrderNum,
  getDispatchedOrders: getDispatchedOrders,
  getDeliveredOrders: getDeliveredOrders,
  getRejectedOrders: getRejectedOrders,
  RejectOrders: RejectOrders,
  AcceptOrders: AcceptOrders,
  getPendingOrdersByDates: getPendingOrdersByDates,
  getPendingOrdersByMonth: getPendingOrdersByMonth,
  PackedOrders: PackedOrders,
  DispatchedOrders: DispatchedOrders,
  DeliveredOrders: DeliveredOrders,
  getAllOrders: getAllOrders,
  geAcceptedOrdersByDates: geAcceptedOrdersByDates,
  getAcceptedOrdersByMonth: getAcceptedOrdersByMonth,
  getPackedOrdersByDates: getPackedOrdersByDates,
  getPackedOrdersByMonth: getPackedOrdersByMonth,
  getDispatchedOrdersByDates: getDispatchedOrdersByDates,
  getDispatchedOrdersByMonth: getDispatchedOrdersByMonth,
  getDeliveredOrdersByDates: getDeliveredOrdersByDates,
  getDeliveredOrdersByMonth: getDeliveredOrdersByMonth,
  getRejectedOrdersByDates: getRejectedOrdersByDates,
  getRejectedOrdersByMonth: getRejectedOrdersByMonth,
  DelayedOrders: DelayedOrders,
  getDelayedOrders: getDelayedOrders,
  AcceptDelayedOrders: AcceptDelayedOrders,
  DelayedOrdersByDates: DelayedOrdersByDates,
  DelayedOrdersByMonth: DelayedOrdersByMonth,
};
