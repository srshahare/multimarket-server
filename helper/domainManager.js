const axios = require("axios");
const path = require("path");
const simpleGit = require("simple-git");
const AWS = require("aws-sdk");
const { DNS } = require("@google-cloud/dns");

const projectId = "multimarketingsystem";
const keyFilename = "./helper/dnsCredentials.json";
const clientFolderPath = path.join(__dirname, "../domain-mapper-client");

// constant
const recordValue = "d14q1xzdu5xi6n.cloudfront.net";
const amplifyAppId = "d5rtod78wpx93";
const rootDomain = "ztroo.com";

// github constants
const repoName = "domain-mapper-client";
// const remoteUrl = `https://github.com/srshahare/domain-mapper-client.git`;
const token = process.env.GITHUB_TOKEN;
const remoteUrl = `https://srshahare:${token}@github.com/srshahare/domain-mapper-client.git`;

process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilename;

// Aws config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "ap-south-1",
});

// aws route 53 object
const route53 = new AWS.Route53();

// amplify client
const amplify = new AWS.Amplify();

// cloudflare access key
const cloudflareKey = process.env.CLOUDFLARE_KEY;

// google dns constructor
const dns = new DNS({ projectId, keyFilename });

const createCloudflareSubdomain = async (subdomainName) => {
  return new Promise(async (resolve, reject) => {
    const zoneId = "deb08170caae2bf2af846f0ccad79cdc";
    try {
      const apiUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;

      const requestBody = {
        type: "CNAME",
        name: subdomainName,
        content: recordValue,
        ttl: 1,
        proxied: false,
      };

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          Authorization: `Bearer ${cloudflareKey}`,
          "Content-Type": "application/json",
        },
      });

      if (response) {
        const result = response.data;
        console.log("CNAME record for cloudflare added successfully: ", result)
        resolve({
          isOk: true,
          result
        });
      } else {
        reject("Error creating DNS");
      }
    } catch (err) {
      console.log(err);
      reject(err.message);
    }
  });
};

async function createARecord(zoneName, domainName, firebaseHostingDomain) {
  new Promise(async (resolve, reject) => {
    try {
      const zone = dns.zone(zoneName);

      const [records] = await zone.getRecords({
        name: domainName,
        type: "A",
      });
      console.log(records);
      if (records.length > 0) {
        console.log(`A record already exists for ${domainName}.`);
        return;
      }

      const newARecord = zone.record("a", {
        name: domainName,
        data: firebaseHostingDomain,
        ttl: 300,
      });

      const config = {
        add: newARecord,
      };

      const change = await zone.createChange(config);
      console.log(change);

      // const result = await change.save();
      resolve(change);
      console.log(
        `A record created for ${domainName} with Firebase Hosting domain ${firebaseHostingDomain}.`
      );
    } catch (error) {
      console.error(`Error creating A record for ${domainName}:`, error);
      reject(error.message);
    }
  });
}

async function createCNAMERecord(subdomainName) {
  return new Promise(async (resolve, reject) => {
    const ttl = 500;
    const hostedZoneId = "Z063982010U3WIQ2WM67Q";
    try {
      // Construct the parameters for the changeResourceRecordSets method
      const params = {
        ChangeBatch: {
          Changes: [
            {
              Action: "CREATE",
              ResourceRecordSet: {
                Name: subdomainName,
                Type: "CNAME",
                TTL: ttl,
                ResourceRecords: [
                  {
                    Value: recordValue,
                  },
                ],
              },
            },
          ],
          Comment: "Adding a CNAME record",
        },
        HostedZoneId: hostedZoneId,
      };

      // Call the changeResourceRecordSets method to add the CNAME record
      route53.changeResourceRecordSets(params, (err, data) => {
        if (err) {
          console.error("Error:", err);
          reject(err.message);
        } else {
          resolve({
            isOk: true,
            data
          });
          console.log("CNAME record added successfully:", data);
        }
      });
    } catch (error) {
      console.error(`Error creating A record for ${subdomainName}:`, error);
      reject(error.message);
    }
  });
}

async function createAmplifySubdomain(subdomainName) {
  return new Promise(async (resolve, reject) => {
    try {
      const git = simpleGit(clientFolderPath);

      await git.init();
      await git.add("./*");
      await git.commit(`${subdomainName} for amplify app commit`);
      const branchName = subdomainName.split(".")[0];

      // Use either username and password, or a personal access token for authentication
      // const remoteWithCredentials = remoteUrl.replace(
      //   "https://",
      //   `https://${username}:${password}@`
      // );
      process.env.GITHUB_TOKEN = token;
      // const remoteWithCredentials = remoteUrl.replace(
      //   "https://",
      //   `https://${token}@`
      // );

      // Check if the remote named 'origin' exists, and remove it if necessary
      const remotes = await git.getRemotes(true);
      const originRemote = remotes.find((remote) => remote.name === "origin");
      if (originRemote) {
        await git.removeRemote("origin");
      }

      await git.addRemote("origin", remoteUrl);

      // Create a new branch and check it out
      await git.checkoutLocalBranch(branchName);

      await git.push("origin", branchName);
      console.log("Pushed to GitHub successfully.");
      resolve({
        isOk: true
      });
    } catch (error) {
      console.error(`Error creating subdomain ${subdomainName}:`, error);
      reject(error.message);
    }
 })
}

// async function createAmplifySubdomain(subdomainName) {
//   new Promise(async (resolve, reject) => {
//     try {
//       // Construct the parameters for the createDomainAssociation method
//       const params = {
//         appId: amplifyAppId,
//         domainName: rootDomain,
//         subDomainSettings: [
//           {
//             prefix: subdomainName.split(".")[0],
//             branchName: branchName,
//           },
//         ],
//       };
//       // Call the createDomainAssociation method to add the subdomain
//       amplify.createDomainAssociation(params, (err, data) => {
//         if (err) {
//           console.error("Error:", err);
//           reject(err.message);
//         } else {
//           console.log("Subdomain added successfully:", data);
//           resolve(data);

//           const _params = {
//             appId: amplifyAppId,
//             domainName: rootDomain
//           }

//           amplify.getDomainAssociation(_params, (err, data) => {
//             if (err) {
//               console.error('Error:', err);
//             } else {
//               console.log('Domain association details:', data);
//             }
//           });

//         }
//       });
//     } catch (error) {
//       console.error(`Error creating A record for ${subdomainName}:`, error);
//       reject(error.message);
//     }
//   });
// }

module.exports = {
  createCloudflareSubdomain,
  createARecord,
  createCNAMERecord,
  createAmplifySubdomain,
};
