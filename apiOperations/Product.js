/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");
const QRCode = require("qrcode");
const path = require("path");

async function getAllProduct() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "SELECT * FROM [PRODUCTS] left join PRODUCT_QR on [PRODUCT_PKID] = [PRODUCT_QR_PRODUCT_FKID] join PRODUCT_CATEGORY on PRODUCT_CATEGORY_PKID = [PRODUCT_CAT_FKID] join PRODUCT_SUB_CATEGORY on PRODUCT_SUB_CATEGORY_PKID = PRODUCT_SUB_CAT_FKID"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllProduct-->", error);
    //
  }
}

async function ProductQR() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select [PRODUCT_PKID],[PRODUCT_NAME],[PRODUCT_QR_FILE] from [dbo].[PRODUCT_QR] join [dbo].[PRODUCTS] on [PRODUCT_PKID] = [PRODUCT_QR_PRODUCT_FKID]"
      );
    return result.recordsets[0];
  } catch (error) {
    console.log("ProductQR-->", error);
    //
  }
}

async function getAllProducts() {
  var kimoArray = [];
  var Obj = {};
  var pool = await sql.connect(config);
  try {
    var result = await pool
      .request()
      // .query(
      //   "select *, (select count(distinct[PRODUCT_REVIEWS_COMMENTS]) from [dbo].[PRODUCT_REVIEWS] where [PRODUCT_REVIEWS_PRODUCT_FKID] = pt.PRODUCT_PKID) as 'REVIEW_COUNT',isnull((select AVG(CAST([PRODUCT_REVIEWS_STAR_RATINGS] as int)) FROM [PRODUCT_REVIEWS] WHERE [PRODUCT_REVIEWS_PRODUCT_FKID] = pt.PRODUCT_PKID), 0) as 'RATINGS_AVERAGE' from [dbo].[PRODUCTS] AS pt"
      // );
      .execute("AllProductsWithRatings");

    var kimo = result.recordsets[0];

    for (let i = 0; i < kimo.length; i++) {
      var res2 = await pool
        .request()
        .input("PRODUCT_UNIT_PRODUCT_FKID", kimo[i].PRODUCT_PKID)
        .query(
          "select min(PRODUCT_UNIT_SELLING_PRICE) as minprice, max(PRODUCT_UNIT_SELLING_PRICE) as maxprice,min(PRODUCT_UNIT_GENERAL_DISCOUNT) as mindis, max(PRODUCT_UNIT_GENERAL_DISCOUNT) as maxdis,min(PRODUCT_UNIT_ACTUAL_PRICE) as minaprice, max(PRODUCT_UNIT_ACTUAL_PRICE) as maxaprice  from PRODUCT_UNIT where PRODUCT_UNIT_PRODUCT_FKID = @PRODUCT_UNIT_PRODUCT_FKID"
        );

      var res3 = await pool
        .request()
        .input("PRODUCT_PKID", kimo[i].PRODUCT_PKID)
        .query(
          "select [PRODUCT_CATEGORY_NAME] from [dbo].[PRODUCT_CATEGORY] join [dbo].[PRODUCTS] on [PRODUCT_CAT_FKID] = [PRODUCT_CATEGORY_PKID] where [PRODUCT_PKID] = @PRODUCT_PKID"
        );
      Obj = {
        pkid: kimo[i].PRODUCT_PKID,
        slug: kimo[i].PRODUCT_NAME,
        name: kimo[i].PRODUCT_NAME,
        desc: kimo[i].PRODUCT_NAME,
        price:
          res2.recordsets[0][0].minprice === res2.recordsets[0][0].maxprice
            ? res2.recordsets[0][0].minprice
            : res2.recordsets[0][0].minprice +
              " - ₹" +
              res2.recordsets[0][0].maxprice,
        Actualprice:
          res2.recordsets[0][0].minaprice === res2.recordsets[0][0].maxaprice
            ? res2.recordsets[0][0].minaprice
            : res2.recordsets[0][0].minaprice +
              " - " +
              res2.recordsets[0][0].maxaprice,
        description: kimo[i].PRODUCT_DEFINITION,
        images: [
          kimo[i].PRODUCT_IMAGE_1,
          kimo[i].PRODUCT_IMAGE_2,
          kimo[i].PRODUCT_IMAGE_3,
        ],
        badges:
          res2.recordsets[0][0].mindis === res2.recordsets[0][0].maxdis
            ? res2.recordsets[0][0].mindis + "% off"
            : res2.recordsets[0][0].mindis +
              "%" +
              " - " +
              res2.recordsets[0][0].maxdis +
              "% off",
        rating: kimo[i].RATINGS_AVERAGE,
        reviews: kimo[i].REVIEW_COUNT,
        availability: "in-stock",
        brand: "AAProbics",
        categories: [res3.recordsets[0][0].PRODUCT_CATEGORY_NAME],
        specification: [
          {
            name: "Product Information",
            features: [
              { name: "Active Ingredients", value: "Vitamin D3" },
              { name: "Each Gummy Contains", value: "850IU" },
              { name: "Serving Size", value: "Adults : 1 gummy/day" },
              { name: "Available Flavours", value: "Berry" },
              { name: "Available Shapes", value: "Gum Drop and Coin Shape" },
            ],
          },
          {
            name: "Product Benefits",
            features: [{ name: kimo[i].PRODUCT_BENEFITS, value: "" }],
          },
        ],
      };
      kimoArray.push(Obj);
    }
    return kimoArray;
  } catch (error) {
    console.log("getProductsByCompany-->", error);
  }
}

