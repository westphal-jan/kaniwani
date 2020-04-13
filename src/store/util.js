export function findAnswerMatches(givenAnswer, validVocabulary) {
  var validAnswers = [];
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
    }
  }
  return validAnswers;
}

function getUnansweredVocabulary(
  validVocabulary,
  givenAnswersToValidVocabulary
) {
  const validAnswersIds = Object.keys(givenAnswersToValidVocabulary).reduce(
    function (s, answer) {
      var ids = givenAnswersToValidVocabulary[answer].map(
        (vocabulary) => vocabulary.id
      );
      return new Set([...s, ...ids]);
    },
    new Set()
  );
  const unansweredVocabulary = validVocabulary.filter(
    (vocabulary) => !validAnswersIds.has(vocabulary.id)
  );
  return unansweredVocabulary;
}

export function evaluateGivenAnswers(givenAnswers, validVocabulary) {
  var givenAnswersToValidVocabulary = {};
  for (var givenAnswer of givenAnswers) {
    givenAnswersToValidVocabulary[givenAnswer] = findAnswerMatches(
      givenAnswer,
      validVocabulary
    );
  }
  const unansweredVocabulary = getUnansweredVocabulary(
    validVocabulary,
    givenAnswersToValidVocabulary
  );
  return { givenAnswersToValidVocabulary, unansweredVocabulary };
}
