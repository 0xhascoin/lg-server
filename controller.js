const { client, getProfileDetailsByAddress } = require("./lensApi");
const { images, names, nftData } = require('./nftMetadata');

const fetchLensProfile = async (address) => {
  try {
    const { data: { profiles: { items } } } = await client.query(getProfileDetailsByAddress, { "address": address }).toPromise();
    return {...items[0], error: false};
  } catch (error) {
    return { "error": true }
  }
}

const buildObject = (profile) => {
  const { totalFollowing, totalFollowers, totalPosts, totalCollects, totalMirrors, totalComments } = profile.stats;
  const exp = calculateExperience(totalFollowing, totalFollowers, totalPosts, totalCollects, totalMirrors, totalComments);
  const level = calculateLevel(exp);

  let obj = {
    ...profile,
    attributes: [
        {
            trait_type: "Level",
            value: level.level.toString()
        },
        {
            trait_type: "Experience to Next Level",
            value: level.experienceToNextLevel.toString()
        },
        {
            trait_type: "Total XP",
            value: exp.toString()
        }
    ],
    name: "Lens Garden NFT",
    description: "Lens Garden NFT is a dynamic NFT collection that reflects your usage of the Lens Protocol in your NFT."
  }

  if (obj.attributes[0].value < 7) {
    obj = { ...obj, image: images[0], name: names[0] }
  } else if (obj.attributes[0].value <= 7 || obj.attributes[0].value < 12) {
      obj = { ...obj, image: images[1], name: names[1] }
  } else if (obj.attributes[0].value <= 12 || obj.attributes[0].value < 17) {
      obj = { ...obj, image: images[2], name: names[2] }
  } else if (obj.attributes[0].value <= 17 || obj.attributes[0].value < 22) {
      obj = { ...obj, image: images[3], name: names[3] }
  } else if (obj.attributes[0].value <= 22 || obj.attributes[0].value < 27) {
      obj = { ...obj, image: images[4], name: names[4] }
  } else if (obj.attributes[0].value <= 27 || obj.attributes[0].value < 32) {
      obj = { ...obj, image: images[5], name: names[5] }
  } else if (obj.attributes[0].value <= 32 || obj.attributes[0].value < 35) {
      obj = { ...obj, image: images[6], name: names[6] }
  } else if (obj.attributes[0].value <= 35 || obj.attributes[0].value < 37) {
      obj = { ...obj, image: images[7], name: names[7] }
  } else if (obj.attributes[0].value >= 37) {
      obj = { ...obj, image: images[8], name: names[8] }
  }

  obj = {
    attributes: obj.attributes,
    image: obj.image,
    name: obj.name,
    description: obj.description
  }

  return obj;
}

const returnNFTMetadataObject = (profile) => {
  try {
    const nftMetadata = buildObject(profile);
    return nftMetadata
  } catch(error) {
    console.log(error);
  }
}

const calculateExperience = (following, followers, posts, collects, mirrors, comments) => {
  // Following, Followers, Posts, Collects, Mirrors, Comments
  return (following * 10) + (followers * 50) + (posts * 30) + (collects * 20) + (mirrors * 30) + (comments * 20);
}

const calculateLevel = (experience) => {
  let level = 1;
  let threshold = 100;
  let experienceToNextLevel = threshold;
  while (experience >= threshold) {
    level += 1;
    threshold *= 1.5;
  }
  experienceToNextLevel = Math.floor(threshold - experience);

  return { level, experienceToNextLevel };
}

module.exports = { fetchLensProfile, returnNFTMetadataObject }