/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-07 18:02:44
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-08-18 15:28:27
 */
"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const nocache = require("nocache");

var app = express();
// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

var router = express.Router();
// using bodyParser to parse JSON bodies into JS objects
router.use(bodyParser.json());

// -------Operations Files ----------
var AdmDb = require("./apiOperations/AdminLogin");
var Dashboard = require("./apiOperations/Dashboard_alt");
var Country = require("./apiOperations/Country");
var State = require("./apiOperations/State");
var City = require("./apiOperations/City");
var Area = require("./apiOperations/Area");
var AboutUs = require("./apiOperations/AboutUs");
var ContactUs = require("./apiOperations/ContactUs");
var ProductCategory = require("./apiOperations/ProductCategory");
var ProductSubCategory = require("./apiOperations/ProductSubCategory");
var Product = require("./apiOperations/Product");
var ProductUnit = require("./apiOperations/ProductUnit");
var ProductStock = require("./apiOperations/ProductStock");
var ContactEnquiry = require("./apiOperations/ContactEnquiry");
var Member = require("./apiOperations/Members");
var MemberCoupons = require("./apiOperations/MemberCoupon");
var Coupons = require("./apiOperations/Coupons");
var Career = require("./apiOperations/Career");
var Award = require("./apiOperations/Award");
var ScienceType = require("./apiOperations/ScienceType");
var ManageScienceType = require("./apiOperations/ManageScienceType");
var RegisteredUsers = require("./apiOperations/RegisteredUsers");
var UserAddress = require("./apiOperations/UserAddress");
var NewsLetter = require("./apiOperations/NewsLetter");
var OrderManagement = require("./apiOperations/OrderManagement");
var Reviews = require("./apiOperations/Reviews");
var Reports = require("./apiOperations/Reports");
const mailDb = require("./apiOperations/NodeMailer/server");
var ProductStockHistory = require("./apiOperations/ProductStockHistory");
const GetGeneralDiscount = require("./apiOperations/GetGeneralDiscount");
var Discount = require("./apiOperations/Discount");
var Announce = require("./apiOperations/Announce");

// ----------------Zeus Routes for APP--------------------------------------

// ----------------Building a Secure Node js REST API---------------------//
app.use(express.static(__dirname + "/resources/static/assets/uploads"));
app.use(express.static("public"));
app.use(express.static("/resources/static/assets/uploads"));
app.get("/*", function (req, res, next) {
  res.setHeader("Last-Modified", new Date().toUTCString());
  next();
});

// // adding Helmet to enhance your Rest API's security
app.use(helmet());
// adding morgan to log HTTP requests
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// ----CORS Configuration----

app.use(cors());

// app.options("*", cors());

