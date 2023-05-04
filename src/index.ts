import { create } from 'ipfs-http-client';

const defaultApiUrl = 'http://127.0.0.1:5001';

const apiUrl = process.env.IPFS_API || defaultApiUrl;
const ipfs = create({ url: apiUrl });

async function datachain() {
    try {
        const content = "Hello World";

        const directoryPath = '/state';
        await ipfs.files.mkdir(directoryPath, { parents: true });

        const outputPath = `${directoryPath}/output.file`;
        await ipfs.files.write(outputPath, content, { create: true });

    } catch (error) {
        console.error('Error writing content to IPFS: ', error);

    }
}
datachain().catch((err) => { console.error(err); });
