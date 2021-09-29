import CryptoJS from 'crypto-js';

export function camelToSentence(text) {
	const result = text.replace(/([A-Z])/g, ' $1');
	return result.toUpperCase();
}

export function removeIPAC(string) {
	// let sm=string.toLowerCae()
	return string.replace('Ipac ', 'IPAC ');
}

export function decryptor(encryptedText) {
	try {
		return CryptoJS.AES.decrypt(encryptedText, process.env.REACT_APP_AES_KEY).toString(CryptoJS.enc.Utf8);
	} catch (error) {
		console.log('Malformed Text');
	}
}
