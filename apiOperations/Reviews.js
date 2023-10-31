



var config = require("../dbconfig");
const sql = require("mssql");

async function getProductList(OrderID, CustomerID) {
    try {
        var pool = await sql.connect(config);
        var result = await pool
            .request()
            .input("OrderID", OrderID)
            .input("CustomerID", CustomerID)
            .query(
                "SELECT DISTINCT [PRODUCT_PKID], [PRODUCT_NAME] FROM [dbo].[ORDER_ITEMS] t1 JOIN [dbo].[PRODUCTS] ON [PRODUCT_PKID] = [ORDER_ITEM_PRODUCT_FKID] join [dbo].[ORDERS] on [ORDER_ITEM_ORDER_FKID] = [ORDERS_PKID] WHERE [ORDER_ITEM_ORDER_FKID] = @OrderID and [ORDERS_CUSTOMER_FKID] = @CustomerID AND NOT EXISTS (SELECT [PRODUCT_REVIEWS_PRODUCT_FKID] FROM [dbo].[PRODUCT_REVIEWS] t2 WHERE t1.[ORDER_ITEM_PRODUCT_FKID] = t2.[PRODUCT_REVIEWS_PRODUCT_FKID] and PRODUCT_REVIEWS_USER_FKID = @CustomerID)");
        return result.recordsets[0];
    } catch (error) {
        console.log("getProductList-->", error);
        //
    }
}


async function addUserReviews(obj) {
    try {
        console.log(obj);
        var pool = await sql.connect(config);
        if (pool._connected == false) {
            pool = await sql.connect(config);
        }

        var insertInto = await pool
            .request()
            .input("PRODUCT_REVIEWS_USER_FKID", obj.PRODUCT_REVIEWS_USER_FKID)
            .input("PRODUCT_REVIEWS_PRODUCT_FKID", obj.PRODUCT_REVIEWS_PRODUCT_FKID)
            .input("PRODUCT_REVIEWS_STAR_RATINGS", obj.PRODUCT_REVIEWS_STAR_RATINGS)
            .input("PRODUCT_REVIEWS_COMMENTS", obj.PRODUCT_REVIEWS_COMMENTS)
            .query(
                "insert into PRODUCT_REVIEWS ([PRODUCT_REVIEWS_USER_FKID],[PRODUCT_REVIEWS_PRODUCT_FKID],[PRODUCT_REVIEWS_STAR_RATINGS],[PRODUCT_REVIEWS_COMMENTS],[PRODUCT_REVIEWS_DATE]) values(@PRODUCT_REVIEWS_USER_FKID,@PRODUCT_REVIEWS_PRODUCT_FKID,@PRODUCT_REVIEWS_STAR_RATINGS,@PRODUCT_REVIEWS_COMMENTS,GETDATE())"
            );
        if (pool._connected == false) {
            pool = await sql.connect(config);
        }
        if (insertInto.rowsAffected == 1) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log("addUserReviews-->", err);
    }
}


async function getUserReviews(UserID) {
    try {
        var pool = await sql.connect(config);
        var result = await pool
            .request()
            .input("UserID", UserID)
            .query("select [PRODUCT_REVIEWS_STAR_RATINGS],[PRODUCT_REVIEWS_COMMENTS], [PRODUCT_NAME] ,[PRODUCT_REVIEWS_DATE] FROM [dbo].[PRODUCT_REVIEWS] join [dbo].[PRODUCTS] on [PRODUCT_PKID] = [PRODUCT_REVIEWS_PRODUCT_FKID] where  [PRODUCT_REVIEWS_USER_FKID] = @UserID");
        return result.recordsets[0];
    } catch (error) {
        console.log("getUserReviews-->", error);
        //
    }
}

async function getUserReviewsById(ProductID) {
    try {
        var pool = await sql.connect(config);
        var result = await pool
            .request()
            .input("PRODUCT_REVIEWS_PRODUCT_FKID", ProductID)
            .query("select [REGISTERED_USERS_PROFILE],[PRODUCT_REVIEWS_STAR_RATINGS],[PRODUCT_REVIEWS_COMMENTS],[PRODUCT_REVIEWS_DATE],[REGISTERED_USERS_NAME] from [dbo].[PRODUCT_REVIEWS] join [dbo].[REGISTERED_USERS] on [REGISTERED_USERS_PKID] = [PRODUCT_REVIEWS_USER_FKID] where [PRODUCT_REVIEWS_PRODUCT_FKID] = @PRODUCT_REVIEWS_PRODUCT_FKID and PRODUCT_REVIEWS_ACTIVE = 1");
        return result.recordsets[0];
    } catch (error) {
        console.log("getUserReviewsById-->", error);
        //
    }
}


module.exports = {
    getProductList: getProductList,
    addUserReviews: addUserReviews,
    getUserReviews: getUserReviews,
    getUserReviewsById: getUserReviewsById,
};