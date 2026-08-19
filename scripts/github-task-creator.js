import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
// Get credentials from environment
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;

// Validate credentials
if (!GITHUB_TOKEN || !OWNER || !REPO) {
  console.error("❌ Missing required env variables:");
  console.error(`  GITHUB_TOKEN: ${GITHUB_TOKEN ? "✓" : "✗"}`);
  console.error(`  GITHUB_OWNER: ${OWNER ? "✓" : "✗"}`);
  console.error(`  GITHUB_REPO: ${REPO ? "✓" : "✗"}`);
  process.exit(1);
}

const API_BASE = "https://api.github.com";

// Function to create an issue/task using fetch
export async function createTask(title, description, labels = []) {
  try {
    console.log(`  Creating: "${title.substring(0, 50)}..."`);

    const response = await fetch(`${API_BASE}/repos/${OWNER}/${REPO}/issues`, {
      method: "POST",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        title: title,
        body: description,
        labels: labels,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `GitHub API Error: ${response.status} - ${data.message || response.statusText}`,
      );
    }

    console.log(`  ✅ Created issue #${data.number}`);
    return data;
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    throw error;
  }
}

// Main function: Parse constitution.md and create tasks
export async function createTasksFromConstitution(constitutionContent) {
  const lines = constitutionContent.split("\n");
  let currentSection = "";
  let taskCount = 0;
  let failedCount = 0;

  for (const line of lines) {
    // Section headers
    if (line.startsWith("## ")) {
      currentSection = line.replace("## ", "").trim();
      console.log(`\n📋 Section: ${currentSection}`);
    }

    // Task items (lines starting with - or *)
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const taskTitle = line.replace(/^[\-\*]\s/, "").trim();

      if (taskTitle.length > 0) {
        const description = `**Section:** ${currentSection}\n\nFrom architecture guidelines in constitution.md`;

        try {
          await createTask(taskTitle, description, [
            "architecture",
            "from-constitution",
          ]);
          taskCount++;
          // Add delay to avoid rate limiting
          await new Promise((r) => setTimeout(r, 1000));
        } catch (error) {
          failedCount++;
          // Continue with next task instead of stopping
        }
      }
    }
  }

  console.log(`\n\n✅ Summary: ${taskCount} created, ${failedCount} failed`);
  return { created: taskCount, failed: failedCount };
}