async function ProductsByCat(CategoryID) {
  var kimoArray = [];
  var Obj = {};
  var pool = await sql.connect(config);
  try {
    var result = await pool
      .request()
      // .query(
      //   "select *, (select count(distinct[PRODUCT_REVIEWS_COMMENTS]) from [dbo].[PRODUCT_REVIEWS] where [PRODUCT_REVIEWS_PRODUCT_FKID] = pt.PRODUCT_PKID) as 'REVIEW_COUNT',isnull((select AVG(CAST([PRODUCT_REVIEWS_STAR_RATINGS] as int)) FROM [PRODUCT_REVIEWS] WHERE [PRODUCT_REVIEWS_PRODUCT_FKID] = pt.PRODUCT_PKID), 0) as 'RATINGS_AVERAGE' from [dbo].[PRODUCTS] AS pt"
      // );
      .input("categoryID", CategoryID)
      .execute("AllProductsWithRatingsByCat");

    var kimo = result.recordsets[0];

    for (let i = 0; i < kimo.length; i++) {
      var res2 = await pool
        .request()
        .input("PRODUCT_UNIT_PRODUCT_FKID", kimo[i].PRODUCT_PKID)
        .query(
          "select min(PRODUCT_UNIT_SELLING_PRICE) as minprice, max(PRODUCT_UNIT_SELLING_PRICE) as maxprice,min(PRODUCT_UNIT_GENERAL_DISCOUNT) as mindis, max(PRODUCT_UNIT_GENERAL_DISCOUNT) as maxdis,min(PRODUCT_UNIT_ACTUAL_PRICE) as minaprice, max(PRODUCT_UNIT_ACTUAL_PRICE) as maxaprice  from PRODUCT_UNIT where PRODUCT_UNIT_PRODUCT_FKID = @PRODUCT_UNIT_PRODUCT_FKID"
        );

      var res3 = await pool
        .request()
        .input("PRODUCT_PKID", kimo[i].PRODUCT_PKID)
        .query(
          "select [PRODUCT_CATEGORY_NAME] from [dbo].[PRODUCT_CATEGORY] join [dbo].[PRODUCTS] on [PRODUCT_CAT_FKID] = [PRODUCT_CATEGORY_PKID] where [PRODUCT_PKID] = @PRODUCT_PKID"
        );
      Obj = {
        pkid: kimo[i].PRODUCT_PKID,
        slug: kimo[i].PRODUCT_NAME,
        name: kimo[i].PRODUCT_NAME,
        desc: kimo[i].PRODUCT_NAME,
        price:
          res2.recordsets[0][0].minprice === res2.recordsets[0][0].maxprice
            ? res2.recordsets[0][0].minprice
            : res2.recordsets[0][0].minprice +
              " - ₹" +
              res2.recordsets[0][0].maxprice,
        Actualprice:
          res2.recordsets[0][0].minaprice === res2.recordsets[0][0].maxaprice
            ? res2.recordsets[0][0].minaprice
            : res2.recordsets[0][0].minaprice +
              " - " +
              res2.recordsets[0][0].maxaprice,
        description: kimo[i].PRODUCT_DEFINITION,
        images: [
          kimo[i].PRODUCT_IMAGE_1,
          kimo[i].PRODUCT_IMAGE_2,
          kimo[i].PRODUCT_IMAGE_3,
        ],
        badges:
          res2.recordsets[0][0].mindis === res2.recordsets[0][0].maxdis
            ? res2.recordsets[0][0].mindis + "% off"
            : res2.recordsets[0][0].mindis +
              "%" +
              " - " +
              res2.recordsets[0][0].maxdis +
              "% off",
        rating: kimo[i].RATINGS_AVERAGE,
        reviews: kimo[i].REVIEW_COUNT,
        availability: "in-stock",
        brand: "AAProbics",
        categories: [res3.recordsets[0][0].PRODUCT_CATEGORY_NAME],
        specification: [
          {
            name: "Product Information",
            features: [
              { name: "Active Ingredients", value: "Vitamin D3" },
              { name: "Each Gummy Contains", value: "850IU" },
              { name: "Serving Size", value: "Adults : 1 gummy/day" },
              { name: "Available Flavours", value: "Berry" },
              { name: "Available Shapes", value: "Gum Drop and Coin Shape" },
            ],
          },
          {
            name: "Product Benefits",
            features: [{ name: kimo[i].PRODUCT_BENEFITS, value: "" }],
          },
        ],
      };
      kimoArray.push(Obj);
    }
    return kimoArray;
  } catch (error) {
    console.log("getProductsByCompany-->", error);
  }
}

