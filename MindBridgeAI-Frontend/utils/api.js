// Burnout score get பண்ணு
export const getBurnoutScore = async (userId, userType) => {
  try {
    const response = await api.get(
      `/burnout/${userId}?user_type=${userType}`
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

// Weekly report get பண்ணு
export const getWeeklyReport = async (userId, userType, language) => {
  try {
    const response = await api.get(
      `/weekly-report/${userId}?user_type=${userType}&language=${language}`
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

// Proactive alert check பண்ணு
export const getProactiveAlert = async (userId, userType, language) => {
  try {
    const response = await api.get(
      `/alert/${userId}?user_type=${userType}&language=${language}`
    );
    return response.data;
  } catch (error) {
    return null;
  }
};