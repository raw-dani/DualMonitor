// // Event yang berjalan saat Chrome pertama kali dibuka
// chrome.runtime.onInstalled.addListener(() => {
//     chrome.storage.sync.get(["url1", "url2"], function(result) {
//         if (result.url1 && result.url2) {
//             // Gunakan API system.display untuk mendapatkan informasi layar
//             chrome.system.display.getInfo((displays) => {
//                 if (displays.length >= 2) {
//                     const [display1, display2] = displays;

//                     setTimeout(() => {
//                         // Buka URL 1 di monitor pertama
//                         chrome.windows.create({
//                             url: result.url1,
//                             left: display1.bounds.left,
//                             top: display1.bounds.top,
//                             width: display1.bounds.width,
//                             height: display1.bounds.height,
//                             focused: true
//                         }, (window1) => {
//                             console.log("URL 1 opened on monitor 1");

//                             // Tambahkan sedikit jeda sebelum membuka jendela kedua
//                             setTimeout(() => {
//                                 // Buka URL 2 di monitor kedua
//                                 chrome.windows.create({
//                                     url: result.url2,
//                                     left: display2.bounds.left,
//                                     top: display2.bounds.top,
//                                     width: display2.bounds.width,
//                                     height: display2.bounds.height,
//                                     focused: true
//                                 }, (window2) => {
//                                     console.log("URL 2 opened on monitor 2");
//                                 });
//                             }, 500); // Jeda 500 ms sebelum membuka jendela kedua
//                         });
//                     }, 1000); // Jeda 1 detik sebelum membuka jendela pertama
//                 } else {
//                     console.log("Only one monitor detected. Please connect a second monitor.");
//                 }
//             });
//         } else {
//             console.log("URLs not set. Please configure in options.");
//         }
//     });
// });
// Fungsi untuk membuka dua URL di layar terpisah
function openUrlsOnMonitors() {
    chrome.storage.sync.get(["url1", "url2"], function(result) {
        if (result.url1 && result.url2) {
            chrome.system.display.getInfo((displays) => {
                if (displays.length >= 2) {
                    const [display1, display2] = displays;

                    setTimeout(() => {
                        // Buka URL 1 di monitor pertama
                        chrome.windows.create({
                            url: result.url1,
                            left: display1.bounds.left,
                            top: display1.bounds.top,
                            width: display1.bounds.width,
                            height: display1.bounds.height,
                            focused: true
                        }, (window1) => {
                            // Jadikan fullscreen setelah jendela dibuat
                            chrome.windows.update(window1.id, { state: 'fullscreen' });
                            console.log("URL 1 opened in fullscreen on monitor 1");

                            // Jeda sebelum membuka jendela kedua
                            setTimeout(() => {
                                // Buka URL 2 di monitor kedua
                                chrome.windows.create({
                                    url: result.url2,
                                    left: display2.bounds.left,
                                    top: display2.bounds.top,
                                    width: display2.bounds.width,
                                    height: display2.bounds.height,
                                    focused: true
                                }, (window2) => {
                                    // Jadikan fullscreen setelah jendela dibuat
                                    chrome.windows.update(window2.id, { state: 'fullscreen' });
                                    console.log("URL 2 opened in fullscreen on monitor 2");
                                });
                            }, 500); // Jeda sebelum membuka jendela kedua
                        });
                    }, 1000); // Jeda sebelum membuka jendela pertama
                } else {
                    console.log("Only one monitor detected. Please connect a second monitor.");
                }
            });
        } else {
            console.log("URLs not set. Please configure in options.");
        }
    });
}


// Memicu openUrlsOnMonitors saat Chrome pertama kali dibuka
chrome.runtime.onStartup.addListener(openUrlsOnMonitors);

// Memicu openUrlsOnMonitors saat extension diinstall atau diperbarui
chrome.runtime.onInstalled.addListener(openUrlsOnMonitors);

// Cadangan: Memicu openUrlsOnMonitors saat ikon extension diklik
chrome.action.onClicked.addListener(openUrlsOnMonitors);

// Event Listener untuk menerima pesan dari options.js untuk memulai pembukaan URL setelah disimpan
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openUrls") {
        chrome.storage.sync.get(["url1", "url2"], function(result) {
            if (result.url1 && result.url2) {
                chrome.system.display.getInfo((displays) => {
                    if (displays.length >= 2) {
                        const [display1, display2] = displays;

                        // Buka URL 1 di monitor pertama
                        chrome.windows.create({
                            url: result.url1,
                            left: display1.bounds.left,
                            top: display1.bounds.top,
                            width: display1.bounds.width,
                            height: display1.bounds.height,
                            focused: true
                        }, (window1) => {
                            console.log("URL 1 opened on monitor 1");

                            setTimeout(() => {
                                // Buka URL 2 di monitor kedua
                                chrome.windows.create({
                                    url: result.url2,
                                    left: display2.bounds.left,
                                    top: display2.bounds.top,
                                    width: display2.bounds.width,
                                    height: display2.bounds.height,
                                    focused: true
                                }, (window2) => {
                                    console.log("URL 2 opened on monitor 2");
                                });
                            }, 500); // Jeda sebelum membuka jendela kedua
                        });
                    } else {
                        console.log("Only one monitor detected. Please connect a second monitor.");
                    }
                });
            } else {
                console.log("URLs not set properly.");
            }
        });
    }
});