async function ProductSearch(searchData) {
  var kimoArray = [];
  var Obj = {};
  var pool = await sql.connect(config);
  try {
    var result = await pool
      .request()
      .query(
        "SELECT * FROM PRODUCTS where [PRODUCT_NAME] like '%" +
          searchData +
          "%'"
      );

    var kimo = result.recordsets[0];

    for (let i = 0; i < kimo.length; i++) {
      var res2 = await pool
        .request()
        .input("PRODUCT_UNIT_PRODUCT_FKID", kimo[i].PRODUCT_PKID)
        .query(
          "  select min(PRODUCT_UNIT_ACTUAL_PRICE) as minprice, max(PRODUCT_UNIT_ACTUAL_PRICE) as maxprice from PRODUCT_UNIT where PRODUCT_UNIT_PRODUCT_FKID = @PRODUCT_UNIT_PRODUCT_FKID"
        );

      var res3 = await pool
        .request()
        .input("PRODUCT_PKID", kimo[i].PRODUCT_PKID)
        .query(
          "select [PRODUCT_CATEGORY_NAME] from [dbo].[PRODUCT_CATEGORY] join [dbo].[PRODUCTS] on [PRODUCT_CAT_FKID] = [PRODUCT_CATEGORY_PKID] where [PRODUCT_PKID] = @PRODUCT_PKID"
        );
      Obj = {
        pkid: kimo[i].PRODUCT_PKID,
        slug: kimo[i].PRODUCT_NAME,
        name: kimo[i].PRODUCT_NAME,
        desc: kimo[i].PRODUCT_NAME,
        price:
          res2.recordsets[0][0].minprice +
          " - " +
          res2.recordsets[0][0].maxprice,
        description: kimo[i].PRODUCT_DEFINITION,
        images: [
          kimo[i].PRODUCT_IMAGE_1,
          kimo[i].PRODUCT_IMAGE_2,
          kimo[i].PRODUCT_IMAGE_3,
        ],
        badges: "new",
        rating: 0,
        reviews: 0,
        availability: "in-stock",
        brand: "AAProbics",
        categories: [res3.recordsets[0][0].PRODUCT_CATEGORY_NAME],
        specification: [
          {
            name: "Product Information",
            features: [
              { name: "Active Ingredients", value: "Vitamin D3" },
              { name: "Each Gummy Contains", value: "850IU" },
              { name: "Serving Size", value: "Adults : 1 gummy/day" },
              { name: "Available Flavours", value: "Berry" },
              { name: "Available Shapes", value: "Gum Drop and Coin Shape" },
            ],
          },
          {
            name: "Product Benefits",
            features: [{ name: kimo[i].PRODUCT_BENEFITS, value: "" }],
          },
        ],
      };
      kimoArray.push(Obj);
    }
    return kimoArray;
  } catch (error) {
    console.log("ProductSearch-->", error);
  }
}

