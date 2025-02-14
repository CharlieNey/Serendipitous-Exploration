const readline = require('readline');
const fs = require('fs');
const csv = require('csv-parser');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const questions = [
    {
        question: "How would you describe your past experience?",
        answers: ['Scribe', 'Alchemist', 'Craftsmen']
    },
    {
        question: "Choose a quest",
        answers: ['EASY, Reward: $1000', ' MODERATE, Reward: $2000', 'HARD, Reward: $3000']
    },
    {
        question: "Pick a companion",
        answers: ['Brilliant Bird', 'Watchful Whale', 'Resilient Racoon']
    }
];

let answers = [];
let index = 0;
let departments = [];

fs.createReadStream('departments.csv')
    .pipe(csv())
    .on('data', (row) => {
        departments.push(row);
    })
    .on('end', () => {
        askQuestion();
    });

const askQuestion = () => {
    if (index < questions.length) {
        const q = questions[index];
        console.log(`\n${q.question}`);
        q.answers.forEach((ans, i) => console.log(`${i + 1}. ${ans}`));
        rl.question('Enter the number of your choice: ', (answer) => {
            const choice = parseInt(answer);
            if (choice > 0 && choice <= q.answers.length) {
                answers.push(q.answers[choice - 1]);
                index++;
                askQuestion();
            } else {
                console.log('Invalid choice, try again.');
                askQuestion();
            }
        });
    } else {
        generateResult();
    }
};

const generateResult = () => {
    console.log("\nBased on your answers, your best-matching university department is...");
    
    let filteredDepartments = departments;
    
    if (answers.includes('Red') || answers.includes('Partying')) {
        filteredDepartments = filteredDepartments.filter(dept => dept.Category === 'Social Sciences' || dept.Category === 'Arts');
    } 
    if (answers.includes('Blue') || answers.includes('Reading')) {
        filteredDepartments = filteredDepartments.filter(dept => dept.Category === 'Humanities' || dept.Category === 'Sciences');
    }
    if (answers.includes('Green') || answers.includes('Hiking')) {
        filteredDepartments = filteredDepartments.filter(dept => dept.Category === 'Environmental Studies' || dept.Category === 'Biological Sciences');
    }
    if (answers.includes('Gaming')) {
        filteredDepartments = filteredDepartments.filter(dept => dept.Category === 'Computer Science' || dept.Category === 'Engineering');
    }
    
    if (filteredDepartments.length > 0) {
        console.log(`You should consider: ${filteredDepartments[0].Department}`);
    } else {
        console.log("We couldn't determine a perfect match, but you have diverse interests!");
    }
    
    rl.close();
};
