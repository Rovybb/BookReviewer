const attributes = [
    'Happy',
    'Cheerful',
    'Jolly',
    'Smart',
    'Brave',
    'Calm',
    'Wise',
    'Clever',
    'Kind',
    'Friendly',
    'Loyal',
    'Goofy',
];

const nouns = [
    'Panda',
    'Doggie',
    'Bear',
    'Book',
    'Tree',
    'Bat',
    'Kitty',
    'Puppy',
    'Ninja',
    'Pirate',
    'Robot',
    'Monster',
];

/**
 * Generates a random username of the form ```AttributeNoun0000```.
 * 
 * Example: ```HappyPanda1234```
 * @returns {string} The generated username.
 */
const usernameGenerator = () => {
    const randomAttribute = attributes[Math.floor(Math.random() * attributes.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 8999) + 1000;
    return `${randomAttribute}${randomNoun}${randomNumber}`;
};

export default usernameGenerator;