async function GetProductDetailsByID(ProductID) {
  var kimoArray = [];
  var Obj = {};
  var pool = await sql.connect(config);
  try {
    var result = await pool
      .request()
      .input("PRODUCT_PKID", ProductID)
      .query(
        "select *, (select count(distinct[PRODUCT_REVIEWS_COMMENTS]) from [dbo].[PRODUCT_REVIEWS] where [PRODUCT_REVIEWS_PRODUCT_FKID] = pt.PRODUCT_PKID) as 'REVIEW_COUNT',isnull((select AVG(CAST([PRODUCT_REVIEWS_STAR_RATINGS] as int)) FROM [PRODUCT_REVIEWS] WHERE [PRODUCT_REVIEWS_PRODUCT_FKID] = pt.PRODUCT_PKID), 0) as 'RATINGS_AVERAGE' from [dbo].[PRODUCTS] AS pt where pt.PRODUCT_PKID = @PRODUCT_PKID"
      );

    var kimo = result.recordsets[0];

    for (let i = 0; i < kimo.length; i++) {
      var res2 = await pool
        .request()
        .input("PRODUCT_UNIT_PRODUCT_FKID", kimo[i].PRODUCT_PKID)
        .query(
          "  select min(PRODUCT_UNIT_ACTUAL_PRICE) as minprice, max(PRODUCT_UNIT_ACTUAL_PRICE) as maxprice from PRODUCT_UNIT where PRODUCT_UNIT_PRODUCT_FKID = @PRODUCT_UNIT_PRODUCT_FKID"
        );

      var res3 = await pool
        .request()
        .input("PRODUCT_PKID", kimo[i].PRODUCT_PKID)
        .query(
          "select [PRODUCT_CATEGORY_NAME] from [dbo].[PRODUCT_CATEGORY] join [dbo].[PRODUCTS] on [PRODUCT_CAT_FKID] = [PRODUCT_CATEGORY_PKID] where [PRODUCT_PKID] = @PRODUCT_PKID"
        );
      Obj = {
        pkid: kimo[i].PRODUCT_PKID,
        slug: kimo[i].PRODUCT_NAME,
        name: kimo[i].PRODUCT_NAME,
        desc: kimo[i].PRODUCT_NAME,
        price:
          res2.recordsets[0][0].minprice +
          " - " +
          res2.recordsets[0][0].maxprice,
        description: kimo[i].PRODUCT_DEFINITION,
        images: [
          kimo[i].PRODUCT_IMAGE_1,
          kimo[i].PRODUCT_IMAGE_2,
          kimo[i].PRODUCT_IMAGE_3,
        ],
        badges: "new",
        rating: kimo[i].RATINGS_AVERAGE,
        reviews: kimo[i].REVIEW_COUNT,
        availability: "in-stock",
        brand: "AAProbics",
        categories: [res3.recordsets[0][0].PRODUCT_CATEGORY_NAME],
        specification: [
          {
            name: "Product Information",
            features: [{ name: kimo[i].PRODUCT_INFO, value: "" }],
            // features: [
            //   { name: "Active Ingredients", value: "Vitamin D####" },
            //   { name: "Each Gummy Contains", value: "850IU" },
            //   { name: "Serving Size", value: "Adults : 1 gummy/day" },
            //   { name: "Available Flavours", value: "Berry" },
            //   { name: "Available Shapes", value: "Gum Drop and Coin Shape" },
            // ],
          },
          {
            name: "Product Benefits",
            features: [{ name: kimo[i].PRODUCT_BENEFITS, value: "" }],
          },
        ],
      };
      kimoArray.push(Obj);
    }
    return kimoArray;
  } catch (error) {
    console.log("GetProductDetailsByID-->", error);
  }
}

