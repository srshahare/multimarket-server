const {
  createCloudflareSubdomain,
  createCNAMERecord,
  createAmplifySubdomain,
} = require("../helper/domainManager");
const db = require("../models");
const Sales = db.sales;
const User = db.user;

const createSalesSite = async (req, res, next) => {
  try {
    const { userId } = req;
    const { siteName } = req.body;

    const user = await User.findOne({ where: { id: userId } });

    if(!user) {
      return res.status(401).json({
        type: "Not Found", 
        message: "User not found with this userId"
      })
    }

    const domainHeader = user.domainHeader;
    const eComDomain = `${domainHeader}-ecom.ztroo.com`;
    const customerDomain = `${domainHeader}-customer.ztroo.com`;

    const newSales = new Sales({
      siteName,
      eComDomain,
      customerDomain,
      userId,
    });
    // create record in cloudflare
    const result = await createCloudflareSubdomain(eComDomain);
    const result1 = await createCloudflareSubdomain(customerDomain);

    // create record in aws route 53
    const routeResult = await createCNAMERecord(eComDomain);
    const routeResult1 = await createCNAMERecord(customerDomain);

    const ampResult = await createAmplifySubdomain(eComDomain);

    const savedSales = newSales.save();

    res.status(200).json({
      type: "Sales Site Created",
      message: "Sales site created successfully",
      data: {
        ...savedSales,
        eComDomain,
        customerDomain,
      },
    });

    setTimeout(async () => {
      const ampResult1 = await createAmplifySubdomain(customerDomain);
    }, 60000);

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: "Server Error",
      message: "Internal server error",
    });
  }
};

const getSalesSite = async (req, res) => {
  try {
    const { userId } = req;
    const salesSite = await Sales.findOne({
      where: {
        userId: userId,
      },
    });

    if (salesSite) {
      return res.status(200).json({
        type: "Sales Site",
        message: "Sales site fetched successfully!",
        data: salesSite,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createSalesSite,
  getSalesSite,
};
