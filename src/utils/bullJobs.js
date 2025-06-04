import { Queue } from "bullmq";

// create queue instance for sending email
export const emailJob = new Queue("send-Email");

// create queue instance for decline mentor request after 48 hours delay
export const declineRequestJob = new Queue("decline-Request");

export async function addEmailJob(sendToEMail, subject, htmlBody) {
  await emailJob.add("sendEmail", {
    sendToEMail: sendToEMail,
    subject: subject,
    htmlBody: htmlBody,
  });
  console.log("sendEmail job is added");
}

/**
 *
 * @param {String} id
 */
export async function addDeclineRequestJob(id) {
  const delayTime = 30 * 1000; // 30 seconds in milliseconds

  await declineRequestJob.add(
    "decline request",
    {
      id: id,
    },
    {
      delay: delayTime, // (days*24*60*60*1000)in millisecond
    },
  );
  console.log(`Decline request job is added with ${delayTime / 1000} delay`);

  // Initialize the countdown timer
  let remainingTime = delayTime;

  const countdown = setInterval(() => {
    remainingTime -= 1000; // Decrease the remaining time by 1 second (1000ms)
    console.log(`${remainingTime / 1000}`);

    if (remainingTime <= 0) {
      clearInterval(countdown);
      console.log("decline-request Job is added to be processed!");
    }
  }, 1000); // Update every second
}

/**
 * @description - drains the queue
 * @param {Queue} jobQueue - the queue to be drained
 */
export async function drainage(jobQueue) {
  await jobQueue.drain();
  console.log(`${jobQueue.name} queue drained`);
}

// addDeclineRequestJob();
// drainage(emailJob);
// drainage(declineRequestJob);
