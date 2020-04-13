export function findAnswerMatches(givenAnswer, validVocabulary) {
  var validAnswers = [];
  // var validAnswersIds = [];
  for (var i = 0; i < validVocabulary.length; i++) {
    const vocabulary = validVocabulary[i];
    const validMeaning = vocabulary.data.meanings
      .filter((meaning) => meaning.accepted_answer)
      .find((meaning) => {
        // TODO: use string-similarity to find similar match instead of total match
        return meaning.meaning.toLowerCase() === givenAnswer.toLowerCase();
      });

    if (validMeaning !== undefined) {
      validAnswers.push(vocabulary);
      // validAnswersIds.push(i);
    }
  }
  // return {validAnswers, validAnswersIds};
  return validAnswers;
}
