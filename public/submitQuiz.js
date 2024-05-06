const submitForm = async (e) => {
  e.preventDefault();
  console.log(e);
  const formData = new FormData();
  const form = document.getElementById("questions");
  form.querySelectorAll('input[type="radio"]').forEach(function (input) {
    formData.append(input.id, input.value);
  });

  console.log(formData);

  await fetch("http://localhost:3000/saveResult", {
    method: "POST",
    body: formData,
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

console.log(quizzFormToSubmit);
