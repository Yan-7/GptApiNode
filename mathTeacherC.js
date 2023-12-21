import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';
import readline from 'readline';

// Create a Readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create an OpenAI connection
const openai = new OpenAI({
  apiKey: "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",
});

// Function to ask a question using readline
async function askQuestion(question) {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  try {
    // Use the existing assistant ID
    const assistantId = "asst_dlcWWnNB075R4PK6GsVeQxBi";

    console.log("\nHello there, I'm your ink advisor. Ask some complicated questions.\n");

    // Create a thread
    const thread = await openai.beta.threads.create();

    let keepAsking = true;
    while (keepAsking) {
      const userQuestion = await askQuestion("\nWhat is your question? ");

      // Pass in the user question into the existing thread
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: userQuestion,
      });

      // Use runs to wait for the assistant response and then retrieve it
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId,  // Use the existing assistant ID
      });

      let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

      while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      }

      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessageForRun = messages.data
        .filter(
          (message) => message.run_id === run.id && message.role === "assistant"
        )
        .pop();

      if (lastMessageForRun) {
        console.log(`${lastMessageForRun.content[0].text.value} \n`);
      }

      const continueAsking = await askQuestion("Do you want to ask another question? (yes/no) ");
      keepAsking = continueAsking.toLowerCase() === "yes";

      if (!keepAsking) {
        console.log("Alrighty then, I hope you learned something!\n");
      }
    }

    // Close the readline interface
    rl.close();
  } catch (error) {
    console.error(error);
  }
}

main();
