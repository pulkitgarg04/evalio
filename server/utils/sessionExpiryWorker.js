const TestSession = require('../models/TestSession');
const config = require('../config/config');
const { finalizeSession } = require('./sessionLifecycle');

let intervalRef = null;
let isRunning = false;

async function sweepExpiredSessions() {
    if (isRunning) {
        return;
    }

    isRunning = true;
    try {
        const now = new Date();
        const sessions = await TestSession.find({
            status: 'IN_PROGRESS',
            endTime: { $lte: now }
        }).select('_id');

        for (const session of sessions) {
            try {
                await finalizeSession(session, { status: 'EXPIRED' });
            } catch (error) {
                console.error(`Failed to auto-finalize session ${session._id}: ${error.message}`);
            }
        }
    } catch (error) {
        console.error(`Expired session sweep failed: ${error.message}`);
    } finally {
        isRunning = false;
    }
}

function startSessionExpiryWorker() {
    if (intervalRef) {
        return;
    }

    const intervalMs = Math.max(5, Number(config.SESSION_SWEEP_INTERVAL_SECONDS) || 30) * 1000;

    // Run once on startup so already-expired sessions are finalized promptly.
    void sweepExpiredSessions();
    intervalRef = setInterval(() => {
        void sweepExpiredSessions();
    }, intervalMs);
}

module.exports = {
    startSessionExpiryWorker,
    sweepExpiredSessions
};
