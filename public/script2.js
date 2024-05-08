document.addEventListener("DOMContentLoaded", function () {
  const addQuestionBtn = document.getElementById("addQuestionBtn");
  const questionsContainer = document.getElementById("questionsContainer");

  let questionCounter = 0;

  addQuestionBtn.addEventListener("click", function () {
    questionCounter++;

    const questionSet = document.createElement("div");
    questionSet.classList.add("questionSet");

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.classList.add("text");
    titleInput.name = `questions[${questionCounter}][title]`;
    titleInput.placeholder = `Untitled Question ${questionCounter}`;

    const textArea = document.createElement("textarea");
    textArea.classList.add("questionText");
    textArea.name = `questions[${questionCounter}][description]`;
    textArea.placeholder = "Problem description";

    const inputImgElement = document.createElement("input");
    inputImgElement.type = "file";
    inputImgElement.name = `questions[${questionCounter}][img]`;
    inputImgElement.accept = "image/*";
    inputImgElement.multiple = false;
    inputImgElement.addEventListener("change", handleFileUpload);

    function handleFileUpload(event) {
      const file = event.target.files[0]; // Get the selected file
      // Do something with the file (e.g., upload it to the server)
      console.log("Selected file:", file);
    }

    questionSet.appendChild(titleInput);
    questionSet.appendChild(document.createElement("br"));
    questionSet.appendChild(document.createElement("br"));
    questionSet.appendChild(textArea);
    questionSet.appendChild(inputImgElement);
    questionSet.appendChild(document.createElement("br"));
    questionSet.appendChild(document.createElement("br"));

    for (let i = 1; i <= 4; i++) {
      const minInput = document.createElement("input");
      minInput.type = "number";
      minInput.step = "any";
      minInput.classList.add("option-min");
      minInput.name = `questions[${questionCounter}][options][${i - 1}][min]`;
      minInput.placeholder = `Min Option ${i}`;

      const maxInput = document.createElement("input");
      maxInput.type = "number";
      maxInput.step = "any";
      maxInput.classList.add("option-max");
      maxInput.name = `questions[${questionCounter}][options][${i - 1}][max]`;
      maxInput.placeholder = `Max Option ${i}`;

      const correctCheckbox = document.createElement("input");
      correctCheckbox.type = "checkbox";
      correctCheckbox.classList.add("option-correct");
      correctCheckbox.name = `questions[${questionCounter}][options][${i - 1}][correct]`;
      correctCheckbox.dataset.index = i;
      correctCheckbox.onchange = function () {
        updateCorrect(this);
      };

      const label = document.createElement("label");
      label.htmlFor = `option_${questionCounter}_${i}`;
      label.textContent = `Option ${i}`;

      questionSet.appendChild(minInput);
      questionSet.appendChild(maxInput);
      questionSet.appendChild(correctCheckbox);
      questionSet.appendChild(label);
      questionSet.appendChild(document.createElement("br"));
      // questionSet.appendChild(document.createElement('br'));
    }

    questionsContainer.appendChild(questionSet);
  });

  // Function to update correct value based on checkbox state
  function updateCorrect(checkbox) {
    const isChecked = checkbox.checked;
    const optionDiv = checkbox.parentElement;
    const correctInput = optionDiv.querySelector(".option-correct-value");
    correctInput.value = isChecked ? 1 : 0;
  }
});
