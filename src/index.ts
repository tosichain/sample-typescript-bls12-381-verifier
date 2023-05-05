import { create } from 'ipfs-http-client';
import { join } from 'path';
import { bls12_381 } from '@noble/curves/bls12-381';

const defaultApiUrl = 'http://127.0.0.1:5001';

const apiUrl = process.env.IPFS_API || defaultApiUrl;
const ipfs = create({ url: apiUrl });

const inputDir = '/input/bls';
const stateDir = '/state/bls';

async function datachain() {
    try {
        const content = "Hello World";

        const directoryPath = '/state';
        await ipfs.files.mkdir(directoryPath, { parents: true });

        const outputPath = `${directoryPath}/output.file`;
        await ipfs.files.write(outputPath, content, { create: true });

        await verifySignature(inputDir, stateDir);

    } catch (error) {
        console.error('Error writing content to IPFS: ', error);

    }
}

async function verifySignature(inputDir: string, stateDir: string) {
    try {
        await ipfs.files.stat(inputDir);
    } catch (error) {
        process.exit(0);
    }
    await ipfs.files.mkdir(stateDir, { parents: true});

    for await (const file of ipfs.files.ls(inputDir)) {
        const filePath = join(inputDir, file.name);
        const fileContent = await ipfs.files.read(filePath);

        const { messageHex, signatureHex, publicKeyHex }= JSON.parse(fileContent.toString());
        const isValid = bls12_381.verify(signatureHex, messageHex, publicKeyHex);
        const result = isValid ? '1' : '0';

        const outputFilePath = join(stateDir, file.name);
        await ipfs.files.write(outputFilePath, result, { create: true});

    }

}
datachain().catch((err) => { console.error(err); });
