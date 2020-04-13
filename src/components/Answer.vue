<template>
  <div>
    <h6>Characters: {{ vocabulary.data.characters }}</h6>
    <h6>Meaning: {{ getMeaningsWithAcceptedAnswers(vocabulary) }}</h6>
    <h6>
      Other readings:
      {{ getOtherReadings(vocabulary) }}
    </h6>
  </div>
</template>

<script>
export default {
  name: "Answer",
  props: {
    "currentKana": {
      type: String,
      default: "",
    },
    "vocabulary": {
      type: Object,
      default () {
        return {
          data: {
            meanings: [],
            readings: [],
          }
        }
      }
    },
  },
  methods: {
    getMeaningsWithAcceptedAnswers: function (vocabulary) {
      return vocabulary.data.meanings
        .filter((meaning) => meaning.accepted_answer)
        .map((meaning) => meaning.meaning)
        .join(", ");
    },
    getOtherReadings: function (vocabulary) {
      const otherReadings = vocabulary.data.readings
        .filter((reading) => reading.accepted_answer && reading.reading !== this.currentKana)
        .map((reading) => reading.reading);
      return otherReadings.length === 0 ? "None" : otherReadings.join(", ");
    },
    submitAnswers: function () {
      this.isAnswering = false;
      if (!this.kana) {
        return;
      }

      const findBestMatch = function (givenAnswer, validVocabulary) {
        var validAnswers = [];
        var validAnswersIds = [];
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
            validAnswersIds.push(i);
          }
        }
        return {validAnswers, validAnswersIds};
      }

      var validAnswersForGivenAnswers = [];
      var validVocabularyIds = new Set();
      // For each given answer find all the vocabulary that that has one meaning that matches the answer
      for (var i = 0; i < this.givenAnswers.length; i++) {
        const givenAnswer = this.givenAnswers[i].value;
        var {validAnswers, validAnswersIds} = findBestMatch(givenAnswer, this.validVocabulary);
        validAnswersForGivenAnswers.push(validAnswers);
        validVocabularyIds = new Set([...validVocabularyIds, ...validAnswersIds]);
      }

      this.validatedAnswers = validAnswersForGivenAnswers;
      this.additionalAnswers = this.validVocabulary.filter((v, idx) => !validVocabularyIds.has(idx));
      this.addNewAnswer();
    }
  }
}
</script>