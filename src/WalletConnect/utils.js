export function fromDecimalToHex(number) {
    if (typeof number !== 'number') throw new Error('The input provided should be a number');
    return `0x${number.toString(16)}`;
}

export function verifyChainId(chainId) {
    if (typeof chainId === 'number') chainId = fromDecimalToHex(chainId);
    return chainId;
}