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
  
    let res;
    try {
      res = await fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error("ERROR ON SUBMITTING THE FORM\n", err);
    }
    if (res.ok) {
      window.location.href = "/successPage.html";
    } else {
      console.error("Server responded with an error");
    }
  };
  
  const quizzFormToSubmit = document.getElementById("questions");
  
  quizzFormToSubmit.addEventListener("submit", submitForm);