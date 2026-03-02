self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/INV_WEBLOGO.png",
      badge: "/INV_WEBLOGO.png",
      data: {
        url: data.url || "/planning",
      },
      vibrate: [200, 100, 200],
      tag: "task-notification", // Consolidate multiple notifications
      renotify: true,
      actions: [
        { action: "open", title: "Voir le Planning" },
        { action: "close", title: "Fermer" },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "INV-FLOW", options),
    );
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const url = event.notification.data?.url || "/planning";
  if (event.action === "open" || !event.action) {
    event.waitUntil(clients.openWindow(url));
  }
});
