document.getElementById("homeButton").addEventListener("click", function () {
  const userName = document.getElementById("postUser").value;
  const url = `http://localhost:3000/home?userName=${encodeURIComponent(userName)}`;

  fetch(url)
    .then((response) => {
        if(!response.ok){
            throw new Error("Network error");
        } else {
            return response.text();
        }
    }).then((html) => {
        document.documentElement.innerHTML = html;
    })
    .catch((error) => {
      console.log("Error fetching Home page:", error);
    });
});