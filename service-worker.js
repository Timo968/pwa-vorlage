self.addEventListener("install", function (event) {
    var offlinePage = new Request("offline.html");
    event.waitUntil(
        fetch(offlinePage).then(function (response) {
            return caches.open("pwa-offline").then(function (cache) {
                console.log("Offline Page während Install gecached" + response.url);
                return cache.put(offlinePage, response);
            });
        }));
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        fetch(event.request).catch(function (error) {
            console.error("Netzwerkanfragen fehlgeschlagen. Liefere Offline Page " + error);
            return caches.open("pwa-offline").then(function (cache) {
                return cache.match("offline.html");
            });
        }));
});

self.addEventListener("refreshOffline", function (response) {
    return caches.open("pwa-offline").then(function (cache) {
        console.log("Offline Seite aktualisiert vom refreshOffline event: " + response.url);
        return cache.put(offlinePage, response);
    });
});

self.addEventListener("notificationclose", function (e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;

    console.log("Closed notification: " + primaryKey);
});
