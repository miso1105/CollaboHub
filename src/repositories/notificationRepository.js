exports.createNotification = async (connection, { senderId, notificationContent, type, targetId }) => {
    const query = `INSERT INTO notifications (sender_id, notification_content, type, target_id) VALUES (?, ?, ?, ?)`;
    await connection.execute(query, [senderId, notificationContent, type, targetId]);
};