import openai from "openai"; // Import the default export

const apiKey = "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"; 

const openaiInstance = new openai({
  apiKey,
  version: "v1", // Specify the API version you want to use
});

async function main() {
  const conversation = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "how do i connect you to my open ai assistant? the assistant id is: asst_dlcWWnNB075R4PK6GsVeQxBi" }, // User's message
  ];

  const completion = await openaiInstance.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: conversation,
  });

  // Extract the model's reply from the completion
  const modelReply = completion.choices[0].message.content;

  console.log("Assistant's reply:", modelReply);
}

main();