async function addProduct(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("PRODUCT_NAME", sql.VarChar, obj.PRODUCT_NAME)
      .query("SELECT * from PRODUCTS WHERE PRODUCT_NAME=@PRODUCT_NAME");
    if (result.rowsAffected[0] == 0) {
      var insertInto = await pool
        .request()
        .input("PRODUCT_CAT_FKID", sql.VarChar, obj.PRODUCT_CAT_FKID)
        .input("PRODUCT_SUB_CAT_FKID", sql.VarChar, obj.PRODUCT_SUB_CAT_FKID)
        .input("PRODUCT_NAME", sql.VarChar, obj.PRODUCT_NAME)
        .input("PRODUCT_BENEFITS", sql.VarChar, obj.PRODUCT_BENEFITS)
        .input(
          "PRODUCT_ACTIVE_INGREDIENTS",
          sql.VarChar,
          obj.PRODUCT_ACTIVE_INGREDIENTS
        )
        .input("PRODUCT_INFO", sql.VarChar, obj.PRODUCT_INFO)
        .input("PRODUCT_DEFINITION", sql.VarChar, obj.PRODUCT_DEFINITION)
        .input("PRODUCT_USE", sql.VarChar, obj.PRODUCT_USE)
        .input("PRODUCT_IMAGE_1", sql.VarChar, obj.PRODUCT_IMAGE_1)
        .input("PRODUCT_IMAGE_2", sql.VarChar, obj.PRODUCT_IMAGE_2)
        .input("PRODUCT_IMAGE_3", sql.VarChar, obj.PRODUCT_IMAGE_3)
        .query(
          "insert into PRODUCTS ([PRODUCT_CAT_FKID], [PRODUCT_SUB_CAT_FKID],PRODUCT_NAME,PRODUCT_BENEFITS,PRODUCT_ACTIVE_INGREDIENTS,PRODUCT_INFO,PRODUCT_DEFINITION,PRODUCT_USE,PRODUCT_IMAGE_1,PRODUCT_IMAGE_2,PRODUCT_IMAGE_3,PRODUCT_ACTIVE,PRODUCT_DATE)  values(@PRODUCT_CAT_FKID, @PRODUCT_SUB_CAT_FKID,@PRODUCT_NAME,@PRODUCT_BENEFITS,@PRODUCT_ACTIVE_INGREDIENTS,@PRODUCT_INFO,@PRODUCT_DEFINITION,@PRODUCT_USE,@PRODUCT_IMAGE_1,@PRODUCT_IMAGE_2,@PRODUCT_IMAGE_3,1,GETDATE())"
        );
      if (pool._connected == false) {
        pool = await sql.connect(config);
      }
      if (insertInto.rowsAffected == 1) {
        var ProductSelect = await pool
          .request()
          .query(
            "SELECT PRODUCT_NAME,PRODUCT_PKID  from PRODUCTS where PRODUCT_PKID = (SELECT max(PRODUCT_PKID) from PRODUCTS)"
          );
        if (ProductSelect.rowsAffected[0] == 1) {
          QRCode.toFile(
            path.join(
              __dirname,
              "../resources/static/assets/uploads",
              "" + ProductSelect.recordsets[0][0].PRODUCT_NAME + ".png"
            ),
            `https://aaprobics.com/shop/products/${ProductSelect.recordsets[0][0].PRODUCT_PKID}`,
            (err) => {
              if (err) throw err;
            }
          );
          var qrinsert = await pool
            .request()
            .input(
              "PRODUCT_QR_PRODUCT_FKID",
              ProductSelect.recordsets[0][0].PRODUCT_PKID
            )
            .input(
              "PRODUCT_QR_FILE",
              `${ProductSelect.recordsets[0][0].PRODUCT_NAME}.png`
            )
            .query(
              "insert into PRODUCT_QR ([PRODUCT_QR_PRODUCT_FKID], [PRODUCT_QR_FILE])  values(@PRODUCT_QR_PRODUCT_FKID, @PRODUCT_QR_FILE)"
            );
          if (qrinsert.rowsAffected == 1) {
            return "1";
          } else {
            return "2";
          }
        }
      } else {
        return "2";
      }
    } else {
      return "0";
    }
  } catch (err) {
    console.log("addProduct-->", err);
  }
}

