// alive.ts

export function pingWebsite() {
  const website = 'https://faizur.onrender.com';

  fetch(website)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log(`Website ${website} pinged successfully`);
    })
    .catch(error => console.error(`There was a problem with the ping for ${website}:`, error));
}

setInterval(pingWebsite, 40000);