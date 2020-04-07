import axios from "axios";

const wanikaniApiUrl = "https://api.wanikani.com/v2";

function createHeaders(accessToken) {
  const headers = {
    Authorization: "Bearer " + accessToken,
  };
  return { headers };
}

export function getUserData(accessToken) {
  const userData = axios
    .get(`${wanikaniApiUrl}/user`, createHeaders(accessToken))
    .then(({ data }) => data);
  return userData;
}

export function getVocabularyData(accessToken, maxLevel) {
  // TODO: consider paging
  console.log(maxLevel);
  const levelsParamValue = [...Array(maxLevel).keys()].map((x) => x + 1).join();
  const vocabularyData = axios
    .get(
      `${wanikaniApiUrl}/subjects?types=vocabulary&levels=${levelsParamValue}`,
      createHeaders(accessToken)
    )
    .then(({ data }) => data);
  return vocabularyData;
}

export default { getUserData, getVocabularyData };
