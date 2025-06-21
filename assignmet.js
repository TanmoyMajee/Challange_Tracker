Daily Challenge Tracker API - Complete Endpoint Documentation
Database Schema Reference
Users Collection
javascript{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
Challenges Collection
javascript{
  _id: ObjectId,
  title: String (required),
  description: String,
  createdBy: ObjectId (ref: User, required),
  startDate: Date (required),
  endDate: Date (required),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
ChallengeAssignments Collection
javascript{
  _id: ObjectId,
  challengeId: ObjectId (ref: Challenge, required),
  assignedTo: ObjectId (ref: User, required),
  assignedBy: ObjectId (ref: User, required),
  status: String (enum: ['active', 'completed', 'paused'], default: 'active'),
  createdAt: Date,
  updatedAt: Date
}
DailyProgress Collection
javascript{
  _id: ObjectId,
  challengeAssignmentId: ObjectId (ref: ChallengeAssignment, required),
  date: Date (required),
  isCompleted: Boolean (default: false),
  notes: String (optional),
  completedAt: Date (optional),
  createdAt: Date
}

Complete API Endpoints Documentation
Authentication Endpoints
POST /api/auth/register

Access: Public (anyone can register)
Purpose: Create new user account with username, email, password
Request Body: {username, email, password, confirmPassword}
Response: User object without password + success message
Validation: Email format, password strength, unique username/email check

POST /api/auth/login

Access: Public (anyone can login)
Purpose: Authenticate user credentials and return JWT token
Request Body: {email/username, password}
Response: JWT token + user details (role, username, email)
Logic: Verify credentials, generate JWT with user ID and role

POST /api/auth/logout

Access: Protected (authenticated users only)
Purpose: Invalidate JWT token and logout user session
Headers: Authorization Bearer token required
Response: Success message confirming logout
Logic: Add token to blacklist or handle client-side token removal

GET /api/auth/profile

Access: Protected (users see own profile, )
Purpose: Retrieve current user's profile information
Headers: Authorization Bearer token required
Response: User profile data excluding password
Logic: Extract user ID from JWT, return user data

PUT /api/auth/profile

Access: Protected (users update own profile, admins update any profile)
Purpose: Update user profile information like username, email
Request Body: {username?, email?, currentPassword?, newPassword?}
Response: Updated user profile data
Logic: Validate current password if changing password, update allowed fields


Challenge Management Endpoints
GET /api/challenges

Access: Protected (users see own challenges, admins see all challenges)
Purpose: Retrieve list of challenges based on user role
Query Params: ?page=1&limit=10&status=active&search=title
Response: Paginated list of challenges with metadata
Logic: Filter by createdBy for users, return all for admins

POST /api/challenges

Access: Protected (authenticated users and admins can create)
Purpose: Create new challenge with title, description, dates
Request Body: {title, description, startDate, endDate}
Response: Created challenge object with generated ID
Logic: Set createdBy to current user, validate dates, save challenge

GET /api/challenges/:id

Access: Protected (users see if creator/assignee, admins see all)
Purpose: Retrieve specific challenge details by challenge ID
Params: Challenge ID in URL
Response: Complete challenge details with assignments if applicable
Logic: Check if user is creator or assigned, admins bypass check

PUT /api/challenges/:id

Access: Protected (only challenge creator or admin can update)
Purpose: Update challenge title, description, dates, or status
Request Body: {title?, description?, startDate?, endDate?, isActive?}
Response: Updated challenge object
Logic: Verify user is creator or admin, validate new dates

DELETE /api/challenges/:id

Access: Protected (only challenge creator or admin can delete)
Purpose: Soft delete challenge and related assignments/progress
Params: Challenge ID in URL
Response: Success message confirming deletion
Logic: Set isActive to false, cascade to assignments

GET /api/challenges/status/:status

Access: Protected (users see own, admins see all by status)
Purpose: Filter challenges by status (current/upcoming/completed)
Params: Status in URL (current/upcoming/completed)
Response: List of challenges matching status criteria
Logic: Calculate status based on current date vs start/end dates


Challenge Assignment Endpoints
POST /api/challenges/:id/assign

Access: Protected (challenge creator or admin can assign)
Purpose: Assign challenge to one or multiple users
Request Body: {userIds: [ObjectId], assignedBy: ObjectId}
Response: List of created assignment objects
Logic: Create assignment records, send notifications to assigned users

GET /api/assignments

Access: Protected (users see own assignments, admins see all)
Purpose: Retrieve challenges assigned to current user
Query Params: ?status=active&page=1&limit=10
Response: Paginated list of user's challenge assignments
Logic: Filter by assignedTo for users, return all for admins

PUT /api/assignments/:id/status

Access: Protected (assigned user or admin can update status)
Purpose: Update assignment status (active/completed/paused)
Request Body: {status: 'active'|'completed'|'paused'}
Response: Updated assignment object
Logic: Verify user is assigned to challenge or is admin


Progress Tracking Endpoints
POST /api/progress

Access: Protected (assigned users mark progress, admins can mark any)
Purpose: Mark daily progress for assigned challenge
Request Body: {challengeAssignmentId, date, isCompleted, notes?}
Response: Created progress entry with completion details
Logic: Check if user assigned to challenge, prevent duplicate entries per date

GET /api/progress/:assignmentId

Access: Protected (assigned user sees own progress, admins see all)
Purpose: Retrieve all progress entries for specific assignment
Params: Assignment ID in URL
Query Params: ?startDate=2024-01-01&endDate=2024-12-31
Response: List of daily progress entries with completion data
Logic: Verify user access to assignment, filter by date range

PUT /api/progress/:id

Access: Protected (user who created progress entry or admin)
Purpose: Update existing progress entry completion status or notes
Request Body: {isCompleted?, notes?}
Response: Updated progress entry object
Logic: Verify ownership of progress entry or admin role

GET /api/progress/history

Access: Protected (users see own history, admins see all users)
Purpose: Retrieve complete progress history for current user
Query Params: ?startDate=2024-01-01&endDate=2024-12-31&challengeId=xxx
Response: Comprehensive progress history with challenge details
Logic: Aggregate progress across all assignments for user

GET /api/progress/history/filter

Access: Protected (users filter own data, admins filter any user)
Purpose: Advanced filtering of progress history by multiple criteria
Query Params: ?userId=xxx&status=completed&dateRange=last30days
Response: Filtered progress entries matching specified criteria
Logic: Apply multiple filters, support date ranges and status filters


Reminders & Notifications Endpoints
GET /api/reminders/today

Access: Protected (users see own reminders, admins see all today)
Purpose: Get all pending challenges that need attention today
Response: List of assignments with incomplete progress for current date
Logic: Find active assignments without today's progress entry

GET /api/reminders/user/:userId

Access: Protected (admin only, view reminders for specific user)
Purpose: Retrieve reminder-worthy challenges for specified user
Params: User ID in URL
Response: User's pending challenges requiring daily update
Logic: Admin privilege check, return user's incomplete challenges


Statistics Endpoints (Bonus)
GET /api/stats/user

Access: Protected (users see own stats, admins see any user stats)
Purpose: Calculate user's personal completion statistics and metrics
Query Params: ?userId=xxx (admin only)&period=month
Response: Completion rates, streaks, total challenges, success metrics
Logic: Aggregate progress data, calculate percentages and trends

GET /api/stats/global

Access: Protected (admin only, system-wide statistics)
Purpose: Provide platform-wide statistics for administrative overview
Response: Total users, challenges, completion rates, popular challenges
Logic: Aggregate all user data, calculate system metrics

GET /api/stats/streaks

Access: Protected (users see own streaks, admins see any user)
Purpose: Calculate and return user's completion streaks data
Query Params: ?userId=xxx (admin only)
Response: Current streak, longest streak, streak history
Logic: Analyze consecutive completion patterns in progress data


Admin-Only Endpoints
GET /api/admin/users

Access: Protected (admin only, view all registered users)
Purpose: Administrative user management and overview
Query Params: ?page=1&limit=20&search=username&role=user
Response: Paginated list of all users with activity metrics
Logic: Admin role verification, return user data with stats

GET /api/admin/challenges

Access: Protected (admin only, view all system challenges)
Purpose: Administrative challenge management and oversight
Query Params: ?status=active&createdBy=userId&page=1
Response: All challenges with creator info and assignment counts
Logic: Admin role check, comprehensive challenge data

GET /api/admin/progress

Access: Protected (admin only, view all progress data)
Purpose: System-wide progress monitoring and analytics
Query Params: ?userId=xxx&challengeId=xxx&dateRange=month
Response: Filtered progress entries across all users
Logic: Admin verification, aggregated progress data


Social Sharing Endpoints (Bonus)
POST /api/share/challenge/:id

Access: Protected (challenge creator or assigned user can share)
Purpose: Generate public shareable link for completed challenge
Params: Challenge ID in URL
Response: Shareable token and public URL for challenge
Logic: Verify user access, generate time-limited sharing token

GET /api/shared/:token

Access: Public (anyone with valid token can view)
Purpose: Display shared challenge completion without authentication
Params: Sharing token in URL
Response: Public view of challenge details and completion status
Logic: Validate token, return sanitized challenge data


Admin Access Summary
Admins have elevated access to ALL endpoints:

Can view/modify any user's data
Can access all challenges regardless of creator
Can see system-wide statistics
Can manage all assignments and progress
Have dedicated admin-only endpoints for user management

Regular users have restricted access:

Can only see/modify their own created challenges
Can only view challenges assigned to them
Can only update their own progress
Cannot access other users' data
Cannot access admin-specific endpoints
RetryClaude can make mistakes. Please double-check responses. Sonnet 4