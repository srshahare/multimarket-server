const {
  createCloudflareSubdomain,
  createCNAMERecord,
  createAmplifySubdomain,
} = require("../helper/domainManager");
const db = require("../models");

const Agent = db.agent;
const User = db.user;

const createAgentSite = async (req, res, next) => {
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
    const officeDomain = `${domainHeader}-office.ztroo.com`;
    const agentDomain = `${domainHeader}-agent.ztroo.com`;

    const newAgentSite = new Agent({
      siteName,
      agentDomain,
      officeDomain,
      userId,
    });

    // create record in cloudflare
    const result = await createCloudflareSubdomain(officeDomain);
    const result1 = await createCloudflareSubdomain(agentDomain);
    // if(!result || !result1) {
    //   return res.status(500).json({
    //     type: "Server Error",
    //     message: "Internal server error",
    //   });
    // }

    // create record in aws route 53
    const routeResult = await createCNAMERecord(officeDomain);
    const routeResult1 = await createCNAMERecord(agentDomain);
    // if(!routeResult || !routeResult1) {
    //   return res.status(500).json({
    //     type: "Server Error",
    //     message: "Internal server error",
    //   });
    // }

    // add subdomain to amplify app
    const ampResult = await createAmplifySubdomain(officeDomain);

    // if(!amplifyResult || !amplifyResult1) {
    //   return res.status(500).json({
    //     type: "Server Error",
    //     message: "Internal server error",
    //   });
    // }

    const savedAgent = newAgentSite.save();

    res.status(200).json({
      type: "Agent Site Created",
      message: "Agent site created successfully",
      data: {
        ...savedAgent,
        agentDomain,
        officeDomain,
      },
    });

    setTimeout(async () => {
      const ampResult1 = await createAmplifySubdomain(agentDomain);
    }, 60000);
    
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: "Server Error",
      message: "Internal server error",
    });
  }
};

const getAgentSite = async (req, res) => {
  try {
    const { userId } = req;
    const agentSite = await Agent.findOne({
      where: {
        userId: userId,
      },
    });

    if (agentSite) {
      return res.status(200).json({
        type: "Agent Site",
        message: "Agent site fetched successfully!",
        data: agentSite,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createAgentSite,
  getAgentSite,
};
