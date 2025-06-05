self.addEventListener("install", (event) => {
  console.log(event);
  console.log("Service worker installed");
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

self.addEventListener("message", (event) => {
  if(event.data.type === "TAB_CLOSING") {
    fetch("https://172.20.5.55:7239/api/User/change-user-status", {
      method: "POST",
      body: JSON.stringify({
        UserId: event.data.data.userId,
        Status: "Offline",
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + event.data.data.token,
      },
    });
  }

  if (event.data.type === 'NEW_MESSAGE') {
    // Показываем уведомление
    self.registration.showNotification('Новое сообщение', {
      body: event.data.data.message,
      silent: false,
      sound: event.data.data.sound,
      requireInteraction: true // Уведомление не исчезнет само
    }).catch(error => {
      console.error('Ошибка показа уведомления:', error);
    });
  }
})

self.addEventListener('push', (event) => {
  // Получаем данные сообщения
  const message = event.data.json();
  
  // Показываем уведомление
  self.registration.showNotification('Новое сообщение', {
    body: message.text,
    icon: '/path/to/icon.png',
    // Включаем звук в уведомлении
    silent: false,
    // Можно указать свой звук
    sound: '/audio/NewMessage/new_message_tone.wav'
  });
});