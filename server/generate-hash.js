import bcrypt from 'bcrypt';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter your administrator password: ', async (password) => {
    const hash = await bcrypt.hash(password, 10);

    console.log('\nYour password hash is:\n');
    console.log(hash);

    rl.close();
});