async function deleteProduct(ProductID) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("PRODUCT_PKID", ProductID)
      .query("DELETE FROM PRODUCTS WHERE PRODUCT_PKID=@PRODUCT_PKID");
    console.log(result.rowsAffected[0] == 1);
    console.log(result.rowsAffected == 1);
    if (result.rowsAffected[0] == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("deleteProduct-->", error);
    //
  }
}

async function updateProduct(ProductID, obj) {
  try {
    console.log(obj);
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .input("PRODUCT_PKID", ProductID)
      .input("PRODUCT_CAT_FKID", obj.PRODUCT_CAT_FKID)
      .input("PRODUCT_SUB_CAT_FKID", obj.PRODUCT_SUB_CAT_FKID)
      .input("PRODUCT_NAME", sql.VarChar, obj.PRODUCT_NAME)
      .input("PRODUCT_BENEFITS", sql.VarChar, obj.PRODUCT_BENEFITS)
      .input(
        "PRODUCT_ACTIVE_INGREDIENTS",
        sql.VarChar,
        obj.PRODUCT_ACTIVE_INGREDIENTS
      )
      .input("PRODUCT_INFO", sql.VarChar, obj.PRODUCT_INFO)
      .input("PRODUCT_DEFINITION", sql.VarChar, obj.PRODUCT_DEFINITION)
      .input("PRODUCT_USE", sql.VarChar, obj.PRODUCT_USE)
      .input("PRODUCT_IMAGE_1", sql.VarChar, obj.PRODUCT_IMAGE_1)
      .input("PRODUCT_IMAGE_2", sql.VarChar, obj.PRODUCT_IMAGE_2)
      .input("PRODUCT_IMAGE_3", sql.VarChar, obj.PRODUCT_IMAGE_3)
      .query(
        "update PRODUCTS set [PRODUCT_CAT_FKID] = @PRODUCT_CAT_FKID, [PRODUCT_SUB_CAT_FKID] = @PRODUCT_SUB_CAT_FKID,PRODUCT_NAME = @PRODUCT_NAME,PRODUCT_BENEFITS = @PRODUCT_BENEFITS,PRODUCT_ACTIVE_INGREDIENTS = @PRODUCT_ACTIVE_INGREDIENTS,PRODUCT_INFO = @PRODUCT_INFO,PRODUCT_DEFINITION = @PRODUCT_DEFINITION,PRODUCT_USE = @PRODUCT_USE,PRODUCT_IMAGE_1 = @PRODUCT_IMAGE_1,PRODUCT_IMAGE_2 = @PRODUCT_IMAGE_2,PRODUCT_IMAGE_3 = @PRODUCT_IMAGE_3 where PRODUCT_PKID = @PRODUCT_PKID"
      );

    var message = false;

    if (result.rowsAffected) {
      var ProductSelect = await pool
        .request()
        .query(
          "SELECT PRODUCT_NAME,PRODUCT_PKID  from PRODUCTS where PRODUCT_PKID = " +
            ProductID +
            ""
        );
      if (ProductSelect.rowsAffected[0] == 1) {
        QRCode.toFile(
          path.join(
            __dirname,
            "../resources/static/assets/uploads",
            `${ProductSelect.recordsets[0][0].PRODUCT_NAME}.png`
          ),
          `https://aaprobics.com/shop/products/${ProductSelect.recordsets[0][0].PRODUCT_PKID}`,
          (err) => {
            if (err) throw err;
          }
        );
        var CheckQR = await pool
          .request()
          .query(
            "SELECT * from PRODUCT_QR where PRODUCT_QR_PRODUCT_FKID = " +
              ProductID +
              ""
          );
        if (CheckQR.rowsAffected[0] == 0) {
          var qrinsert = await pool
            .request()
            .input(
              "PRODUCT_QR_PRODUCT_FKID",
              ProductSelect.recordsets[0][0].PRODUCT_PKID
            )
            .input(
              "PRODUCT_QR_FILE",
              `${ProductSelect.recordsets[0][0].PRODUCT_NAME}.png`
            )
            .query(
              "insert into PRODUCT_QR ([PRODUCT_QR_PRODUCT_FKID], [PRODUCT_QR_FILE])  values(@PRODUCT_QR_PRODUCT_FKID, @PRODUCT_QR_FILE)"
            );
          if (qrinsert.rowsAffected == 1) {
            message = true;
          } else {
            message = false;
          }
        } else {
          message = true;
        }
      }
    }
    return message;
  } catch (error) {
    console.log("updateProduct-->", error);
  }
}