app.use(cors({ origin: true, credentials: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  next();
});

// ----CORS Configuration---

app.use(nocache());

// Modify the setHeaders function so it looks like this:{
app.use(
  express.static("public", {
    etag: true, // Just being explicit about the default.
    lastModified: true, // Just being explicit about the default.
    setHeaders: (res, path) => {
      const hashRegExp = new RegExp("\\.[0-9a-f]{8}\\.");

      if (path.endsWith(".html")) {
        // All of the project's HTML files end in .html
        res.setHeader("Cache-Control", "no-cache");
      } else if (hashRegExp.test(path)) {
        // If the RegExp matched, then we have a versioned URL.
        res.setHeader("Cache-Control", "max-age=31536000");
      }
    },
  })
);
app.use("/api", router);

//--------- Setting cache control middleware in Express{
let setCache = function (req, res, next) {
  // here you can define period in second, this one is 5 minutes
  const period = 60 * 5;

  // you only want to cache for GET requests
  if (req.method == "GET") {
    res.set("Cache-control", `public, max-age=${period}`);
  } else {
    // for the other requests set strict no caching parameters
    res.set("Cache-control", `no-store`);
  }

  // remember to call next() to pass on the request
  next();
};

// now call the new middleware function in your app

app.use(setCache);
router.use(setCache);
//--------- Setting cache control middleware in Express}

// file Upload -----------------------
global.__basedir = __dirname;

const initRoutes = require("./src/routes");
const { Router } = require("express/lib/express");
// const Zone = require("./apiOperations/Zone");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
initRoutes(app);
// file Upload --------------------------------

// // ----------------Building a Secure Node js REST API---------------------//

app.set("etag", false);

app.get("/*", function (req, res, next) {
  res.setHeader("Last-Modified", new Date().toUTCString());
  next();
});

app.get("/", (req, res) => {
  var responseText = `<h1 style="font-family: 'Lobster', cursive;
    font-size: 4em;
    text-align: center;
    margin: 10px;
    text-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);">🤠 Restful APIs Using Nodejs is Started ✌️ </h1>`;
  res.send(responseText);
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

router.use((req, res, next) => {
  var time = new Date();
  console.log(
    "---------------------------->  RECENT REQUEST TRIGGERED AT <------------------------ : ",
    time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      second: "numeric",
    })
  );
  next();
});

// -----------Login Api's--------------- //

router.get("/AdminLogin/:email/:password", async (req, res) => {
  res.json(await AdmDb.getAdminLogin(req.params.email, req.params.password));
});

router.get("/ChangePassword/:email/:password", async (req, res) => {
  res.json(
    await AdmDb.UpdateAdminPassword(req.params.email, req.params.password)
  );
});

// -----------Admin Dashboard--------------- //

router.get("/Dashboard_Top_Cards", async (req, res) => {
  res.json(await Dashboard.GetTopThreeCardsDetails());
});

router.get("/Dashboard_Right_Cards", async (req, res) => {
  res.json(await Dashboard.GetRightCardData());
});

router.get("/Dashboard_Graph", async (req, res) => {
  res.json(await Dashboard.GetDashboardGraph());
});

// -----------------------Country----------------
router.get("/Country", async (req, res) => {
  await Country.getAllCountry().then((data) => {
    res.json(data);
  });
});

router.route("/Country/:id").get(async (req, res, next) => {
  try {
    await Country.getCountryByID(req.params.id).then((data) => {
      res.json(data);
    });
  } catch (err) {
    console.log("Error is getCountryByID", err);
    next(err);
  }
});

router.route("/Country").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await Country.addCountry(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/Country/:id").delete(async (req, res) => {
  await Country.deleteCountry(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/Country/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await Country.updateCountry(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

// -----------------------State----------------
router.get("/State", async (req, res) => {
  await State.getAllState().then((data) => {
    res.json(data);
  });
});

router.route("/State/:id").get(async (req, res, next) => {
  try {
    await State.getStateByID(req.params.id).then((data) => {
      res.json(data);
    });
  } catch (err) {
    console.log("Error is getStateByID", err);
    next(err);
  }
});

router.route("/StateByCountry/:id").get(async (req, res, next) => {
  try {
    await State.getStateByCountryID(req.params.id).then((data) => {
      res.json(data);
    });
  } catch (err) {
    console.log("Error is getStateByCountryID", err);
    next(err);
  }
});

router.route("/State").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await State.addState(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/State/:id").delete(async (req, res) => {
  await State.deleteState(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/State/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await State.updateState(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

// -----------------------City----------------
router.get("/City", async (req, res) => {
  await City.getAllCity().then((data) => {
    res.json(data);
  });
});

router.route("/City/:id").get(async (req, res, next) => {
  try {
    await City.getCityByID(req.params.id).then((data) => {
      res.json(data);
    });
  } catch (err) {
    console.log("Error is getCityByID", err);
    next(err);
  }
});

router.route("/CityByState/:id").get(async (req, res, next) => {
  try {
    await City.getCityByStateID(req.params.id).then((data) => {
      res.json(data);
    });
  } catch (err) {
    console.log("Error is getCityByStateID", err);
    next(err);
  }
});

router.route("/PincodeByCity/:id").get(async (req, res, next) => {
  try {
    await City.getPincodeByCity(req.params.id).then((data) => {
      res.json(data);
    });
  } catch (err) {
    console.log("Error is PincodeByCity", err);
    next(err);
  }
});

router.route("/City").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await City.addCity(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/City/:id").delete(async (req, res) => {
  await City.deleteCity(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/City/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await City.updateCity(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

// -----------------------Area----------------

router.route("/Area").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await Area.addArea(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.get("/Area", async (req, res) => {
  await Area.getAllArea().then((data) => {
    res.json(data);
  });
});

router.get("/AreaByCityID/:CityID", async (req, res) => {
  await Area.GetAllAreaByCity(req.params.CityID).then((data) => {
    res.json(data);
  });
});

router.get("/GetCompleteLocationByPincode/:Pincode", async (req, res) => {
  await Area.GetCompleteLocationByPincode(req.params.Pincode).then((data) => {
    res.json(data);
  });
});

router.route("/Area/:id").delete(async (req, res) => {
  await Area.deleteArea(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/Area/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await Area.updateArea(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

// -----------------------About----------------
router.get("/About", async (req, res) => {
  await AboutUs.getAllAboutUs().then((data) => {
    res.json(data);
  });
});

router.route("/About").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await AboutUs.addAboutUs(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/About/:id").delete(async (req, res) => {
  await AboutUs.deleteAboutUs(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/About/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await AboutUs.updateAboutUs(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

// -----------------------Contact Us----------------
router.get("/ContactUs", async (req, res) => {
  await ContactUs.getAllContactUs().then((data) => {
    res.json(data);
  });
});

router.route("/ContactUs").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await ContactUs.addContactUs(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/ContactUs/:id").delete(async (req, res) => {
  await ContactUs.deleteContactUs(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/ContactUs/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await ContactUs.updateContactUs(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

// -----------------------Product Category----------------
router.get("/ProductCategory", async (req, res) => {
  await ProductCategory.getAllProductCategory().then((data) => {
    res.json(data);
  });
});

router.get("/getAllCategoryAndSubCategory", async (req, res) => {
  await ProductCategory.getAllCategoryAndSubCategory().then((data) => {
    res.json(data);
  });
});

router.route("/ProductCategory").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await ProductCategory.addProductCategory(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/ProductCategory/:id").delete(async (req, res) => {
  await ProductCategory.deleteProductCategory(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/ProductCategory/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await ProductCategory.updateProductCategory(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

// -----------------------Product Sub Category----------------
router.get("/ProductSubCategory", async (req, res) => {
  await ProductSubCategory.getAllProductSubCategory().then((data) => {
    res.json(data);
  });
});

router.route("/SubCategoryByCategory/:id").get(async (req, res) => {
  await ProductSubCategory.getSubCategoryByCategory(req.params.id).then(
    (data) => {
      res.json(data);
    }
  );
});

router.route("/ProductSubCategory").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await ProductSubCategory.addProductSubCategory(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/ProductSubCategory/:id").delete(async (req, res) => {
  await ProductSubCategory.deleteProductSubCategory(req.params.id).then(
    (data) => {
      res.json(data);
    }
  );
});

router.put("/ProductSubCategory/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(
      await ProductSubCategory.updateProductSubCategory(req.params.id, obj)
    );
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

// -----------------------Product----------------
router.get("/Product", async (req, res) => {
  await Product.getAllProduct().then((data) => {
    res.json(data);
  });
});

router.get("/ProductQR", async (req, res) => {
  await Product.ProductQR().then((data) => {
    res.json(data);
  });
});

router.get("/Products", async (req, res) => {
  await Product.getAllProducts().then((data) => {
    res.json(data);
  });
});

router.get("/ProductsByCat/:id", async (req, res) => {
  await Product.ProductsByCat(req.params.id).then((data) => {
    res.json(data);
  });
});

router.get("/ProductSearch/:data", async (req, res) => {
  await Product.ProductSearch(req.params.data).then((data) => {
    res.json(data);
  });
});

router.get("/Products/:id", async (req, res) => {
  await Product.GetProductDetailsByID(req.params.id).then((data) => {
    res.json(data);
  });
});

router.route("/Product").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await Product.addProduct(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/Product/:id").delete(async (req, res) => {
  await Product.deleteProduct(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/Product/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await Product.updateProduct(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

router.get("/SendMailForSubscribers", async (req, res) => {
  await mailDb.SendMailForSubscribers().then((data) => {
    res.json(data);
  });
});

// -----------------------Product Units----------------
router.get("/ProductUnit", async (req, res) => {
  await ProductUnit.getAllProductUnits().then((data) => {
    res.json(data);
  });
});

router.get("/ProductUnit/:id", async (req, res) => {
  await ProductUnit.getAllProductUnitsByProductID(req.params.id).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get("/ProductUnitDetails/:id", async (req, res) => {
  await ProductUnit.getAllProductUnitsByUnitID(req.params.id).then((data) => {
    res.json(data);
  });
});

router.route("/ProductUnit").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await ProductUnit.addProductUnits(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/ProductUnit/:id").delete(async (req, res) => {
  await ProductUnit.deleteProductUnit(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/ProductUnit/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await ProductUnit.updateProductUnit(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

// -----------------------Product Stock----------------
router.get("/ProductStock", async (req, res) => {
  await ProductStock.getAllProductStock().then((data) => {
    res.json(data);
  });
});

router.get("/UnitsByProduct/:id", async (req, res) => {
  await ProductStock.getProductUnitsByProduct(req.params.id).then((data) => {
    res.json(data);
  });
});

router.route("/ProductStock").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await ProductStock.addProductStock(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/ProductStock/:id").delete(async (req, res) => {
  await ProductStock.deleteProductStock(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/ProductStock/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await ProductStock.updateProductStock(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

router.get("/ProductStockManagement", async (req, res) => {
  await ProductStock.ProductStockManagement().then((data) => {
    res.json(data);
  });
});

router.get("/ProductStockManagementFilter/:Year/:Month", async (req, res) => {
  await ProductStock.ProductStockManagementFilter(
    req.params.Year,
    req.params.Month
  ).then((data) => {
    res.json(data);
  });
});

// -----------------------Contact Enquiry----------------
router.get("/ContactEnquiry", async (req, res) => {
  await ContactEnquiry.getAllEnquiry().then((data) => {
    res.json(data);
  });
});

router.route("/ContactEnquiry").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await ContactEnquiry.addEnquiry(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/ContactEnquiry/:id").delete(async (req, res) => {
  await ContactEnquiry.deleteEnquiry(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/ContactEnquiry/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await ContactEnquiry.updateEnquiry(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

// -----------------------Member Master----------------
router.get("/Members", async (req, res) => {
  await Member.getAllMembers().then((data) => {
    res.json(data);
  });
});

router.get("/MembersByType/:id", async (req, res) => {
  await Member.MembersByType(req.params.id).then((data) => {
    res.json(data);
  });
});

router.route("/Members").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await Member.addMembers(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/Members/:id").delete(async (req, res) => {
  await Member.deleteMembers(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/Members/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await Member.updateMembers(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

// -----------------------Member Coupons----------------
router.get("/MemberCoupons", async (req, res) => {
  await MemberCoupons.getAllMemberCoupons().then((data) => {
    res.json(data);
  });
});

router.get("/MemberCoupons/:id", async (req, res) => {
  await MemberCoupons.getAllMemberCouponsCode(req.params.id).then((data) => {
    res.json(data);
  });
});

router.route("/MemberCoupons").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await MemberCoupons.addMemberCoupons(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/MemberCoupons/:id").delete(async (req, res) => {
  await MemberCoupons.deleteMemberCoupons(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/MemberCoupons/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await MemberCoupons.updateMemberCoupons(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

router.get("/MemberCouponsToMail/:Email", async (req, res) => {
  await mailDb.MemberCouponsToMail(req.params.Email).then((data) => {
    res.json(data);
  });
});

// -----------------------Coupons----------------
router.get("/Coupons", async (req, res) => {
  await Coupons.getAllCoupons().then((data) => {
    res.json(data);
  });
});

router.get("/CouponsForWeb", async (req, res) => {
  await Coupons.getAllCouponsForWeb().then((data) => {
    res.json(data);
  });
});

router.route("/Coupons").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await Coupons.addCoupons(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/Coupons/:id").delete(async (req, res) => {
  await Coupons.deleteCoupons(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/Coupons/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await Coupons.updateCoupons(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

// -----------------------Career----------------
router.get("/Career", async (req, res) => {
  await Career.getAllCareer().then((data) => {
    res.json(data);
  });
});

router.route("/Career").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await Career.addCareer(obj).then((data) => {
    res.status(201).json(data);
  });
});

// -----------------------Award----------------
router.get("/Award", async (req, res) => {
  await Award.getAllAwards().then((data) => {
    res.json(data);
  });
});

router.route("/Award").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await Award.addAward(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/Award/:id").delete(async (req, res) => {
  await Award.deleteAward(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/Award/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await Award.updateAward(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

// -----------------------ScienceType----------------
router.get("/ScienceType", async (req, res) => {
  await ScienceType.getAllScienceType().then((data) => {
    res.json(data);
  });
});

router.get("/ScienceTypeWeb", async (req, res) => {
  await ScienceType.getAllScienceTypeWeb().then((data) => {
    res.json(data);
  });
});

router.get("/ScienceTypeWebTwo", async (req, res) => {
  await ScienceType.getAllScienceTypeWebTwo().then((data) => {
    res.json(data);
  });
});

router.get("/ScienceData/:id", async (req, res) => {
  await ScienceType.getAllScienceData(req.params.id).then((data) => {
    res.json(data);
  });
});

router.route("/ScienceData").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await ScienceType.addScienceData(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/ScienceData/:id").delete(async (req, res) => {
  await ScienceType.deleteScienceData(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/ScienceData/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await ScienceType.updateScienceData(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

router.get("/SendMailForScienceSubscribers", async (req, res) => {
  await mailDb.SendMailForScienceSubscribers().then((data) => {
    res.json(data);
  });
});

router.get("/SendMailForScienceSubscribersupdate", async (req, res) => {
  await mailDb.SendMailForScienceSubscribersupdate().then((data) => {
    res.json(data);
  });
});

// -----------------------ManageScienceType----------------

router.route("/AddScienceType").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await ManageScienceType.AddScienceType(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/GetScienceType/").get(async (req, res) => {
  try {
    await ManageScienceType.GetScienceType(req.params.id).then((data) => {
      res.json(data);
    });
  } catch (err) {
    console.log("Error is GetScienceType", err);
    next(err);
  }
});

router.route("/DeleteScienceType/:id").delete(async (req, res) => {
  await ManageScienceType.DeleteScienceType(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/UpdateScienceType/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await ManageScienceType.UpdateScienceType(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

// -----------------------Registered Users----------------
router.get("/RegisteredUsers", async (req, res) => {
  await RegisteredUsers.getAllUsers().then((data) => {
    res.json(data);
  });
});

router.get("/UserProfile/:id", async (req, res) => {
  await RegisteredUsers.GetUserProfile(req.params.id).then((data) => {
    res.json(data);
  });
});

router.get("/UserLogin/:Email/:Password", async (req, res) => {
  await RegisteredUsers.UserLogin(req.params.Email, req.params.Password).then(
    (data) => {
      res.json(data);
    }
  );
});

router.route("/RegisteredUsers").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await RegisteredUsers.addUsers(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/RegisteredUsers/:id").delete(async (req, res) => {
  await RegisteredUsers.deleteUsers(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/RegisteredUsers/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await RegisteredUsers.UpdateUsers(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

router.put("/UpdatePassword/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await RegisteredUsers.UpdatePassword(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

// -----------------------Registered Users Address----------------
router.get("/UserAddress/:id", async (req, res) => {
  await UserAddress.getAllAddress(req.params.id).then((data) => {
    res.json(data);
  });
});

router.get("/UserAddressByAddressID/:id", async (req, res) => {
  await UserAddress.getUserAddressByAddressID(req.params.id).then((data) => {
    res.json(data);
  });
});

router.get("/UpdateDefaultAddress/:id/:userID", async (req, res) => {
  await UserAddress.UpdateDefaultAddress(req.params.id, req.params.userID).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get("/UserAddressDefault/:id", async (req, res) => {
  await UserAddress.getUserDefaultAddress(req.params.id).then((data) => {
    res.json(data);
  });
});

router.route("/UserAddress").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await UserAddress.addAddress(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/UserAddress/:id").delete(async (req, res) => {
  await UserAddress.deleteAddress(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/UserAddress/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await UserAddress.updateAddress(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

// -----------------------News Letter----------------
router.get("/NewsLetter", async (req, res) => {
  await NewsLetter.getAllSubscribedUsers().then((data) => {
    res.json(data);
  });
});

router.get("/NewsLetter/:Email", async (req, res) => {
  await NewsLetter.addSubscription(req.params.Email).then((data) => {
    res.json(data);
  });
});

// -----------------------Order Management----------------
router.route("/VerifyCoupon").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await Coupons.VerifyCoupon(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/PlaceOrder").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await OrderManagement.PlaceOrder(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.get("/MyOrders/:id", async (req, res) => {
  await OrderManagement.getOrderByCustomer(req.params.id).then((data) => {
    res.json(data);
  });
});

router.get("/RecentOrders/:id", async (req, res) => {
  await OrderManagement.getRecentOrders(req.params.id).then((data) => {
    res.json(data);
  });
});

router.get("/OrderItems/:id", async (req, res) => {
  await OrderManagement.getOrderItems(req.params.id).then((data) => {
    res.json(data);
  });
});

router.get("/GetPendingOrders", async (req, res) => {
  await OrderManagement.getPendingOrders().then((data) => {
    res.json(data);
  });
});

router.get("/GetAcceptedOrders", async (req, res) => {
  await OrderManagement.getAcceptedOrders().then((data) => {
    res.json(data);
  });
});

router.get("/GetPackedOrders", async (req, res) => {
  await OrderManagement.getPackedOrders().then((data) => {
    res.json(data);
  });
});

router.get("/GetDispatchedOrders", async (req, res) => {
  await OrderManagement.getDispatchedOrders().then((data) => {
    res.json(data);
  });
});

router.get("/GetDeliveredOrders", async (req, res) => {
  await OrderManagement.getDeliveredOrders().then((data) => {
    res.json(data);
  });
});

router.get("/GetRejectedOrders", async (req, res) => {
  await OrderManagement.getRejectedOrders().then((data) => {
    res.json(data);
  });
});

router.get("/getOrdersByOrderNum/:id", async (req, res) => {
  await OrderManagement.getOrdersByOrderNum(req.params.id).then((data) => {
    res.json(data);
  });
});

router.get("/AcceptOrders/:id", async (req, res) => {
  await OrderManagement.AcceptOrders(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/RejectOrders/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await OrderManagement.RejectOrders(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

router.get("/OrdersByDates/:fdate/:tdate", async (req, res) => {
  await OrderManagement.getOrdersByDates(
    req.params.fdate,
    req.params.tdate
  ).then((data) => {
    res.json(data);
  });
});

router.get("/OrdersByMonth/:date", async (req, res) => {
  await OrderManagement.getOrdersByMonth(req.params.date).then((data) => {
    res.json(data);
  });
});

router.get("/PackedOrders/:id", async (req, res) => {
  await OrderManagement.PackedOrders(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/DispatchedOrders/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await OrderManagement.DispatchedOrders(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

router.get("/DeliveredOrders/:id", async (req, res) => {
  await OrderManagement.DeliveredOrders(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/DelayedOrders/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await OrderManagement.DelayedOrders(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

router.get("/GetDelayedOrders", async (req, res) => {
  await OrderManagement.getDelayedOrders().then((data) => {
    res.json(data);
  });
});

router.get("/AcceptDelayedOrders/:id", async (req, res) => {
  await OrderManagement.AcceptDelayedOrders(req.params.id).then((data) => {
    res.json(data);
  });
});

router.get("/DelayedOrdersByDates/:fdate/:tdate", async (req, res) => {
  await OrderManagement.DelayedOrdersByDates(
    req.params.fdate,
    req.params.tdate
  ).then((data) => {
    res.json(data);
  });
});

router.get("/DelayedOrdersByMonth/:Month", async (req, res) => {
  await OrderManagement.DelayedOrdersByMonth(req.params.Month).then((data) => {
    res.json(data);
  });
});

router.get("/PendingOrdersByMonth/:Month", async (req, res) => {
  await OrderManagement.getPendingOrdersByMonth(req.params.Month).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get("/PendingOrdersByDates/:fdate/:tdate", async (req, res) => {
  await OrderManagement.getPendingOrdersByDates(
    req.params.fdate,
    req.params.tdate
  ).then((data) => {
    res.json(data);
  });
});

router.get("/AcceptedOrdersByMonth/:Month", async (req, res) => {
  await OrderManagement.getAcceptedOrdersByMonth(req.params.Month).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get("/AcceptedOrdersByDates/:fdate/:tdate", async (req, res) => {
  await OrderManagement.geAcceptedOrdersByDates(
    req.params.fdate,
    req.params.tdate
  ).then((data) => {
    res.json(data);
  });
});

router.get("/PackedOrdersByMonth/:Month", async (req, res) => {
  await OrderManagement.getPackedOrdersByMonth(req.params.Month).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get("/PackedOrdersByDates/:fdate/:tdate", async (req, res) => {
  await OrderManagement.getPackedOrdersByDates(
    req.params.fdate,
    req.params.tdate
  ).then((data) => {
    res.json(data);
  });
});

router.get("/DispatchedOrdersByMonth/:Month", async (req, res) => {
  await OrderManagement.getDispatchedOrdersByMonth(req.params.Month).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get("/DispatchedOrdersByDates/:fdate/:tdate", async (req, res) => {
  await OrderManagement.getDispatchedOrdersByDates(
    req.params.fdate,
    req.params.tdate
  ).then((data) => {
    res.json(data);
  });
});

router.get("/DeliveredOrdersByMonth/:Month", async (req, res) => {
  await OrderManagement.getDeliveredOrdersByMonth(req.params.Month).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get("/DeliveredOrdersByDates/:fdate/:tdate", async (req, res) => {
  await OrderManagement.getDeliveredOrdersByDates(
    req.params.fdate,
    req.params.tdate
  ).then((data) => {
    res.json(data);
  });
});

router.get("/RejectedOrdersByMonth/:Month", async (req, res) => {
  await OrderManagement.getRejectedOrdersByMonth(req.params.Month).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get("/RejectedOrdersByDates/:fdate/:tdate", async (req, res) => {
  await OrderManagement.getRejectedOrdersByDates(
    req.params.fdate,
    req.params.tdate
  ).then((data) => {
    res.json(data);
  });
});

//----------------Dashboard------------------------

router.get("/ProductSalesReport/", async (req, res) => {
  await OrderManagement.ProductSalesReport().then((data) => {
    res.json(data);
  });
});

router.get("/ProductUnitSalesReport/", async (req, res) => {
  await OrderManagement.ProductUnitSalesReport().then((data) => {
    res.json(data);
  });
});

//-----------------------Order REVIEWS----------------

router.get("/GetProductsForReviews/:OrderID/:CustomerID", async (req, res) => {
  await Reviews.getProductList(req.params.OrderID, req.params.CustomerID).then(
    (data) => {
      res.json(data);
    }
  );
});

router.route("/addUserReviews").post(async (req, res) => {
  let obj = {
    ...req.body,
  };
  await Reviews.addUserReviews(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.get("/getUserReviews/:id", async (req, res) => {
  await Reviews.getUserReviews(req.params.id).then((data) => {
    res.json(data);
  });
});

router.get("/UserReviewsID/:id", async (req, res) => {
  await Reviews.getUserReviewsById(req.params.id).then((data) => {
    res.json(data);
  });
});

// ------------------------Reports-----------------------------------//

router.get("/AllOrders", async (req, res) => {
  await Reports.AllOrders().then((data) => {
    res.json(data);
  });
});

router.get("/AllOrdersByMonth/:Month", async (req, res) => {
  await Reports.AllOrdersFilterByMonth(req.params.Month).then((data) => {
    res.json(data);
  });
});

router.get("/AllOrdersByDates/:Fdate/:Tdate", async (req, res) => {
  await Reports.AllOrdersFilterByDates(req.params.Fdate, req.params.Tdate).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get("/AllOrdersByYear/:Year", async (req, res) => {
  await Reports.AllOrdersFilterByYear(req.params.Year).then((data) => {
    res.json(data);
  });
});

router.get("/YearlyReport", async (req, res) => {
  await Reports.YearlyReport().then((data) => {
    res.json(data);
  });
});

router.get("/YearlyReport/:Year", async (req, res) => {
  await Reports.YearlyReportByYear(req.params.Year).then((data) => {
    res.json(data);
  });
});

router.get("/YearlyReportByDate/:Fdate/:Tdate", async (req, res) => {
  await Reports.YearlyReportByDate(req.params.Fdate, req.params.Tdate).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get("/GetYearsList", async (req, res) => {
  await Reports.getYearLists().then((data) => {
    res.json(data);
  });
});

router.get("/GetCurrentDayOrders", async (req, res) => {
  await Reports.CurrentDayOrder().then((data) => {
    res.json(data);
  });
});

router.get("/ProductSalesReport", async (req, res) => {
  await Reports.ProductSalesReport().then((data) => {
    res.json(data);
  });
});

router.get("/ProductSalesReportGetMonth/:Month", async (req, res) => {
  await Reports.ProductSalesReportGetMonth(req.params.Month).then((data) => {
    res.json(data);
  });
});

router.get("/ProductSalesReportGetDate/:Fdate/:Tdate", async (req, res) => {
  await Reports.ProductSalesReportGetDate(
    req.params.Fdate,
    req.params.Tdate
  ).then((data) => {
    res.json(data);
  });
});

router.get("/ProductSalesReportGetCurrentDate/", async (req, res) => {
  await Reports.ProductSalesReportGetCurrentDate().then((data) => {
    res.json(data);
  });
});

router.get("/ProductUnitSalesReport", async (req, res) => {
  await Reports.ProductUnitSalesReport().then((data) => {
    res.json(data);
  });
});

router.get("/ProductUnitSalesReportGetMonth/:Month", async (req, res) => {
  await Reports.ProductUnitSalesReportGetMonth(req.params.Month).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get("/ProductUnitSalesReportGetDate/:Fdate/:Tdate", async (req, res) => {
  await Reports.ProductUnitSalesReportGetDate(
    req.params.Fdate,
    req.params.Tdate
  ).then((data) => {
    res.json(data);
  });
});

router.get("/ProductUnitSalesReportCurrentDate/", async (req, res) => {
  await Reports.ProductUnitSalesReportCurrentDate().then((data) => {
    res.json(data);
  });
});

router.get("/OrdersSalesByProduct/:ProductID", async (req, res) => {
  await Reports.OrdersSalesByProduct(req.params.ProductID).then((data) => {
    res.json(data);
  });
});

router.get("/OrdersSalesByProductUnit/:ProductID/:UnitID", async (req, res) => {
  await Reports.OrdersSalesByProductUnit(
    req.params.ProductID,
    req.params.UnitID
  ).then((data) => {
    res.json(data);
  });
});

router.get("/MemberCouponWiseSales", async (req, res) => {
  await Reports.MemberCouponWiseSalesReport().then((data) => {
    res.json(data);
  });
});

router.get("/MemberCouponWiseSalesById/:MEMBER_PKID", async (req, res) => {
  await Reports.MemberCouponWiseSalesById(req.params.MEMBER_PKID).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get("/MemberCouponWiseSalesFilter/:Type", async (req, res) => {
  await Reports.MemberCouponWiseSalesReportFilter(req.params.Type).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get("/MemberCouponWiseSalesByMemberID/:MemberID", async (req, res) => {
  await Reports.MemberCouponWiseSalesByMemberID(req.params.MemberID).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get(
  "/MemberCouponWiseSalesByMemberIDFilter/:MemberID/:Fdate/:Tdate",
  async (req, res) => {
    await Reports.MemberCouponWiseSalesByMemberIDFilter(
      req.params.MemberID,
      req.params.Fdate,
      req.params.Tdate
    ).then((data) => {
      res.json(data);
    });
  }
);

router.get("/AAProbicsCouponsSales", async (req, res) => {
  await Reports.AAProbicsCouponsSales().then((data) => {
    res.json(data);
  });
});

router.get("/AAProbicsCouponsSalesByCouponID/:CouponID", async (req, res) => {
  await Reports.AAProbicsCouponsSalesByCouponID(req.params.CouponID).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get(
  "/AAProbicsCouponsSalesByCouponIDFilter/:CouponID/:Fdate/:Tdate",
  async (req, res) => {
    await Reports.AAProbicsCouponsSalesByCouponIDFilter(
      req.params.CouponID,
      req.params.Fdate,
      req.params.Tdate
    ).then((data) => {
      res.json(data);
    });
  }
);

router.get("/AllProductsReviews", async (req, res) => {
  await Product.getAllProductReviews().then((data) => {
    res.json(data);
  });
});

router.get("/ActivateReview/:ReviewID", async (req, res) => {
  await Product.ActivateReview(req.params.ReviewID).then((data) => {
    res.json(data);
  });
});

router.get("/DeActivateReview/:ReviewID", async (req, res) => {
  await Product.DeActivateReview(req.params.ReviewID).then((data) => {
    res.json(data);
  });
});

router.get("/ProductWiseSalesReport", async (req, res) => {
  await Reports.ProductWiseSalesReport().then((data) => {
    res.json(data);
  });
});

router.get("/MemberWiseSalesReport", async (req, res) => {
  await Reports.MemberWiseSalesReport().then((data) => {
    res.json(data);
  });
});

router.get("/GetCurrentYearSalesReport", async (req, res) => {
  await Reports.GetCurrentYearSalesReport().then((data) => {
    res.json(data);
  });
});

router.get("/ProductWiseSalesReportGetMonth/:Month", async (req, res) => {
  await Reports.ProductWiseSalesReportGetMonth(req.params.Month).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get("/ProductWiseSalesReportGetDate/:Fdate/:Tdate", async (req, res) => {
  await Reports.ProductWiseSalesReportGetDate(
    req.params.Fdate,
    req.params.Tdate
  ).then((data) => {
    res.json(data);
  });
});

router.get("/ProductWiseSalesReportGetCurrentDate/", async (req, res) => {
  await Reports.ProductWiseSalesReportGetCurrentDate().then((data) => {
    res.json(data);
  });
});

router.get("/MemberWiseSalesReportGetMonth/:Month", async (req, res) => {
  await Reports.MemberWiseSalesReportGetMonth(req.params.Month).then((data) => {
    res.json(data);
  });
});

router.get("/MemberWiseSalesReportGetDate/:Fdate/:Tdate", async (req, res) => {
  await Reports.MemberWiseSalesReportGetDate(
    req.params.Fdate,
    req.params.Tdate
  ).then((data) => {
    res.json(data);
  });
});

router.get("/MemberWiseSalesReportGetCurrentDate/", async (req, res) => {
  await Reports.MemberWiseSalesReportGetCurrentDate().then((data) => {
    res.json(data);
  });
});

router.get("/GetCurrentYearSalesReportByMonth/:Month", async (req, res) => {
  await Reports.GetCurrentYearSalesReportByMonth(req.params.Month).then(
    (data) => {
      res.json(data);
    }
  );
});

router.get(
  "/GetCurrentYearSalesReportByDate/:Fdate/:Tdate",
  async (req, res) => {
    await Reports.GetCurrentYearSalesReportByDate(
      req.params.Fdate,
      req.params.Tdate
    ).then((data) => {
      res.json(data);
    });
  }
);

router.get("/GetCurrentYearSalesReportByCdate/", async (req, res) => {
  await Reports.GetCurrentYearSalesReportByCdate().then((data) => {
    res.json(data);
  });
});

// ------------------------- Product Stock History ----------------------

router.get("/ProductStockHistory", async (req, res) => {
  await ProductStockHistory.GetAllStockHistory().then((data) => {
    res.json(data);
  });
});

router.get("/ProductStockHistoryProducts", async (req, res) => {
  await ProductStockHistory.ProductStockHistoryProducts().then((data) => {
    res.json(data);
  });
});

router.get("/ProductStockHistoryByProducts/:ProductID", async (req, res) => {
  await ProductStockHistory.ProductStockHistoryByProducts(
    req.params.ProductID
  ).then((data) => {
    res.json(data);
  });
});

router.get("/ProductStockHistoryByDates/:Fdate/:Tdate", async (req, res) => {
  await ProductStockHistory.ProductStockHistoryByDates(
    req.params.Fdate,
    req.params.Tdate
  ).then((data) => {
    res.json(data);
  });
});

// --------------------- UserForgot Password -----------------------------------------

router.route("/forgotPassword").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await mailDb.forgotPassword(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/checkOTP").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await mailDb.checkOTP(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/ResetPassword").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await mailDb.ResetPassword(obj).then((data) => {
    res.status(201).json(data);
  });
});

// ---------------  General Discounts ---------------------------------

router.get("/GetGeneralDiscount", async (req, res) => {
  await GetGeneralDiscount.GetGeneralDiscount().then((data) => {
    res.json(data);
  });
});

//-------------------productdiscount---------------------------//

router.get("/Discount", async (req, res) => {
  await Discount.getAllDiscount().then((data) => {
    res.json(data);
  });
});

router.route("/Discount").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await Discount.addDiscount(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.route("/Discount/:id").delete(async (req, res) => {
  await Discount.deleteDiscount(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/Discount/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await Discount.updateDiscount(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});
//-----------------------ANNOUNCEMENTS---------------------------//

router.route("/Announce").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await Announce.AddAnnounce(obj).then((data) => {
    res.status(201).json(data);
  });
});

router.get("/Announce", async (req, res) => {
  await Announce.getAnnounce().then((data) => {
    res.json(data);
  });
});

router.route("/Announce/:id").delete(async (req, res) => {
  await Announce.deleteAnnounce(req.params.id).then((data) => {
    res.json(data);
  });
});

router.put("/Announce/:id", async function (req, res, next) {
  let obj = {
    ...req.body,
  };
  try {
    res.json(await Announce.updateAnnounce(req.params.id, obj));
  } catch (err) {
    console.error(`Error while updating`, err.message);
    next(err);
  }
});

router.route("/SendMailAnncouncement").post(async (req, res) => {
  let obj = {
    ...req.body,
  };

  await mailDb.SendMailAnncouncement(obj).then((data) => {
    res.status(201).json(data);
  });
});

// -------END----------------------------------------------------//
var port = process.env.PORT || 7765;

const server = app.listen(port, () =>
  console.log("API is runnning at http://localhost:" + port)
);

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated");
  });
});
