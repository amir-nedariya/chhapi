// Mock Notification API

export const getMyNotificationsAPI = async () => {
  return {
    data: {
      data: [
        { _id: "n1", title: "Welcome!", message: "Welcome to the dummy prototype app.", isRead: false, createdAt: new Date().toISOString() },
        { _id: "n2", title: "New Donation", message: "A new donation of ₹5000 was received.", isRead: true, createdAt: new Date().toISOString() }
      ]
    }
  };
};

export const markNotificationReadAPI = async (id) => {
  return { data: { message: "Notification marked as read" } };
};

export const markAllNotificationsReadAPI = async () => {
  return { data: { message: "All notifications marked as read" } };
};
