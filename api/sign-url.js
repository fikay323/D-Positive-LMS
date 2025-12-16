/* eslint-env node */
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
	res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}

	try {
		const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;

		if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
			console.error("MISSING R2 KEYS in .env file");
			return res.status(500).json({ error: 'Server misconfiguration: Missing Keys' });
		}

		const r2 = new S3Client({
			region: "auto",
			endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
			credentials: {
				accessKeyId: R2_ACCESS_KEY_ID,
				secretAccessKey: R2_SECRET_ACCESS_KEY,
			},
		});

		if (req.method === 'POST') {
			const { fileName, fileType } = req.body;

			if (!fileName || !fileType) {
				return res.status(400).json({ error: 'Missing fileName or fileType' });
			}

			const key = `videos/${Date.now()}-${fileName}`;

			const command = new PutObjectCommand({
				Bucket: R2_BUCKET_NAME,
				Key: key,
				ContentType: fileType,
			});

			const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 600 });

			return res.status(200).json({ uploadUrl, key });
		}

		if (req.method === 'GET') {
			const { key } = req.query;

			if (!key) {
				return res.status(400).json({ error: 'Missing file key' });
			}

			const command = new GetObjectCommand({
				Bucket: R2_BUCKET_NAME,
				Key: key,
			});

			const url = await getSignedUrl(r2, command, { expiresIn: 3600 });

			return res.status(200).json({ url });
		}

		return res.status(405).json({ error: 'Method not allowed' });

	} catch (error) {
		console.error("🔥 R2 ERROR:", error);
		return res.status(500).json({ error: error.message });
	}
}