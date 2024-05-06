const submitForm = async (e) => {
  e.preventDefault();
  const formData = [];
  const formDivs = document.querySelectorAll(".smallBox");

  formDivs.forEach((div) => {
    const checkedRadioButton = div.querySelector('input[type="radio"]:checked');
    if (checkedRadioButton) {
      formData.push({
        questionId: checkedRadioButton.name,
        answeredOption: checkedRadioButton.value,
        quizId: div.getAttribute("quiz"),
        name: div.getAttribute("userName"),
      });
    }
  });

  await fetch("http://localhost:3000/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("Form submitted successfully!");
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
    });
};
const quizzFormToSubmit = document.getElementById("questions");
quizzFormToSubmit.addEventListener("submit", submitForm);