async function getAllProductReviews() {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "select [PRODUCT_PKID],[PRODUCT_REVIEWS_PKID], [REGISTERED_USERS_NAME], [REGISTERED_USERS_EMAIL], [REGISTERED_USERS_PHONE],[PRODUCT_NAME], [PRODUCT_CATEGORY_NAME], [PRODUCT_SUB_CATEGORY_NAME], [PRODUCT_REVIEWS_STAR_RATINGS], [PRODUCT_REVIEWS_COMMENTS], PRODUCT_REVIEWS_DATE, PRODUCT_REVIEWS_ACTIVE from [dbo].[PRODUCT_REVIEWS] join [dbo].[PRODUCTS] on [PRODUCT_PKID] = [PRODUCT_REVIEWS_PRODUCT_FKID] join [dbo].[PRODUCT_CATEGORY] on [PRODUCT_CATEGORY_PKID] = [PRODUCT_CAT_FKID] join [dbo].[PRODUCT_SUB_CATEGORY] on [PRODUCT_SUB_CATEGORY_PKID] = [PRODUCT_SUB_CAT_FKID] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [PRODUCT_REVIEWS_USER_FKID]"
      );
    console.log(result.recordsets[0]);
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllProductReviews-->", error);
    //
  }
}

async function ActivateReview(ReviewID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "update PRODUCT_REVIEWS set PRODUCT_REVIEWS_ACTIVE = 1 where PRODUCT_REVIEWS_PKID = " +
          ReviewID +
          ""
      );
    if (result.rowsAffected == 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("ActivateReview-->", error);
    //
  }
}

async function DeActivateReview(ReviewID) {
  try {
    var pool = await sql.connect(config);
    var result = await pool
      .request()
      .query(
        "update PRODUCT_REVIEWS set PRODUCT_REVIEWS_ACTIVE = 0 where PRODUCT_REVIEWS_PKID = " +
          ReviewID +
          ""
      );
    if (result.rowsAffected == 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("DeActivateReview-->", error);
    //
  }
}

module.exports = {
  getAllProduct: getAllProduct,
  getAllProducts: getAllProducts,
  ProductsByCat: ProductsByCat,
  ProductSearch: ProductSearch,
  GetProductDetailsByID: GetProductDetailsByID,
  addProduct: addProduct,
  deleteProduct: deleteProduct,
  updateProduct: updateProduct,
  getAllProductReviews: getAllProductReviews,
  ActivateReview: ActivateReview,
  DeActivateReview: DeActivateReview,
  ProductQR: ProductQR,
};
