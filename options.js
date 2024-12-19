document.getElementById("urlForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let url1 = document.getElementById("url1").value;
    let url2 = document.getElementById("url2").value;
  
    if (url1 && url2) {
      chrome.storage.sync.set({ url1: url1, url2: url2 }, function() {
        alert("URLs saved successfully!");
        
        // Kirim pesan ke background untuk membuka URL di dua monitor
        chrome.runtime.sendMessage({ action: "openUrls" });
      });
    } else {
      alert("Please enter both URLs.");
    }
  });
  
  // Load saved URLs
  chrome.storage.sync.get(["url1", "url2"], function(result) {
    document.getElementById("url1").value = result.url1 || "";
    document.getElementById("url2").value = result.url2 || "";
  });
  