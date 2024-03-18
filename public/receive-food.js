let cardIdCounter = 1;

document.getElementById("foodNotificationLocationSelect").addEventListener("click", function(event){
    event.preventDefault();

    const chosenLocation = document.getElementById('foodNotificationLocation').value;
    const formData = {
        foodNotificationLocation: chosenLocation
    }
    const url = `http://localhost:3000/food/receive`;

    // Encode the form data into a URL-encoded string
    const urlEncodedData = new URLSearchParams(formData).toString();

    // Make a POST request with the form data
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: urlEncodedData
    })
    .then(response => {
        if (response.ok) {
            return response.text(); // Parse the JSON response
        }
        throw new Error('Network response was not ok');
    })
    .then(html => {
        // parse the html response received
        const parser = new DOMParser();
        const newDocument = parser.parseFromString(html, "text/html");
        const messageList = newDocument.getElementById("messageList");

        // Update the content of the hidden span with the new posts array
        const newVariableJSON = newDocument.getElementById('variableJSON').textContent;
        document.getElementById('variableJSON').textContent = newVariableJSON;

        // Parse the updated posts array
        const variableJSONposts = JSON.parse(newVariableJSON);

        clearMessageList(document.getElementById("messageList"));

        variableJSONposts.forEach(item => {
            const card = createCard(item,item.foodDonationLocation);
            document.getElementById("messageList").appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById("foodNotificationLocationAdd").addEventListener("click", function(){
    const userQueriedLocation = document.getElementById("newFoodLocationAdd").value;
    if(userQueriedLocation !== ""){
        const userQueriedLocationElement = document.createElement("option");
        userQueriedLocationElement.setAttribute("value",userQueriedLocation);
        userQueriedLocationElement.innerHTML = userQueriedLocation;
        document.getElementById("foodNotificationLocation").appendChild(userQueriedLocationElement);
        userQueriedLocation = "";
    }
})

function createCard(data, location) {
    cardIdCounter++;
  
    const card = document.createElement("div");
    card.classList.add("card", "custom-card", "mb-3");
  
    // Create a div element for the card content
    const cardContent = document.createElement("div");
    cardContent.classList.add("card-body");
  
    const foodAvailableLocation = document.createElement("h5");
    foodAvailableLocation.id = location;
    foodAvailableLocation.classList.add("card-title");
    foodAvailableLocation.textContent = location;
  
    // Create a div element for the food items text
    const foodParagraph = document.createElement("p");
    foodParagraph.textContent = data.foodDetails;
    foodParagraph.classList.add("card-text");
  
    const closeButton = document.createElement("button");
    closeButton.textContent = "Claim";
    closeButton.classList.add("btn", "btn-primary");
  
    // Append the available room, food items paragraph to the card content
    cardContent.appendChild(foodAvailableLocation);
    cardContent.appendChild(foodParagraph);
    cardContent.appendChild(closeButton);
  
    // Append the card content to the card
    card.appendChild(cardContent);
    card.setAttribute("id", cardIdCounter);
  
    return card;
  }

  function clearMessageList(messageListElement){
    while(messageListElement.firstChild){
        messageListElement.removeChild(messageListElement.firstChild);
    }
  }