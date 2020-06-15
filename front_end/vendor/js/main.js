const date = new Date();

let lunchTime = `${date.getHours()}:${date.getMinutes() + 5}`;
let dinnerTime = '19:00';

document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.timepicker');
  const options = { twelveHour: false, fromNow: 0 }
  const instances = M.Timepicker.init(elems, options);

  const lunch = document.getElementById("lunch");
  const dinner = document.getElementById("dinner");

  lunch.value = `${date.getHours()}:${date.getMinutes() + 5}`;
  dinner.value = '19:00';

  elems[0].addEventListener('change', () => {
    lunchTime = lunch.value;
  })

  elems[1].addEventListener('change', () => {
    dinnerTime = dinner.value;
  })

});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('Service Worker is registered', registration);
      registration.pushManager.getSubscription()
    }).catch(error => {
      console.error('Service Worker Error', error);
    });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

(async () => {
  if ('serviceWorker' in navigator) {
    // We first get the registration
    const registration = await navigator.serviceWorker.ready;
    // Asking for the subscription object
    let subscription = await registration.pushManager.getSubscription();

    // If we don't have a subscription we have to create and register it!
    if (!subscription) {
      subscription = await subscribe(registration);
    }
    // Implementing an unsubscribe button
    document.getElementById('unsubscribe').onclick = () => unsubscribe();
  }
})().catch(e => {
  alert(`There has been an error 
        ${e.toString()}`);
  throw e;
});

const subscribe = async (registration) => {

  const response = await fetch('/vapid-public-key');
  const body = await response.json();
  const publicKey = body.publicKey;

  const Uint8ArrayPublicKey = urlBase64ToUint8Array(publicKey);

  console.log(lunchTime)
  console.log(dinnerTime)

  let splitLunch = lunchTime.split(':');
  let splitDinner = dinnerTime.split(':');
  
  const lunchHours = splitLunch[0];
  const lunchMinutes = splitLunch[1];
  const dinnerHours = splitDinner[0];
  const dinnerMinutes = splitDinner[1];

  const notificationTime = {
    lunchMinutes,
    lunchHours,
    dinnerMinutes,
    dinnerHours
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: Uint8ArrayPublicKey,
  });

  await fetch('/notificationTime', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notificationTime)
  }) 

  await fetch('/subscribe',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription.toJSON())
    }
  );
  return subscription;
};

const unsubscribe = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();


  await subscription.unsubscribe();


  await fetch("/unsubscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription.toJSON())
  });
  writeSubscriptionStatus("Unsubscribed");
};

const writeSubscriptionStatus = subscriptionStatus => {
  document.getElementById("status").innerHTML = subscriptionStatus;
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};