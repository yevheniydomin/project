document.addEventListener("DOMContentLoaded", function () {
  const addQuestionBtn = document.getElementById("addQuestionBtn");
  const questionsContainer = document.getElementById("questionsContainer");

  let questionCounter = 0;

  addQuestionBtn.addEventListener("click", function () {
    questionCounter++;

    const questionHTML = `
            <div class="question">
                <label for="question_${questionCounter}">Question ${questionCounter}</label>
                <input type="text" id="question_${questionCounter}" name="questions[${questionCounter}][question]">
                <br>
                <label for="option_${questionCounter}_1">Option 1</label>
                <input type="number" step="0.01" id="option_${questionCounter}_1" name="questions[${questionCounter}][options][0]">
                <br>
                <label for="option_${questionCounter}_2">Option 2</label>
                <input type="number" step="0.01" id="option_${questionCounter}_2" name="questions[${questionCounter}][options][1]">
                <br>
                <label for="option_${questionCounter}_3">Option 3</label>
                <input type="number" step="0.01" id="option_${questionCounter}_3" name="questions[${questionCounter}][options][2]">
                <br>
                <label for="option_${questionCounter}_4">Option 4</label>
                <input type="number" step="0.01" id="option_${questionCounter}_4" name="questions[${questionCounter}][options][3]">
                <br>
            </div>
        `;

    questionsContainer.insertAdjacentHTML("beforeend", questionHTML);
  });

  // You may also want to add logic to remove questions if needed.
});
