const  { getDailyCasesWorldwide } = require('../services/cases.service');

describe('Cases Service', () => {
    it(`should get Daily Cases`, (done) => {
        getDailyCasesWorldwide().then(r => {
            console.log('data: ', r);
            done();
        })

    });
})