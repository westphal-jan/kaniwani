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

export function getKanaToVocabulary(accessToken, maxLevel) {
  const kanaToVocabulary = getVocabularyData(accessToken, maxLevel).then(
    (vocabularyData) => {
      const readingToVocabulary = {};
      for (var i = 0; i < vocabularyData.data.length; i++) {
        const vocabulary = vocabularyData.data[i];
        const readings = vocabulary.data.readings.filter(
          (reading) => reading.accepted_answer
        );
        for (var j = 0; j < readings.length; j++) {
          const reading = readings[j].reading;
          if (!(reading in readingToVocabulary)) {
            readingToVocabulary[reading] = [vocabulary];
          } else {
            readingToVocabulary[reading].push(vocabulary);
          }
        }
      }
      return readingToVocabulary;
      // var m = { max: 0, r: [] };
      // for (const reading in readingToVocabulary) {
      //   console.log(
      //     reading,
      //     readingToVocabulary[reading].length,
      //     readingToVocabulary[reading]
      //   );
      //   if (readingToVocabulary[reading].length > m.max) {
      //     m.max = readingToVocabulary[reading].length;
      //     m.r = [readingToVocabulary[reading]];
      //   } else if (readingToVocabulary[reading].length == m.max) {
      //     m.r.push(readingToVocabulary[reading]);
      //   }
      // }
      // console.log(m);
    }
  );
  return kanaToVocabulary;
}

export default { getUserData, getVocabularyData, getKanaToVocabulary };
