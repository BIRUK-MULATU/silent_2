// File: index.js
import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit();

// Start date: Jan 1, 2021
const START_DATE = moment("2021-01-01");
// End date: today
const END_DATE = moment().startOf("day");

// Random commits per day (adjust as needed)
const getRandomCommits = () => random.int(1, 3); 

// Format date clearly
const formatDate = (date) => date.format("YYYY-MM-DD HH:mm:ss");

const makeCommits = async () => {
  let currentDate = START_DATE.clone();

  while (currentDate.isSameOrBefore(END_DATE, "day")) {
    const commitsPerDay = getRandomCommits();

    for (let i = 0; i < commitsPerDay; i++) {
      // Random hour/minute/second
      const date = currentDate
        .clone()
        .hour(random.int(0, 23))
        .minute(random.int(0, 59))
        .second(random.int(0, 59));

      const formattedDate = formatDate(date);
      const data = { date: formattedDate };

      // Write JSON file
      await jsonfile.writeFile(path, data);

      // Add & commit with specific date
      await git.add([path]);
      await git.commit(`Commit on ${formattedDate}`, { "--date": date.toISOString() });
      console.log(`Committed: ${formattedDate}`);
    }

    // Move to next day
    currentDate.add(1, "day");
  }

  // Push all commits at the end
  await git.push();
  console.log("All commits pushed successfully!");
};

makeCommits();