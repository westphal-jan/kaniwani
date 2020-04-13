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
  }
}
</script>