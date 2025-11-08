import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async (activityData) => {
  try {
    if (typeof activityData === 'string') {
      throw new Error('logActivity now expects an object. Please pass { user, action, category, details, userType, ipAddress, userAgent, status }');
    }
    
    await ActivityLog.create({
      user: activityData.user,
      action: activityData.action,
      category: activityData.category,
      details: activityData.details || {},
      userType: activityData.userType,
      ipAddress: activityData.ipAddress,
      userAgent: activityData.userAgent,
      status: activityData.status || 'success'
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

export const createActivityLog = async (req, action, category, details, status = 'success') => {
  try {
    await logActivity({
      user: req.user?.id,
      action,
      category,
      details,
      userType: req.user?.role || 'system',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status
    });
  } catch (error) {
    console.error('Failed to create activity log:', error);
  }
};
