function searchTutorial() {
  const value = document.getElementById("search").value;

  if (value.trim() === "") {
    alert("Please enter a tutorial name!");
  } else {
    alert("Searching for: " + value);
  }
}
