const hadera = require('./hedera');

test('Fetch data can fetch test data', async () => {
    let blob = Buffer.from(await hadera.getFileContent('0.0.2554394'));
    let temp = blob.toString('utf8');

    expect(temp).toBe("07123e1f482356c415f684407a3b8723e10b2cbbc0b8fcd6282c49d37c9c1abc");

});