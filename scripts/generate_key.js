/**
 * This script generates VAPID keys for web push notifications.
 * Use it to create a new set of keys for your application.
 * Add your keys in the .env file as follows:
 * VAPID_PUBLIC_KEY=your_public_key
 * VAPID_PRIVATE_KEY=your_private_key 
*/
import webPush from 'web-push'

const vapidKeys = webPush.generateVAPIDKeys()

console.log(vapidKeys)