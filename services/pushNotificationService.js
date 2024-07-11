import { Expo } from "expo-server-sdk";

const expo = new Expo();

export async function sendPushNotifications(messages) {
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error("Error sending push notification:", error);
        }
    }

    return tickets;
}
