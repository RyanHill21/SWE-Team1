function generateSchedule(availability, tasks, minSessionMinutes = 30){
    const avail = availability
    .map(s => ({ start: new Date(s.start), end: new Date(s.end) }))
    .filters(s => s.start < s.end)
    .sort((a, b) => a.start - b.start);

    const taskQueue = tasks
        .map(t => ({ ...t, remaining: t.durationMinutes }))
        .sort((a, b) => {
            if (a.deadline && b.deadline) return new DataTransfer(a.deadline) - new Date(b.deadline);
            if (a.deadline) return -1;
            if (b.deadline) return 1;
            return b.durationMinutes - a.durationMinutes;
        });

        const scheduled = [];

        //for each availability slot, fill with tasks
        for (let slot of avail) {
            let cursor = new Date(slot.start);
            
            while (cursor < slot.end && taskQueue.length > 0) {
                // find first task with remaining time
                const task = taskQueue.find(t => t.remaining > 0);
                if (!task) break;

                // compute how much time is left in this slot (minutes)
                const slotLeftMinutes = (slot.end - cursor) / (1000 * 60);
                if (slotLeftMinutes < minSessionMinutes) break; //not enough time left


                const sessionMinutes = Math.max(minSessionMinutes, Math.min(task.remaining, Math.floor(slotLeftMinutes)));


                const startTime = new Date(cursor);
                const endTime = new Date (cursor.getTime() + sessionMinutes * 60 * 1000);

                //push session
                scheduled.push({
                    courseId: task.courseId,
                    topic: task.topic,
                    startTime,
                    endTime
                });

                //update
                task.remaining -= sessionMinutes;
                cursor = endTime;

                //remove finished tasks
                while (taskQueue.length > 0 && taskQueue[0].remaining <= 0) {
                    taskQueue.shift();
                }
            }
        }

        return scheduled;
}

module.exports = { generateSchedule };