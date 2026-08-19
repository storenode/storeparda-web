import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

try {
  const result = await octokit.rest.issues.create({
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    title: "Test from Octokit",
    body: "Testing Octokit library",
  });
  console.log("✅ Success! Issue created:", result.data.number);
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error("Response data:", error.response?.data);
}
