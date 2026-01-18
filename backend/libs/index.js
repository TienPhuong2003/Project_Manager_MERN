import ActivityLog from "../models/activity.js";

const recordActivity = async (
  userId,
  action,
  resourceId,
  resourceType,  
  details
) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      resourceId,
      resourceType,
      details,
    });
  } catch (error) {
    console.log(error);
  }
};

export { recordActivity };
