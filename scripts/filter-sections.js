const fs = require('fs');
const process = require('process');

const args = process.argv.slice(2);

fs.readFile(args[0], 'utf8', (err, data) => {
    const page = JSON.parse(data);
    for (const category of page.categories) {
        category.sections = category.sections.filter(section => section.version !== 'Angular');
        category.sections.forEach(section => {
            delete section.deprecated;
            delete section.deprecatedFor;
        });
    }

    page.categories = page.categories.filter(category => category.sections.length > 0);

    fs.writeFile(args[0] + '.new', JSON.stringify(page, null, 4), 'utf8', err => {
        console.log('done');
    });
});
