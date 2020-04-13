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

export async function getVocabularyData(accessToken, maxLevel) {
  const levelsParamValue = [...Array(maxLevel).keys()].map((x) => x + 1).join();
  var url = `${wanikaniApiUrl}/subjects?types=vocabulary&levels=${levelsParamValue}`;
  var vocabularyData = null;
  // while (url !== null) {
  // TODO: Remove this security mechanism
  for (var i = 0; i < 4; i++) {
    console.log("Get Vocabulary", url);
    const data = await axios
      .get(url, createHeaders(accessToken))
      .then(({ data }) => data);
    url = data.pages.next_url;
    if (vocabularyData === null) {
      vocabularyData = data;
    } else {
      vocabularyData.data.push(...data.data);
    }
  }
  console.log(vocabularyData);
  return vocabularyData;
}

export function getKanaToVocabulary(accessToken, maxLevel) {
  const kanaToVocabulary = getVocabularyData(accessToken, maxLevel).then(
    (vocabularyData) => {
      const kanaToVocabulary = {};
      for (var i = 0; i < vocabularyData.data.length; i++) {
        const vocabulary = vocabularyData.data[i];
        const readings = vocabulary.data.readings.filter(
          (reading) => reading.accepted_answer
        );
        for (var j = 0; j < readings.length; j++) {
          const reading = readings[j].reading;
          if (!(reading in kanaToVocabulary)) {
            kanaToVocabulary[reading] = [vocabulary];
          } else {
            kanaToVocabulary[reading].push(vocabulary);
          }
        }
      }
      return kanaToVocabulary;
    }
  );
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
  return kanaToVocabulary;
}

export default { getUserData, getVocabularyData, getKanaToVocabulary };
